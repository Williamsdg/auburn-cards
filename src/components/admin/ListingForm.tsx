"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

type UploadedImage = { url: string; publicId: string };

type CardData = {
  id?: string;
  title: string;
  player: string;
  year: string;
  brand: string;
  sport: string;
  condition: string;
  price: string;
  description: string;
  ebayUrl: string;
  featured: boolean;
  photos: UploadedImage[];
};

const defaultData: CardData = {
  title: "",
  player: "",
  year: "",
  brand: "",
  sport: "Football",
  condition: "NEAR_MINT",
  price: "",
  description: "",
  ebayUrl: "",
  featured: false,
  photos: [],
};

export default function ListingForm({
  initialData,
}: {
  initialData?: CardData;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CardData>(initialData || defaultData);
  const isEditing = !!initialData?.id;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = isEditing
      ? `/api/admin/listings/${initialData!.id}`
      : "/api/admin/listings";

    try {
      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
        }),
      });

      if (res.ok) {
        router.push("/admin/listings");
        router.refresh();
      } else {
        const result = await res.json();
        alert(result.error || "Something went wrong.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
        <ImageUpload
          images={data.photos}
          onImagesChange={(photos) => setData((prev) => ({ ...prev, photos }))}
          folder="auburn-cards/listings"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input name="title" required value={data.title} onChange={handleChange}
            placeholder="e.g., 2024 Panini Prizm Bo Nix Rookie"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Player *</label>
          <input name="player" required value={data.player} onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
          <input name="year" required value={data.year} onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <input name="brand" required value={data.brand} onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
          <select name="sport" value={data.sport} onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn">
            <option value="Football">Football</option>
            <option value="Basketball">Basketball</option>
            <option value="Baseball">Baseball</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
          <select name="condition" required value={data.condition} onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn">
            <option value="MINT">Mint</option>
            <option value="NEAR_MINT">Near Mint</option>
            <option value="EXCELLENT">Excellent</option>
            <option value="VERY_GOOD">Very Good</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="POOR">Poor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input name="price" type="number" step="0.01" min="0" required value={data.price} onChange={handleChange}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" value={data.description} onChange={handleChange} rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">eBay URL (optional)</label>
        <input name="ebayUrl" type="url" value={data.ebayUrl} onChange={handleChange}
          placeholder="https://ebay.com/..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
      </div>

      <label className="flex items-center gap-2">
        <input name="featured" type="checkbox" checked={data.featured} onChange={handleChange}
          className="rounded border-gray-300 text-auburn focus:ring-auburn" />
        <span className="text-sm font-medium text-gray-700">Featured card</span>
      </label>

      <button type="submit" disabled={loading}
        className="px-8 py-3 bg-auburn hover:bg-auburn-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50">
        {loading ? "Saving..." : isEditing ? "Update Card" : "Add Card"}
      </button>
    </form>
  );
}
