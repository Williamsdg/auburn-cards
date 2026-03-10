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
    const item = await prisma.trendingCard.update({
      where: { id },
      data: {
        title: body.title,
        imageUrl: body.imageUrl,
        description: body.description ?? null,
        externalUrl: body.externalUrl ?? null,
        sortOrder: body.sortOrder ?? 0,
        active: body.active ?? true,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Update trending error:", error);
    return NextResponse.json({ error: "Failed to update trending item" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.trendingCard.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete trending error:", error);
    return NextResponse.json({ error: "Failed to delete trending item" }, { status: 500 });
  }
}
