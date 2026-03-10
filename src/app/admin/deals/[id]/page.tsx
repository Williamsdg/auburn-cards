import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ExternalDealForm from "@/components/admin/ExternalDealForm";
import DeleteDealButton from "./DeleteButton";

type Params = Promise<{ id: string }>;

export default async function EditDealPage({ params }: { params: Params }) {
  const { id } = await params;
  const deal = await prisma.externalDeal.findUnique({ where: { id } });
  if (!deal) notFound();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit: {deal.title}</h1>
        <DeleteDealButton id={deal.id} />
      </div>
      <ExternalDealForm
        initialData={{
          id: deal.id,
          title: deal.title,
          description: deal.description || "",
          imageUrl: deal.imageUrl || "",
          originalPrice: deal.originalPrice?.toString() || "",
          dealPrice: deal.dealPrice?.toString() || "",
          externalUrl: deal.externalUrl,
          source: deal.source || "",
          sortOrder: deal.sortOrder.toString(),
          active: deal.active,
        }}
      />
    </div>
  );
}
