import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.EMAIL_FROM || "Auburn Cards <noreply@auburn.cards>";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendSubmissionConfirmation(
  sellerEmail: string,
  sellerName: string,
  cardName: string
) {
  await resend.emails.send({
    from,
    to: sellerEmail,
    subject: "We received your card submission!",
    html: `
      <h2>Thanks, ${sellerName}!</h2>
      <p>We received your submission for <strong>${cardName}</strong> and will review it shortly.</p>
      <p>We'll reach out with an offer once we've had a chance to evaluate your card.</p>
      <p>— Auburn Cards</p>
    `,
  });
}

export async function sendNewSubmissionAlert(
  cardName: string,
  sellerName: string,
  submissionId: string
) {
  await resend.emails.send({
    from,
    to: process.env.ADMIN_EMAIL || "admin@auburn.cards",
    subject: `New card submission: ${cardName}`,
    html: `
      <h2>New Submission</h2>
      <p><strong>${sellerName}</strong> submitted <strong>${cardName}</strong></p>
      <p><a href="${appUrl}/admin/submissions/${submissionId}">Review Submission</a></p>
    `,
  });
}

export async function sendOfferEmail(
  sellerEmail: string,
  sellerName: string,
  cardName: string,
  amount: number,
  message: string | null,
  token: string
) {
  await resend.emails.send({
    from,
    to: sellerEmail,
    subject: `We have an offer for your ${cardName}!`,
    html: `
      <h2>Hi ${sellerName},</h2>
      <p>We'd like to offer <strong>$${amount.toFixed(2)}</strong> for your <strong>${cardName}</strong>.</p>
      ${message ? `<p>${message}</p>` : ""}
      <p><a href="${appUrl}/offer/${token}" style="display:inline-block;padding:12px 24px;background:#DD550C;color:#fff;text-decoration:none;border-radius:6px;">View & Respond to Offer</a></p>
      <p>— Auburn Cards</p>
    `,
  });
}

export async function sendOfferResponseAlert(
  cardName: string,
  sellerName: string,
  action: "accepted" | "declined" | "countered",
  submissionId: string,
  counterAmount?: number
) {
  const subject =
    action === "accepted"
      ? `Offer accepted: ${cardName}`
      : action === "declined"
        ? `Offer declined: ${cardName}`
        : `Counter-offer: ${cardName} — $${counterAmount?.toFixed(2)}`;

  await resend.emails.send({
    from,
    to: process.env.ADMIN_EMAIL || "admin@auburn.cards",
    subject,
    html: `
      <h2>Offer ${action}</h2>
      <p><strong>${sellerName}</strong> has ${action} your offer for <strong>${cardName}</strong>.</p>
      ${action === "countered" && counterAmount ? `<p>Counter amount: <strong>$${counterAmount.toFixed(2)}</strong></p>` : ""}
      <p><a href="${appUrl}/admin/submissions/${submissionId}">View Submission</a></p>
    `,
  });
}

export async function sendOrderConfirmation(
  buyerEmail: string,
  buyerName: string,
  cardTitle: string,
  amount: number,
  orderId: string
) {
  await resend.emails.send({
    from,
    to: buyerEmail,
    subject: `Order confirmed: ${cardTitle}`,
    html: `
      <h2>Thanks for your purchase, ${buyerName}!</h2>
      <p>Your order for <strong>${cardTitle}</strong> has been confirmed.</p>
      <p>Total: <strong>$${amount.toFixed(2)}</strong></p>
      <p>Order ID: ${orderId}</p>
      <p>We'll send you tracking information once your card ships.</p>
      <p>— Auburn Cards</p>
    `,
  });
}

export async function sendShippingUpdate(
  buyerEmail: string,
  buyerName: string,
  cardTitle: string,
  trackingNumber: string
) {
  await resend.emails.send({
    from,
    to: buyerEmail,
    subject: `Your card has shipped: ${cardTitle}`,
    html: `
      <h2>Hi ${buyerName},</h2>
      <p>Your <strong>${cardTitle}</strong> has shipped!</p>
      <p>Tracking number: <strong>${trackingNumber}</strong></p>
      <p>— Auburn Cards</p>
    `,
  });
}
