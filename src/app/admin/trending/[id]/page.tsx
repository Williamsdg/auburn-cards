import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TrendingForm from "@/components/admin/TrendingForm";
import DeleteTrendingButton from "./DeleteButton";

type Params = Promise<{ id: string }>;

export default async function EditTrendingPage({ params }: { params: Params }) {
  const { id } = await params;
  const item = await prisma.trendingCard.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit: {item.title}</h1>
        <DeleteTrendingButton id={item.id} />
      </div>
      <TrendingForm
        initialData={{
          id: item.id,
          title: item.title,
          imageUrl: item.imageUrl,
          description: item.description || "",
          externalUrl: item.externalUrl || "",
          sortOrder: item.sortOrder.toString(),
          active: item.active,
        }}
      />
    </div>
  );
}
