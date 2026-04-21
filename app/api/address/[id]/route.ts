import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: addressId } = await context.params;

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID required" },
        { status: 400 }
      );
    }

    const address = await backendClient.fetch(
      `*[_type == "address" && _id == $id][0]`,
      { id: addressId }
    );

    if (!address || address.clerkUserId !== userId) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    await backendClient.delete(addressId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { error: "Failed to delete address." },
      { status: 500 }
    );
  }
}