import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { cardId } = await req.json();

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { photos: { take: 1, orderBy: { order: "asc" } } },
    });

    if (!card || card.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: "Card not available" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: card.title,
              description: `${card.year} ${card.brand} ${card.player}`,
              images: card.photos[0] ? [card.photos[0].url] : [],
            },
            unit_amount: Math.round(card.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      metadata: { cardId: card.id },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/${card.id}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
