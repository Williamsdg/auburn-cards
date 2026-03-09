import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CardCondition } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, player, year, brand, sport, condition, price, description, ebayUrl, featured, photos } = body;

    if (!title || !player || !year || !brand || !condition || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const card = await prisma.card.create({
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

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
