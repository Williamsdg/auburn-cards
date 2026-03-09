"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const sports = ["Football", "Basketball", "Baseball", "Other"];
const conditions = [
  { value: "MINT", label: "Mint" },
  { value: "NEAR_MINT", label: "Near Mint" },
  { value: "EXCELLENT", label: "Excellent" },
  { value: "VERY_GOOD", label: "Very Good" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "POOR", label: "Poor" },
];

export default function CardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <input
        type="text"
        placeholder="Search cards..."
        defaultValue={searchParams.get("q") || ""}
        onChange={(e) => updateFilter("q", e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
      />

      <select
        defaultValue={searchParams.get("sport") || ""}
        onChange={(e) => updateFilter("sport", e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
      >
        <option value="">All Sports</option>
        {sports.map((sport) => (
          <option key={sport} value={sport}>
            {sport}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("condition") || ""}
        onChange={(e) => updateFilter("condition", e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
      >
        <option value="">Any Condition</option>
        {conditions.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("sort") || ""}
        onChange={(e) => updateFilter("sort", e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn focus:border-transparent"
      >
        <option value="">Newest First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name">Name A-Z</option>
      </select>
    </div>
  );
}
