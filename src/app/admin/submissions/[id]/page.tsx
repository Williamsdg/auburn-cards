import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, statusColors } from "@/lib/utils";
import SendOfferForm from "./SendOfferForm";

type Params = Promise<{ id: string }>;

export default async function SubmissionDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      photos: true,
      offers: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!submission) notFound();

  const canSendOffer =
    submission.status !== "ACCEPTED" && submission.status !== "DECLINED";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Submission: {submission.cardName}</h1>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[submission.status]}`}>
        {submission.status.replace("_", " ")}
      </span>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Left: Details + Photos */}
        <div className="space-y-6">
          {/* Photos */}
          {submission.photos.length > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-3">Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {submission.photos.map((photo) => (
                  <div key={photo.id} className="aspect-square relative bg-gray-100 rounded overflow-hidden">
                    <Image src={photo.url} alt="Card photo" fill className="object-cover" sizes="200px" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card Details */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-3">Card Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Card Name</dt>
                <dd className="font-medium">{submission.cardName}</dd>
              </div>
              {submission.year && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Year</dt>
                  <dd>{submission.year}</dd>
                </div>
              )}
              {submission.brand && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Brand</dt>
                  <dd>{submission.brand}</dd>
                </div>
              )}
              {submission.condition && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Condition</dt>
                  <dd>{submission.condition}</dd>
                </div>
              )}
              {submission.askingPrice && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Asking Price</dt>
                  <dd className="font-semibold text-auburn">
                    {formatPrice(submission.askingPrice)}
                  </dd>
                </div>
              )}
              {submission.description && (
                <div>
                  <dt className="text-gray-500 mb-1">Description</dt>
                  <dd className="text-gray-700">{submission.description}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Seller Info */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-3">Seller Info</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Name</dt>
                <dd>{submission.sellerName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Email</dt>
                <dd>
                  <a href={`mailto:${submission.sellerEmail}`} className="text-auburn hover:underline">
                    {submission.sellerEmail}
                  </a>
                </dd>
              </div>
              {submission.sellerPhone && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Phone</dt>
                  <dd>{submission.sellerPhone}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Submitted</dt>
                <dd>{formatDate(submission.createdAt)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right: Offers */}
        <div className="space-y-6">
          {/* Send Offer */}
          {canSendOffer && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-3">Send Offer</h3>
              <SendOfferForm submissionId={submission.id} />
            </div>
          )}

          {/* Offer History */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-3">Offer History</h3>
            {submission.offers.length === 0 ? (
              <p className="text-gray-500 text-sm">No offers sent yet.</p>
            ) : (
              <div className="space-y-3">
                {submission.offers.map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-auburn">
                        {formatPrice(offer.amount)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[offer.status]}`}>
                        {offer.status}
                      </span>
                    </div>
                    {offer.message && (
                      <p className="text-sm text-gray-600 mt-1">{offer.message}</p>
                    )}
                    {offer.counterAmount && (
                      <div className="mt-2 p-2 bg-orange-50 rounded text-sm">
                        <span className="font-medium">Counter:</span>{" "}
                        {formatPrice(offer.counterAmount)}
                        {offer.counterMessage && (
                          <p className="text-gray-600 mt-1">{offer.counterMessage}</p>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(offer.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offer Link */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-2">Seller Offer Link</h3>
            <p className="text-xs text-gray-500 mb-2">
              Share this link with the seller so they can view and respond to offers.
            </p>
            <code className="block text-xs bg-gray-100 p-2 rounded break-all">
              {process.env.NEXT_PUBLIC_APP_URL}/offer/{submission.token}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
