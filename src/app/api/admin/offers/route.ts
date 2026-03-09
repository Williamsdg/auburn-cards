import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOfferEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { submissionId, amount, message } = await req.json();

    if (!submissionId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid submission ID and amount required" },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const offer = await prisma.offer.create({
      data: {
        submissionId,
        amount,
        message: message || null,
      },
    });

    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: "OFFER_SENT" },
    });

    // Send email to seller
    sendOfferEmail(
      submission.sellerEmail,
      submission.sellerName,
      submission.cardName,
      amount,
      message,
      submission.token
    ).catch((e) => console.error("Email error:", e));

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error("Offer error:", error);
    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    );
  }
}
