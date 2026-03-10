"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

type UploadedImage = { url: string; publicId: string };

export default function SellForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [formData, setFormData] = useState({
    category: "",
    cardName: "",
    year: "",
    brand: "",
    sport: "",
    setName: "",
    condition: "",
    description: "",
    askingPrice: "",
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          askingPrice: formData.askingPrice
            ? parseFloat(formData.askingPrice)
            : null,
          photos: images,
        }),
      });

      if (res.ok) {
        router.push("/sell/success");
      } else {
        const data = await res.json();
        alert(data.error || "Something went wrong.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Photos
        </label>
        <ImageUpload
          images={images}
          onImagesChange={setImages}
          folder="auburn-cards/submissions"
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload clear photos of the front and back of your card (up to 6)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Type *
        </label>
        <select
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
        >
          <option value="">Select type</option>
          <option value="POKEMON">Pokemon</option>
          <option value="SPORTS">Sports Card</option>
          <option value="TCG">Other Trading Card</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Name *
          </label>
          <input
            name="cardName"
            required
            value={formData.cardName}
            onChange={handleChange}
            placeholder={formData.category === "POKEMON" ? "e.g., Charizard ex" : "e.g., Bo Jackson Rookie Card"}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="e.g., 2024"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder={formData.category === "POKEMON" ? "e.g., Pokemon TCG" : "e.g., Topps, Panini"}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Set / Series
          </label>
          <input
            name="setName"
            value={formData.setName}
            onChange={handleChange}
            placeholder={formData.category === "POKEMON" ? "e.g., Prismatic Evolutions" : "e.g., Prizm, Topps Chrome"}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
          />
        </div>
      </div>

      {formData.category === "SPORTS" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sport
          </label>
          <select
            name="sport"
            value={formData.sport}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
          >
            <option value="">Select sport</option>
            <option value="Football">Football</option>
            <option value="Basketball">Basketball</option>
            <option value="Baseball">Baseball</option>
            <option value="Soccer">Soccer</option>
            <option value="Hockey">Hockey</option>
            <option value="Other">Other</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Condition
        </label>
        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
        >
          <option value="">Select condition</option>
          <option value="Mint">Mint</option>
          <option value="Near Mint">Near Mint</option>
          <option value="Excellent">Excellent</option>
          <option value="Very Good">Very Good</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Any additional details about the card..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Asking Price (optional)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            $
          </span>
          <input
            name="askingPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.askingPrice}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
          />
        </div>
      </div>

      <hr />

      <h3 className="text-lg font-semibold">Your Contact Info</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            name="sellerName"
            required
            value={formData.sellerName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            name="sellerEmail"
            type="email"
            required
            value={formData.sellerEmail}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone (optional)
        </label>
        <input
          name="sellerPhone"
          type="tel"
          value={formData.sellerPhone}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-auburn hover:bg-auburn-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Your Card"}
      </button>
    </form>
  );
}
