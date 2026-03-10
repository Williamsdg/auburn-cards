"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DealData = {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: string;
  dealPrice: string;
  externalUrl: string;
  source: string;
  sortOrder: string;
  active: boolean;
};

const defaultData: DealData = {
  title: "",
  description: "",
  imageUrl: "",
  originalPrice: "",
  dealPrice: "",
  externalUrl: "",
  source: "",
  sortOrder: "0",
  active: true,
};

export default function ExternalDealForm({ initialData }: { initialData?: DealData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DealData>(initialData || defaultData);
  const isEditing = !!initialData?.id;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = isEditing ? `/api/admin/deals/${initialData!.id}` : "/api/admin/deals";

    try {
      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          originalPrice: data.originalPrice || null,
          dealPrice: data.dealPrice || null,
          sortOrder: parseInt(data.sortOrder) || 0,
        }),
      });

      if (res.ok) {
        router.push("/admin/deals");
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
          placeholder="e.g., Charizard ex SAR - Great Price on eBay"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">External URL *</label>
        <input name="externalUrl" type="url" required value={data.externalUrl} onChange={handleChange}
          placeholder="https://ebay.com/..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input name="imageUrl" value={data.imageUrl} onChange={handleChange}
          placeholder="https://... (paste image URL from the listing)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" value={data.description} onChange={handleChange} rows={2}
          placeholder="Why is this a good deal?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input name="originalPrice" type="number" step="0.01" min="0" value={data.originalPrice} onChange={handleChange}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deal Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input name="dealPrice" type="number" step="0.01" min="0" value={data.dealPrice} onChange={handleChange}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <select name="source" value={data.source} onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn">
            <option value="">Select source</option>
            <option value="eBay">eBay</option>
            <option value="TCGPlayer">TCGPlayer</option>
            <option value="Facebook Marketplace">Facebook Marketplace</option>
            <option value="Mercari">Mercari</option>
            <option value="Other">Other</option>
          </select>
        </div>
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
        {loading ? "Saving..." : isEditing ? "Update Deal" : "Add Deal"}
      </button>
    </form>
  );
}
