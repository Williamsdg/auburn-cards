import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOfferResponseAlert } from "@/lib/email";

type Params = Promise<{ token: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
  try {
    const { token } = await params;
    const { offerId, action, counterAmount, counterMessage } = await req.json();

    const submission = await prisma.submission.findUnique({
      where: { token },
      include: { offers: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const offer = submission.offers.find((o) => o.id === offerId);
    if (!offer || offer.status !== "PENDING") {
      return NextResponse.json(
        { error: "Offer not available for response" },
        { status: 400 }
      );
    }

    if (action === "accept") {
      await prisma.$transaction([
        prisma.offer.update({
          where: { id: offerId },
          data: { status: "ACCEPTED" },
        }),
        prisma.submission.update({
          where: { id: submission.id },
          data: { status: "ACCEPTED" },
        }),
      ]);
    } else if (action === "decline") {
      await prisma.$transaction([
        prisma.offer.update({
          where: { id: offerId },
          data: { status: "DECLINED" },
        }),
        prisma.submission.update({
          where: { id: submission.id },
          data: { status: "DECLINED" },
        }),
      ]);
    } else if (action === "counter") {
      if (!counterAmount || counterAmount <= 0) {
        return NextResponse.json(
          { error: "Counter amount required" },
          { status: 400 }
        );
      }
      await prisma.$transaction([
        prisma.offer.update({
          where: { id: offerId },
          data: {
            status: "COUNTERED",
            counterAmount,
            counterMessage: counterMessage || null,
          },
        }),
        prisma.submission.update({
          where: { id: submission.id },
          data: { status: "COUNTERED" },
        }),
      ]);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Send notification to admin
    sendOfferResponseAlert(
      submission.cardName,
      submission.sellerName,
      action,
      submission.id,
      counterAmount
    ).catch((e) => console.error("Email error:", e));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Offer response error:", error);
    return NextResponse.json(
      { error: "Failed to process response" },
      { status: 500 }
    );
  }
}
