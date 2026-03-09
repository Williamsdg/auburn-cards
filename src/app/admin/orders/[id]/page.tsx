import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, statusColors } from "@/lib/utils";
import UpdateOrderForm from "./UpdateOrderForm";

type Params = Promise<{ id: string }>;

export default async function OrderDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { card: { include: { photos: { take: 1 } } } },
  });

  if (!order) notFound();

  const shippingAddress = order.shippingAddress as Record<string, string> | null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Order Details</h1>
      <p className="text-sm text-gray-500 mb-6">
        Order ID: <span className="font-mono">{order.id}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-3">Order Info</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Card</dt>
                <dd className="font-medium">{order.card.title}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Amount</dt>
                <dd className="font-semibold text-auburn">{formatPrice(order.amount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Date</dt>
                <dd>{formatDate(order.createdAt)}</dd>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Tracking</dt>
                  <dd className="font-mono text-xs">{order.trackingNumber}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Buyer Info */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-3">Buyer</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Name</dt>
                <dd>{order.buyerName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Email</dt>
                <dd>
                  <a href={`mailto:${order.buyerEmail}`} className="text-auburn hover:underline">
                    {order.buyerEmail}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-3">Shipping Address</h3>
              <p className="text-sm text-gray-700">
                {shippingAddress.line1}
                {shippingAddress.line2 && <><br />{shippingAddress.line2}</>}
                <br />
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
                <br />
                {shippingAddress.country}
              </p>
            </div>
          )}
        </div>

        {/* Update Order */}
        <div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-3">Update Order</h3>
            <UpdateOrderForm
              orderId={order.id}
              currentStatus={order.status}
              currentTracking={order.trackingNumber || ""}
              buyerEmail={order.buyerEmail}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
