import { NextResponse } from "next/server";
import crypto from "crypto";
import { backendClient } from "@/sanity/lib/backendClient";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      clerkUserId,
      amount,
      currency,
      customerName,
      customerEmail,
      cartItems,
      shippingAddress,
    } = body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    const createdOrder = await backendClient.create({
      _type: "order",
      orderNumber: `ORD-${Date.now()}`,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      clerkUserId,
      customerName,
      customerEmail,
      amount,
      currency,
      status: "paid",
      cartItems:
        cartItems?.map((item: any) => ({
          _key: crypto.randomUUID(),
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })) || [],
      shippingAddress: shippingAddress
        ? {
            fullName: shippingAddress.fullName,
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
            phone: shippingAddress.phone,
          }
        : null,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified & order saved",
      orderId: createdOrder._id,
    });
  } catch (error) {
    console.error("Verify route error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}