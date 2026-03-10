import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.trendingCard.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, imageUrl, description, externalUrl, sortOrder, active } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Title and image URL are required" }, { status: 400 });
    }

    const item = await prisma.trendingCard.create({
      data: {
        title,
        imageUrl,
        description: description || null,
        externalUrl: externalUrl || null,
        sortOrder: sortOrder ?? 0,
        active: active ?? true,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Create trending error:", error);
    return NextResponse.json({ error: "Failed to create trending item" }, { status: 500 });
  }
}
