import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { productId, productName, productSlug, email, clerkUserId } = body;

    if (!productId || !productName || !productSlug || !email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const existing = await backendClient.fetch(
      `*[
        _type == "backInStockRequest" &&
        productId == $productId &&
        email == $email
      ][0]`,
      { productId, email }
    );

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Already subscribed for this product.",
      });
    }

    const created = await backendClient.create({
      _type: "backInStockRequest",
      productId,
      productName,
      productSlug,
      email,
      clerkUserId,
      requestedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Notification request saved.",
      created,
    });
  } catch (error) {
    console.error("Notify Me API Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save notification request.",
      },
      { status: 500 }
    );
  }
}