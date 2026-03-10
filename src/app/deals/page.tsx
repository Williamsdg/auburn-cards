import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Deals | Auburn Cards",
  description:
    "Find the best deals on Pokemon and sports trading cards. Sale prices on our listings plus curated deals from across the web.",
};

export default async function DealsPage() {
  const [saleCards, externalDeals] = await Promise.all([
    prisma.card.findMany({
      where: {
        status: "AVAILABLE",
        compareAtPrice: { not: null },
      },
      include: { photos: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.externalDeal.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  // Filter to only cards where compareAtPrice > price (actual sales)
  const actualSaleCards = saleCards.filter(
    (c) => c.compareAtPrice && c.compareAtPrice > c.price
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-auburn">Deals</span> &amp; Sales
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Score great prices on cards from our shop and curated deals from across
          the web.
        </p>
      </div>

      {/* Our Sale Cards */}
      {actualSaleCards.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-auburn rounded-full" />
            On Sale Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {actualSaleCards.map((card) => (
              <Link
                key={card.id}
                href={`/shop/${card.id}`}
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[3/4] relative bg-gray-100">
                  {card.photos[0] ? (
                    <Image
                      src={card.photos[0].url}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No photo
                    </div>
                  )}
                  <span className="absolute top-2 right-2 bg-auburn text-white text-xs font-bold px-2 py-1 rounded">
                    {Math.round(
                      ((card.compareAtPrice! - card.price) /
                        card.compareAtPrice!) *
                        100
                    )}
                    % OFF
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-auburn transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {card.year} {card.brand}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-auburn">
                      {formatPrice(card.price)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(card.compareAtPrice!)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* External Deals */}
      {externalDeals.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-auburn rounded-full" />
            Deals From Around the Web
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {externalDeals.map((deal) => (
              <a
                key={deal.id}
                href={deal.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {deal.imageUrl && (
                  <div className="aspect-video relative bg-gray-100">
                    <Image
                      src={deal.imageUrl}
                      alt={deal.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {deal.source && (
                      <span className="absolute top-2 left-2 bg-navy text-white text-xs font-medium px-2 py-1 rounded">
                        {deal.source}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2 group-hover:text-auburn transition-colors">
                    {deal.title}
                  </h3>
                  {deal.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {deal.description}
                    </p>
                  )}
                  {(deal.dealPrice || deal.originalPrice) && (
                    <div className="mt-2 flex items-center gap-2">
                      {deal.dealPrice && (
                        <span className="text-lg font-bold text-auburn">
                          {formatPrice(deal.dealPrice)}
                        </span>
                      )}
                      {deal.originalPrice &&
                        deal.dealPrice &&
                        deal.originalPrice > deal.dealPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(deal.originalPrice)}
                          </span>
                        )}
                    </div>
                  )}
                  <span className="inline-flex items-center mt-3 text-sm text-auburn font-medium">
                    View Deal
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {actualSaleCards.length === 0 && externalDeals.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No deals right now — check back soon!</p>
        </div>
      )}
    </div>
  );
}
