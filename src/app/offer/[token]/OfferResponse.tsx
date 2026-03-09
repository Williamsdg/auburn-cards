"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export default function OfferResponse({
  offerId,
  token,
  amount,
}: {
  offerId: string;
  token: string;
  amount: number;
}) {
  const router = useRouter();
  const [action, setAction] = useState<"" | "accept" | "decline" | "counter">("");
  const [counterAmount, setCounterAmount] = useState("");
  const [counterMessage, setCounterMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!action) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/offers/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId,
          action,
          counterAmount: action === "counter" ? parseFloat(counterAmount) : undefined,
          counterMessage: action === "counter" ? counterMessage : undefined,
        }),
      });

      if (res.ok) {
        router.refresh();
        setAction("");
      } else {
        const data = await res.json();
        alert(data.error || "Something went wrong.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-auburn/30 rounded-lg p-6 bg-auburn/5">
      <h3 className="font-semibold mb-4">
        Respond to offer of {formatPrice(amount)}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setAction("accept")}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              action === "accept"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => setAction("counter")}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              action === "counter"
                ? "bg-orange-600 text-white"
                : "bg-orange-100 text-orange-800 hover:bg-orange-200"
            }`}
          >
            Counter
          </button>
          <button
            type="button"
            onClick={() => setAction("decline")}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              action === "decline"
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            Decline
          </button>
        </div>

        {action === "counter" && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Counter Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (optional)
              </label>
              <textarea
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-auburn"
              />
            </div>
          </div>
        )}

        {action && (
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-auburn hover:bg-auburn-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading
              ? "Submitting..."
              : action === "accept"
                ? "Confirm Accept"
                : action === "decline"
                  ? "Confirm Decline"
                  : "Send Counter Offer"}
          </button>
        )}
      </form>
    </div>
  );
}
