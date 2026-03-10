import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminDealsPage() {
  const [saleCards, externalDeals] = await Promise.all([
    prisma.card.findMany({
      where: { compareAtPrice: { not: null } },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    prisma.externalDeal.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const trueSaleCards = saleCards.filter((c) => c.compareAtPrice !== null && c.compareAtPrice > c.price);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deals</h1>
        <Link
          href="/admin/deals/new"
          className="px-4 py-2 bg-auburn hover:bg-auburn-dark text-white rounded-lg transition-colors text-sm font-semibold"
        >
          Add External Deal
        </Link>
      </div>

      {/* Sale Listings */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Sale Listings</h2>
        <p className="text-gray-500 text-sm mb-4">
          To put a card on sale, edit the listing and set a &quot;Compare At Price&quot; higher than the current price.
        </p>
        {trueSaleCards.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 text-sm">
            No cards on sale right now. Edit a listing to set a Compare At Price.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Card</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Sale Price</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Was</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trueSaleCards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-sm">{card.title}</td>
                    <td className="px-4 py-3 text-sm text-auburn font-bold">{formatPrice(card.price)}</td>
                    <td className="px-4 py-3 text-sm text-gray-400 line-through">{formatPrice(card.compareAtPrice!)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/listings/${card.id}`} className="text-auburn hover:underline text-sm">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* External Deals */}
      <section>
        <h2 className="text-lg font-semibold mb-3">External Deals</h2>
        <p className="text-gray-500 text-sm mb-4">
          Deals you&apos;ve spotted on eBay, TCGPlayer, and other sites.
        </p>
        {externalDeals.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 text-sm">
            No external deals yet.
            <Link href="/admin/deals/new" className="text-auburn hover:underline ml-1">Add one</Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Deal</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Source</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Price</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {externalDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-sm max-w-[250px] truncate">{deal.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{deal.source || "—"}</td>
                    <td className="px-4 py-3 text-sm">
                      {deal.dealPrice ? (
                        <span className="text-auburn font-bold">{formatPrice(deal.dealPrice)}</span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${deal.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {deal.active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/deals/${deal.id}`} className="text-auburn hover:underline text-sm">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
