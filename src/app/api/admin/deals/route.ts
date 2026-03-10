import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const deals = await prisma.externalDeal.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(deals);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description, imageUrl, originalPrice, dealPrice, externalUrl, source, sortOrder, active } = body;

    if (!title || !externalUrl) {
      return NextResponse.json({ error: "Title and external URL are required" }, { status: 400 });
    }

    const deal = await prisma.externalDeal.create({
      data: {
        title,
        description: description || null,
        imageUrl: imageUrl || null,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        dealPrice: dealPrice ? parseFloat(dealPrice) : null,
        externalUrl,
        source: source || null,
        sortOrder: sortOrder ?? 0,
        active: active ?? true,
      },
    });
    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error("Create deal error:", error);
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}
