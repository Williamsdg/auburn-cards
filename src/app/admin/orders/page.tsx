import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, statusColors } from "@/lib/utils";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { card: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center text-gray-500">
          No orders yet.
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Order</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Card</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Buyer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3 font-medium">{order.card.title}</td>
                  <td className="px-4 py-3">
                    <div>{order.buyerName}</div>
                    <div className="text-xs text-gray-500">{order.buyerEmail}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(order.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-auburn hover:underline text-sm">
                      Details
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
