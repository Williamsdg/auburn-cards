import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice, conditionLabels } from "@/lib/utils";
import BuyButton from "./BuyButton";

type Params = Promise<{ id: string }>;

const categoryLabels: Record<string, string> = {
  SPORTS: "Sports",
  POKEMON: "Pokemon",
  TCG: "Trading Card Game",
};

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const card = await prisma.card.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
  });
  if (!card) return { title: "Card Not Found" };

  const desc = [card.year, card.brand, card.player, card.setName]
    .filter(Boolean)
    .join(" ");
  const title = `${card.title} | Auburn Cards`;
  const description = `${desc} - ${conditionLabels[card.condition]} condition - ${formatPrice(card.price)}`;
  const imageUrl = card.photos[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(imageUrl && { images: [{ url: imageUrl, width: 600, height: 800, alt: card.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

export default async function CardDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const card = await prisma.card.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!card) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // JSON-LD structured data for Google rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: card.title,
    description: card.description || `${card.year} ${card.brand} ${card.player}`,
    image: card.photos.map((p) => p.url),
    brand: { "@type": "Brand", name: card.brand },
    category: `${categoryLabels[card.category] || card.category} Trading Cards`,
    offers: {
      "@type": "Offer",
      price: card.price.toFixed(2),
      priceCurrency: "USD",
      availability:
        card.status === "AVAILABLE"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      url: `${appUrl}/shop/${card.id}`,
      seller: { "@type": "Organization", name: "Auburn Cards" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Photos */}
          <div className="space-y-4">
            {card.photos.length > 0 ? (
              <>
                <div className="aspect-[3/4] relative bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={card.photos[0].url}
                    alt={card.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                {card.photos.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {card.photos.slice(1).map((photo) => (
                      <div
                        key={photo.id}
                        className="aspect-square relative bg-gray-100 rounded overflow-hidden"
                      >
                        <Image
                          src={photo.url}
                          alt={card.title}
                          fill
                          className="object-cover"
                          sizes="25vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                No photos available
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-auburn/10 text-auburn">
                {categoryLabels[card.category] || card.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{card.title}</h1>
            {card.compareAtPrice && card.compareAtPrice > card.price ? (
              <div className="mb-6 flex items-center gap-3">
                <span className="text-2xl font-bold text-auburn">
                  {formatPrice(card.price)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(card.compareAtPrice)}
                </span>
                <span className="text-sm bg-auburn text-white font-bold px-2 py-1 rounded">
                  {Math.round(((card.compareAtPrice - card.price) / card.compareAtPrice) * 100)}% OFF
                </span>
              </div>
            ) : (
              <p className="text-2xl font-bold text-auburn mb-6">
                {formatPrice(card.price)}
              </p>
            )}

            <div className="space-y-3 mb-8">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">
                  {card.category === "POKEMON" ? "Pokemon / Character" : "Player"}
                </span>
                <span className="font-medium">{card.player}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Year</span>
                <span className="font-medium">{card.year}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Brand</span>
                <span className="font-medium">{card.brand}</span>
              </div>
              {card.setName && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Set / Series</span>
                  <span className="font-medium">{card.setName}</span>
                </div>
              )}
              {card.cardNumber && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Card Number</span>
                  <span className="font-medium">{card.cardNumber}</span>
                </div>
              )}
              {card.sport && card.category === "SPORTS" && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Sport</span>
                  <span className="font-medium">{card.sport}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Condition</span>
                <span className="font-medium">
                  {conditionLabels[card.condition]}
                </span>
              </div>
            </div>

            {card.description && (
              <div className="mb-8">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            )}

            {card.status === "AVAILABLE" ? (
              <BuyButton cardId={card.id} price={card.price} />
            ) : (
              <div className="bg-gray-100 text-gray-500 text-center py-4 rounded-lg font-semibold">
                SOLD
              </div>
            )}

            {card.ebayUrl && (
              <a
                href={card.ebayUrl}
                target="_blank"
                className="mt-4 block text-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                Also available on eBay
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
