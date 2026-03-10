import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import CardGrid from "@/components/CardGrid";
import CardFilters from "@/components/CardFilters";
import { CardCondition, CardStatus } from "@/generated/prisma/client";

export const metadata = {
  title: "Shop Pokemon & Sports Trading Cards | Auburn Cards",
  description: "Browse our collection of Pokemon cards, sports cards, and trading card games. Find rare cards at fair prices with fast shipping.",
};

type SearchParams = Promise<{
  q?: string;
  category?: string;
  sport?: string;
  condition?: string;
  sort?: string;
  page?: string;
}>;

async function getCards(searchParams: SearchParams) {
  const params = await searchParams;
  const where: Record<string, unknown> = { status: CardStatus.AVAILABLE };

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { player: { contains: params.q, mode: "insensitive" } },
      { brand: { contains: params.q, mode: "insensitive" } },
      { setName: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.category) {
    where.category = params.category;
  }

  if (params.sport) {
    where.sport = params.sport;
  }

  if (params.condition && Object.values(CardCondition).includes(params.condition as CardCondition)) {
    where.condition = params.condition as CardCondition;
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (params.sort === "price_asc") orderBy = { price: "asc" };
  if (params.sort === "price_desc") orderBy = { price: "desc" };
  if (params.sort === "name") orderBy = { title: "asc" };

  return prisma.card.findMany({
    where,
    orderBy,
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
  });
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const cards = await getCards(searchParams);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Shop Cards</h1>
      <p className="text-gray-600 mb-8">
        Browse our collection of Pokemon &amp; sports trading cards.
      </p>

      <Suspense fallback={<div>Loading filters...</div>}>
        <CardFilters />
      </Suspense>

      <CardGrid cards={cards} />
    </div>
  );
}
