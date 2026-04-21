import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { sanityFetch } from "@/sanity/lib/live";
import { userOrderByIdQuery } from "@/sanity/lib/queries";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";
import InvoiceGenerator from "@/components/InvoiceGenerator";

type CartItem = {
  name: string;
  quantity: number;
  price: number;
};

type ShippingAddress = {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
};

const timelineSteps = [
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Package },
];

function getTimelineIndex(status: string) {
  const s = status.toLowerCase();
  if (s === "paid" || s === "confirmed") return 0;
  if (s === "processing") return 1;
  if (s === "shipped") return 2;
  if (s === "delivered") return 3;
  return 0;
}

export default async function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif mb-4">Please sign in</h1>
          <p className="text-gray-400">
            You need to be signed in to view order details.
          </p>
        </div>
      </main>
    );
  }

  const { orderId } = params;

  const { data } = await sanityFetch({
    query: userOrderByIdQuery,
    params: {
      orderId,
      clerkUserId: userId,
    },
  });

  const order = data as Order | null;

  if (!order) {
    return (
      <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center mt-20">
          <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-gray-600 mx-auto mb-6">
            <Package size={28} />
          </div>
          <h1 className="text-2xl font-serif mb-3">Order Not Found</h1>
          <p className="text-gray-500 text-sm mb-8">
            This order may have been removed or does not exist.
          </p>
          <Link
            href="/account/orders"
            className="inline-block px-6 py-2.5 border border-[#d4a853] text-[#d4a853] rounded-full text-xs uppercase tracking-widest hover:bg-[#d4a853] hover:text-black transition duration-300"
          >
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const currentStep = getTimelineIndex(order.status);

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-[#d4a853] transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Back to Orders
        </Link>

        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
              Order Details
            </p>
            <h1 className="text-3xl md:text-5xl font-serif mb-2">
              {order.orderNumber}
            </h1>
            <p className="text-gray-500 text-sm">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="shrink-0">
            <InvoiceGenerator
              order={order}
              variant="secondary"
              buttonText="Download Invoice"
            />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8 mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-px bg-white/5" />
            <div
              className="absolute top-5 left-0 h-px bg-[#d4a853]/40 transition-all duration-1000"
              style={{
                width: `${(currentStep / (timelineSteps.length - 1)) * 100}%`,
              }}
            />

            {timelineSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i <= currentStep;
              const isCurrent = i === currentStep;

              return (
                <div
                  key={step.key}
                  className="relative z-10 flex flex-col items-center text-center"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                      isCurrent
                        ? "bg-[#d4a853] border-[#d4a853] text-black"
                        : isActive
                        ? "bg-[#d4a853]/10 border-[#d4a853]/30 text-[#d4a853]"
                        : "bg-white/[0.03] border-white/10 text-gray-600"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-[0.15em] mt-3 ${
                      isActive ? "text-[#d4a853]" : "text-gray-600"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">
              Items Ordered
            </h3>
            {order.cartItems?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02]"
              >
                <div className="w-16 h-16 rounded-xl border border-white/5 bg-white/[0.03] flex items-center justify-center text-[#d4a853]/30 shrink-0">
                  <Package size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-[15px] font-medium">{item.name}</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="text-sm text-white font-medium shrink-0">
                  ₹{item.price}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-5">
                Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Payment ID", value: order.razorpayPaymentId },
                  {
                    label: "Status",
                    value: order.status,
                    accent: true,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-gray-500">{row.label}</span>
                    <span
                      className={`${
                        row.accent ? "text-[#d4a853]" : "text-gray-300"
                      } text-xs font-mono`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-white font-medium text-lg">
                    ₹{order.amount}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-5">
                Shipping Address
              </h3>
              <div className="text-sm text-gray-300 space-y-1 leading-7">
                <p className="text-white font-medium">
                  {order.shippingAddress?.fullName}
                </p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
                <p>
                  {order.shippingAddress?.postalCode},{" "}
                  {order.shippingAddress?.country}
                </p>
                <p className="text-gray-500 mt-2">
                  {order.shippingAddress?.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}