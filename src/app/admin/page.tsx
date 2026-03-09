import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [
    newSubmissions,
    totalSubmissions,
    availableCards,
    totalOrders,
    recentOrders,
    recentSubmissions,
  ] = await Promise.all([
    prisma.submission.count({ where: { status: "NEW" } }),
    prisma.submission.count(),
    prisma.card.count({ where: { status: "AVAILABLE" } }),
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { card: true },
    }),
    prisma.submission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats = [
    { label: "New Submissions", value: newSubmissions, href: "/admin/submissions?status=NEW", color: "bg-blue-500" },
    { label: "Total Submissions", value: totalSubmissions, href: "/admin/submissions", color: "bg-purple-500" },
    { label: "Active Listings", value: availableCards, href: "/admin/listings", color: "bg-green-500" },
    { label: "Total Orders", value: totalOrders, href: "/admin/orders", color: "bg-auburn" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg p-6 border hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Submissions */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Submissions</h2>
            <Link href="/admin/submissions" className="text-sm text-auburn hover:underline">
              View all
            </Link>
          </div>
          {recentSubmissions.length === 0 ? (
            <p className="text-gray-500 text-sm">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/admin/submissions/${sub.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{sub.cardName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      sub.status === "NEW" ? "bg-blue-100 text-blue-800" :
                      sub.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    from {sub.sellerName}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-auburn hover:underline">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{order.card.title}</span>
                    <span className="font-semibold text-sm">${order.amount.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.buyerName} &middot; {order.status}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
