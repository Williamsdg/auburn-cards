import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

type PokemonCard = {
  id: string;
  name: string;
  images: { small: string; large: string };
  set: { name: string };
  tcgplayer?: {
    url: string;
    prices?: Record<string, { market?: number; low?: number }>;
  };
};

async function getTrendingPokemon(): Promise<PokemonCard[]> {
  try {
    const res = await fetch(
      "https://api.pokemontcg.io/v2/cards?q=set.id:sv8&orderBy=-set.releaseDate&pageSize=4",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

function getPokemonPrice(card: PokemonCard): number | null {
  if (!card.tcgplayer?.prices) return null;
  for (const variant of Object.values(card.tcgplayer.prices)) {
    if (variant.market) return variant.market;
    if (variant.low) return variant.low;
  }
  return null;
}

export default async function Home() {
  const [pokemonCards, saleCards] = await Promise.all([
    getTrendingPokemon(),
    prisma.card.findMany({
      where: {
        status: "AVAILABLE",
        compareAtPrice: { not: null },
      },
      include: { photos: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const actualSaleCards = saleCards.filter(
    (c) => c.compareAtPrice && c.compareAtPrice > c.price
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            <span className="text-auburn">Auburn</span> Cards
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Your source for Pokemon &amp; sports trading cards. Browse our
            curated collection or sell us your cards for a fair offer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3 bg-auburn hover:bg-auburn-dark text-white font-semibold rounded-lg transition-colors"
            >
              Shop Cards
            </Link>
            <Link
              href="/sell"
              className="inline-flex items-center justify-center px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
            >
              Sell Your Cards
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Preview */}
      {pokemonCards.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Trending Right Now</h2>
              <Link
                href="/trending"
                className="text-auburn hover:text-auburn-dark font-medium transition-colors"
              >
                View All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {pokemonCards.map((card) => {
                const price = getPokemonPrice(card);
                return (
                  <a
                    key={card.id}
                    href={card.tcgplayer?.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-[3/4] relative bg-gray-100">
                      <Image
                        src={card.images.large || card.images.small}
                        alt={card.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform p-2"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-auburn transition-colors">
                        {card.name}
                      </h3>
                      <p className="text-xs text-gray-500">{card.set.name}</p>
                      {price && (
                        <p className="text-sm font-bold text-auburn mt-1">
                          ${price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* On Sale Now Preview */}
      {actualSaleCards.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">On Sale Now</h2>
              <Link
                href="/deals"
                className="text-auburn hover:text-auburn-dark font-medium transition-colors"
              >
                View All Deals &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                        sizes="(max-width: 640px) 50vw, 25vw"
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
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-auburn transition-colors">
                      {card.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-bold text-auburn">
                        {formatPrice(card.price)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(card.compareAtPrice!)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className={`py-20 ${actualSaleCards.length > 0 ? "" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-auburn/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-auburn text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Browse or Submit</h3>
              <p className="text-gray-600">
                Shop our collection or submit your cards for us to review and
                make you an offer.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-auburn/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-auburn text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get an Offer</h3>
              <p className="text-gray-600">
                We review your submission and send you a fair offer. Accept,
                decline, or counter — it&apos;s up to you.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-auburn/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-auburn text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Transaction</h3>
              <p className="text-gray-600">
                Buy securely on our site or complete your sale quickly. Fast
                shipping and fair prices guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Got Cards to Sell?</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            Submit your Pokemon or sports cards and we&apos;ll make you a fair offer.
            No hassle, no fees — just fast, honest deals.
          </p>
          <Link
            href="/sell"
            className="inline-flex items-center justify-center px-8 py-3 bg-auburn hover:bg-auburn-dark text-white font-semibold rounded-lg transition-colors"
          >
            Submit Your Cards
          </Link>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Find Us Everywhere
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.instagram.com/auburn.cards"
              target="_blank"
              className="inline-flex items-center justify-center px-6 py-3 bg-navy hover:bg-navy-light text-white font-semibold rounded-lg transition-colors gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>
            <a
              href="https://ebay.us/m/u3T5kW"
              target="_blank"
              className="inline-flex items-center justify-center px-6 py-3 bg-navy hover:bg-navy-light text-white font-semibold rounded-lg transition-colors gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.687 5.023c-1.87 0-3.687 1.312-3.687 3.612v.987h2.089v-.762c0-1.088.75-1.763 1.648-1.763.898 0 1.598.675 1.598 1.763v1.537c0 .713-.15 1.163-.675 1.688l-3.225 3.15C2.285 16.385 2 17.222 2 18.235v.742h7.312v-2.025H4.988c-.075 0-.112-.038-.112-.113 0-.037.037-.075.075-.112l2.475-2.4c1.05-1.013 1.575-1.913 1.575-3.338v-1.387c0-2.3-1.425-3.58-3.314-3.58zm6.163.225V18.977h2.088v-5.287h2.55c2.063 0 3.675-1.388 3.675-3.676v-.15c0-2.212-1.5-3.563-3.563-3.563h-.075zm2.088 2.025h2.287c1.013 0 1.65.675 1.65 1.613v.075c0 1.013-.675 1.65-1.65 1.65h-2.287z" />
              </svg>
              eBay Store
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
