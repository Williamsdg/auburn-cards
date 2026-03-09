import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CardCondition } from "@/generated/prisma/client";

type Params = Promise<{ id: string }>;

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, player, year, brand, sport, condition, price, description, ebayUrl, featured, photos } = body;

    // Delete existing photos and recreate
    await prisma.cardPhoto.deleteMany({ where: { cardId: id } });

    const card = await prisma.card.update({
      where: { id },
      data: {
        title,
        player,
        year,
        brand,
        sport: sport || "Football",
        condition: condition as CardCondition,
        price,
        description: description || null,
        ebayUrl: ebayUrl || null,
        featured: featured || false,
        photos: {
          create: (photos || []).map((p: { url: string; publicId: string }, i: number) => ({
            url: p.url,
            cloudinaryPublicId: p.publicId,
            order: i,
          })),
        },
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("Update listing error:", error);
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.card.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete listing error:", error);
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
  }
}
