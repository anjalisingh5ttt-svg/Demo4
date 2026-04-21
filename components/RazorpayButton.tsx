"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/cartStore";
import { useAddressStore } from "@/store/addressStore";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

async function loadRazorpayScript() {
  if (
    document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    )
  ) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayButton() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const addresses = useAddressStore((state) => state.addresses);
  const selectedAddressId = useAddressStore((state) => state.selectedAddressId);

  const selectedAddress =
    addresses.find((address) => address._id === selectedAddressId) ||
    addresses.find((address) => address.isDefault) ||
    addresses[0] ||
    null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedCartItems = items.map((item: any) => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  const totalAmount = items.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (total: number, item: any) => total + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    if (!user) {
      alert("Please sign in first");
      return;
    }

    if (!selectedAddress) {
      alert("Please select an address first");
      return;
    }

    if (!items.length) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await loadRazorpayScript();

    if (!res) {
      setError("Payment service failed to load. Please try again.");
      setLoading(false);
      return;
    }

    const orderRes = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: totalAmount,
      }),
    });

    const data = await orderRes.json();

    if (!data.success) {
      setError("Failed to create order. Please try again.");
      setLoading(false);
      return;
    }

    const order = data.order;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "BODHIQ",
      description: "Luxury Timepiece Purchase",
      order_id: order.id,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async function (response: any) {
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...response,
            amount: order.amount / 100,
            currency: order.currency,
            clerkUserId: user.id,
            customerName:
              selectedAddress.fullName || user.fullName || "Guest User",
            customerEmail:
              user.primaryEmailAddress?.emailAddress || "noemail@example.com",
            cartItems: formattedCartItems,
            shippingAddress: {
              fullName: selectedAddress.fullName,
              street: selectedAddress.street,
              city: selectedAddress.city,
              state: selectedAddress.state,
              postalCode: selectedAddress.postalCode,
              country: selectedAddress.country,
              phone: selectedAddress.phone,
            },
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          clearCart();
          router.push(`/checkout/success?orderId=${verifyData.orderId}`);
        } else {
          setError("Payment verification failed. Please contact support.");
          setLoading(false);
        }
      },

      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },

      theme: {
        color: "#d4a853",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="relative w-full sm:w-auto px-10 py-4 bg-[#d4a853] text-black rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#e8c97a] transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </motion.span>
          ) : (
            <motion.span
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Pay ₹{totalAmount.toLocaleString("en-IN")} Securely
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 p-4 rounded-xl border border-red-500/15 bg-red-500/5"
          >
            <span className="text-red-400 text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}