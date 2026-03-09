import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, statusColors } from "@/lib/utils";

export default async function ListingsPage() {
  const cards = await prisma.card.findMany({
    orderBy: { createdAt: "desc" },
    include: { photos: { take: 1, orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Card Listings</h1>
        <Link
          href="/admin/listings/new"
          className="px-4 py-2 bg-auburn hover:bg-auburn-dark text-white font-semibold rounded-lg transition-colors"
        >
          + Add Card
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center text-gray-500">
          <p>No card listings yet.</p>
          <Link href="/admin/listings/new" className="text-auburn hover:underline mt-2 block">
            Add your first card
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Card</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Player</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cards.map((card) => (
                <tr key={card.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {card.photos[0] && (
                        <div className="w-10 h-10 relative rounded overflow-hidden bg-gray-100 shrink-0">
                          <Image src={card.photos[0].url} alt="" fill className="object-cover" sizes="40px" />
                        </div>
                      )}
                      <span className="font-medium">{card.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{card.player}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(card.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[card.status]}`}>
                      {card.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(card.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/listings/${card.id}`} className="text-auburn hover:underline text-sm">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
