import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Trending Cards | Auburn Cards",
  description:
    "See what's trending in the Pokemon and sports trading card world. Hot cards, rising prices, and must-have picks.",
};

type PokemonCard = {
  id: string;
  name: string;
  images: { small: string; large: string };
  set: { name: string; series: string };
  rarity?: string;
  tcgplayer?: {
    url: string;
    prices?: Record<string, { market?: number; low?: number }>;
  };
};

async function getTrendingPokemon(): Promise<PokemonCard[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(
      "https://api.pokemontcg.io/v2/cards?q=set.id:sv8&orderBy=-set.releaseDate&pageSize=8",
      { next: { revalidate: 3600 }, signal: controller.signal }
    );
    clearTimeout(timeout);
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

export default async function TrendingPage() {
  const [pokemonCards, curatedCards] = await Promise.all([
    getTrendingPokemon(),
    prisma.trendingCard.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Trending <span className="text-auburn">Cards</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay on top of what&apos;s hot in the trading card world. From the
          latest Pokemon releases to the most sought-after sports cards.
        </p>
      </div>

      {/* Pokemon Section */}
      {pokemonCards.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-auburn rounded-full" />
            Hot Pokemon Cards
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-auburn transition-colors">
                      {card.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {card.set.name}
                    </p>
                    {card.rarity && (
                      <p className="text-xs text-gray-400">{card.rarity}</p>
                    )}
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
        </section>
      )}

      {/* Curated Trending Section */}
      {curatedCards.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-auburn rounded-full" />
            Trending Picks
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {curatedCards.map((card) => {
              const Wrapper = card.externalUrl ? "a" : "div";
              const wrapperProps = card.externalUrl
                ? {
                    href: card.externalUrl,
                    target: "_blank" as const,
                    rel: "noopener noreferrer",
                  }
                : {};
              return (
                <Wrapper
                  key={card.id}
                  {...wrapperProps}
                  className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[3/4] relative bg-gray-100">
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-auburn transition-colors">
                      {card.title}
                    </h3>
                    {card.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {card.description}
                      </p>
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </section>
      )}

      {pokemonCards.length === 0 && curatedCards.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">
            Check back soon for trending cards!
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-2">Have a trending card to sell?</h3>
        <p className="text-gray-600 mb-4">
          We buy Pokemon and sports cards at fair prices.
        </p>
        <Link
          href="/sell"
          className="inline-flex items-center justify-center px-6 py-3 bg-auburn hover:bg-auburn-dark text-white font-semibold rounded-lg transition-colors"
        >
          Submit Your Cards
        </Link>
      </div>
    </div>
  );
}
