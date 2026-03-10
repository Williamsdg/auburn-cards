import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ListingForm from "@/components/admin/ListingForm";
import DeleteCardButton from "./DeleteCardButton";

type Params = Promise<{ id: string }>;

export default async function EditListingPage({ params }: { params: Params }) {
  const { id } = await params;

  const card = await prisma.card.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!card) notFound();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit: {card.title}</h1>
        <DeleteCardButton cardId={card.id} />
      </div>
      <ListingForm
        initialData={{
          id: card.id,
          title: card.title,
          category: card.category,
          player: card.player,
          year: card.year,
          brand: card.brand,
          sport: card.sport || "Football",
          setName: card.setName || "",
          cardNumber: card.cardNumber || "",
          condition: card.condition,
          price: card.price.toString(),
          compareAtPrice: card.compareAtPrice?.toString() || "",
          description: card.description || "",
          ebayUrl: card.ebayUrl || "",
          featured: card.featured,
          photos: card.photos.map((p) => ({
            url: p.url,
            publicId: p.cloudinaryPublicId,
          })),
        }}
      />
    </div>
  );
}
