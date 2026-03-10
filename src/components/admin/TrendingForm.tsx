"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TrendingData = {
  id?: string;
  title: string;
  imageUrl: string;
  description: string;
  externalUrl: string;
  sortOrder: string;
  active: boolean;
};

const defaultData: TrendingData = {
  title: "",
  imageUrl: "",
  description: "",
  externalUrl: "",
  sortOrder: "0",
  active: true,
};

export default function TrendingForm({ initialData }: { initialData?: TrendingData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrendingData>(initialData || defaultData);
  const isEditing = !!initialData?.id;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = isEditing ? `/api/admin/trending/${initialData!.id}` : "/api/admin/trending";

    try {
      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sortOrder: parseInt(data.sortOrder) || 0 }),
      });

      if (res.ok) {
        router.push("/admin/trending");
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input name="title" required value={data.title} onChange={handleChange}
          placeholder="e.g., 2024 Panini Prizm Patrick Mahomes"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
        <input name="imageUrl" required value={data.imageUrl} onChange={handleChange}
          placeholder="https://..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
        <p className="text-xs text-gray-400 mt-1">Paste an image URL from eBay, TCGPlayer, etc.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" value={data.description} onChange={handleChange} rows={2}
          placeholder="Why is this card trending?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">External URL</label>
        <input name="externalUrl" type="url" value={data.externalUrl} onChange={handleChange}
          placeholder="https://ebay.com/... or https://tcgplayer.com/..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
          <input name="sortOrder" type="number" value={data.sortOrder} onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 pb-2">
            <input name="active" type="checkbox" checked={data.active} onChange={handleChange}
              className="rounded border-gray-300 text-auburn focus:ring-auburn" />
            <span className="text-sm font-medium text-gray-700">Active (visible on site)</span>
          </label>
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="px-8 py-3 bg-auburn hover:bg-auburn-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50">
        {loading ? "Saving..." : isEditing ? "Update" : "Add Trending Card"}
      </button>
    </form>
  );
}
