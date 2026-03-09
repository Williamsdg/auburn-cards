"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";

export default function BuyButton({
  cardId,
  price,
}: {
  cardId: string;
  price: number;
}) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full py-4 bg-auburn hover:bg-auburn-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : `Buy Now — ${formatPrice(price)}`}
    </button>
  );
}
