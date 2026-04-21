import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = body;

    if (!fullName || !phone || !street || !city || !state || !postalCode || !country) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (isDefault) {
      const existingDefaults = await backendClient.fetch(
        `*[_type == "address" && clerkUserId == $userId && isDefault == true]{ _id }`,
        { userId }
      );

      for (const address of existingDefaults) {
        await backendClient.patch(address._id).set({ isDefault: false }).commit();
      }
    }

    await backendClient.create({
      _type: "address",
      clerkUserId: userId,
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault: !!isDefault,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Address save error:", error);
    return NextResponse.json(
      { error: "Failed to save address." },
      { status: 500 }
    );
  }
}