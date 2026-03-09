import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice, statusColors } from "@/lib/utils";

export default async function SubmissionsPage() {
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    include: { offers: true, photos: { take: 1 } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Submissions</h1>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center text-gray-500">
          No submissions yet.
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Card</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Seller</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Asking</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{sub.cardName}</td>
                  <td className="px-4 py-3">
                    <div>{sub.sellerName}</div>
                    <div className="text-xs text-gray-500">{sub.sellerEmail}</div>
                  </td>
                  <td className="px-4 py-3">
                    {sub.askingPrice ? formatPrice(sub.askingPrice) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[sub.status] || "bg-gray-100"}`}>
                      {sub.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(sub.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/submissions/${sub.id}`}
                      className="text-auburn hover:underline text-sm"
                    >
                      Review
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
