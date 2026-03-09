import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/email";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const cardId = session.metadata?.cardId;

    if (cardId) {
      const card = await prisma.card.update({
        where: { id: cardId },
        data: { status: "SOLD" },
      });

      const order = await prisma.order.create({
        data: {
          cardId,
          buyerEmail: session.customer_details?.email || "",
          buyerName: session.customer_details?.name || "",
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          shippingAddress: ((session as unknown as Record<string, unknown>).shipping_details as Record<string, unknown>)?.address as object ?? {},
          status: "PAID",
          amount: (session.amount_total || 0) / 100,
        },
      });

      try {
        await sendOrderConfirmation(
          order.buyerEmail,
          order.buyerName,
          card.title,
          order.amount,
          order.id
        );
      } catch (e) {
        console.error("Failed to send order confirmation:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
