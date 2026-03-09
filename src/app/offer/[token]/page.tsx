import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import OfferResponse from "./OfferResponse";

type Params = Promise<{ token: string }>;

export const metadata = {
  title: "View Offer | Auburn Cards",
};

export default async function OfferPage({ params }: { params: Params }) {
  const { token } = await params;

  const submission = await prisma.submission.findUnique({
    where: { token },
    include: {
      offers: { orderBy: { createdAt: "desc" } },
      photos: true,
    },
  });

  if (!submission) notFound();

  const latestOffer = submission.offers[0];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Offer for {submission.cardName}</h1>
      <p className="text-gray-600 mb-8">
        Hi {submission.sellerName}, here&apos;s the latest on your card submission.
      </p>

      {/* Card Info */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-3">Your Card</h3>
        <div className="space-y-1 text-sm">
          <p><span className="text-gray-500">Card:</span> {submission.cardName}</p>
          {submission.year && <p><span className="text-gray-500">Year:</span> {submission.year}</p>}
          {submission.brand && <p><span className="text-gray-500">Brand:</span> {submission.brand}</p>}
          {submission.condition && <p><span className="text-gray-500">Condition:</span> {submission.condition}</p>}
          {submission.askingPrice && (
            <p><span className="text-gray-500">Your asking price:</span> {formatPrice(submission.askingPrice)}</p>
          )}
        </div>
      </div>

      {/* Offer History */}
      <div className="space-y-4 mb-8">
        <h3 className="font-semibold">Offer History</h3>
        {submission.offers.length === 0 ? (
          <p className="text-gray-500">No offers yet. We&apos;re still reviewing your card.</p>
        ) : (
          submission.offers.map((offer) => (
            <div
              key={offer.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-lg text-auburn">
                    {formatPrice(offer.amount)}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatDate(offer.createdAt)}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    offer.status === "ACCEPTED"
                      ? "bg-green-100 text-green-800"
                      : offer.status === "DECLINED"
                        ? "bg-red-100 text-red-800"
                        : offer.status === "COUNTERED"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {offer.status}
                </span>
              </div>
              {offer.message && (
                <p className="text-sm text-gray-600">{offer.message}</p>
              )}
              {offer.status === "COUNTERED" && offer.counterAmount && (
                <div className="mt-2 p-3 bg-orange-50 rounded">
                  <p className="text-sm">
                    <span className="font-medium">Your counter:</span>{" "}
                    {formatPrice(offer.counterAmount)}
                  </p>
                  {offer.counterMessage && (
                    <p className="text-sm text-gray-600 mt-1">
                      {offer.counterMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Response Form */}
      {latestOffer && latestOffer.status === "PENDING" && (
        <OfferResponse offerId={latestOffer.id} token={token} amount={latestOffer.amount} />
      )}

      {submission.status === "ACCEPTED" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-green-800 font-semibold">
            Offer accepted! We&apos;ll be in touch to arrange payment and shipping.
          </p>
        </div>
      )}

      {submission.status === "DECLINED" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">
            You declined this offer. If you change your mind, feel free to submit again.
          </p>
        </div>
      )}
    </div>
  );
}
