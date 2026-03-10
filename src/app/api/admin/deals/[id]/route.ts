import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const deal = await prisma.externalDeal.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description ?? null,
        imageUrl: body.imageUrl ?? null,
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        dealPrice: body.dealPrice ? parseFloat(body.dealPrice) : null,
        externalUrl: body.externalUrl,
        source: body.source ?? null,
        sortOrder: body.sortOrder ?? 0,
        active: body.active ?? true,
      },
    });
    return NextResponse.json(deal);
  } catch (error) {
    console.error("Update deal error:", error);
    return NextResponse.json({ error: "Failed to update deal" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.externalDeal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete deal error:", error);
    return NextResponse.json({ error: "Failed to delete deal" }, { status: 500 });
  }
}
