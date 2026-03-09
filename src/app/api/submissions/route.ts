import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendSubmissionConfirmation,
  sendNewSubmissionAlert,
} from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      cardName,
      year,
      brand,
      condition,
      description,
      askingPrice,
      sellerName,
      sellerEmail,
      sellerPhone,
      photos,
    } = body;

    if (!cardName || !sellerName || !sellerEmail) {
      return NextResponse.json(
        { error: "Card name, your name, and email are required." },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        cardName,
        year: year || null,
        brand: brand || null,
        condition: condition || null,
        description: description || null,
        askingPrice: askingPrice || null,
        sellerName,
        sellerEmail,
        sellerPhone: sellerPhone || null,
        photos: {
          create: (photos || []).map(
            (p: { url: string; publicId: string }) => ({
              url: p.url,
              cloudinaryPublicId: p.publicId,
            })
          ),
        },
      },
    });

    // Send emails (don't block the response)
    Promise.all([
      sendSubmissionConfirmation(sellerEmail, sellerName, cardName),
      sendNewSubmissionAlert(cardName, sellerName, submission.id),
    ]).catch((e) => console.error("Email error:", e));

    return NextResponse.json({ id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
