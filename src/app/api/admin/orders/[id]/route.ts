import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/generated/prisma/client";
import { sendShippingUpdate } from "@/lib/email";

type Params = Promise<{ id: string }>;

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status, trackingNumber } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id },
      include: { card: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        trackingNumber: trackingNumber || null,
      },
    });

    // Send shipping notification if status changed to SHIPPED and tracking provided
    if (status === "SHIPPED" && trackingNumber && order.status !== "SHIPPED") {
      sendShippingUpdate(
        order.buyerEmail,
        order.buyerName,
        order.card.title,
        trackingNumber
      ).catch((e) => console.error("Email error:", e));
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
