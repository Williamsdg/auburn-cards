import Link from "next/link";
import Image from "next/image";
import { formatPrice, conditionLabels } from "@/lib/utils";

type CardItem = {
  id: string;
  title: string;
  player: string;
  year: string;
  brand: string;
  condition: string;
  price: number;
  status: string;
  photos: { url: string }[];
};

export default function CardGrid({ cards }: { cards: CardItem[] }) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg">No cards found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={`/shop/${card.id}`}
          className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="aspect-[3/4] relative bg-gray-100">
            {card.photos[0] ? (
              <Image
                src={card.photos[0].url}
                alt={card.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No photo
              </div>
            )}
            {card.status === "SOLD" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-xl">SOLD</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-auburn transition-colors">
              {card.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {card.year} {card.brand}
            </p>
            <p className="text-xs text-gray-500">
              {conditionLabels[card.condition] || card.condition}
            </p>
            <p className="text-lg font-bold text-auburn mt-2">
              {formatPrice(card.price)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
