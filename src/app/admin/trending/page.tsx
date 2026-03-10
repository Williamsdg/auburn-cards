import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminTrendingPage() {
  const items = await prisma.trendingCard.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trending Cards</h1>
        <Link
          href="/admin/trending/new"
          className="px-4 py-2 bg-auburn hover:bg-auburn-dark text-white rounded-lg transition-colors text-sm font-semibold"
        >
          Add Trending Card
        </Link>
      </div>

      <p className="text-gray-500 text-sm mb-6">
        Curate trending sports cards here. Pokemon trending cards are automatically pulled from the Pokemon TCG API.
      </p>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No curated trending cards yet.</p>
          <Link href="/admin/trending/new" className="text-auburn hover:underline mt-2 block">
            Add your first trending card
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Card</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Order</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.imageUrl} alt={item.title} className="w-10 h-14 object-cover rounded" />
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        {item.externalUrl && (
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{item.externalUrl}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/trending/${item.id}`} className="text-auburn hover:underline text-sm">
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
