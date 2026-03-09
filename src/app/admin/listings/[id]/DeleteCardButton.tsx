"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteCardButton({ cardId }: { cardId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this card?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${cardId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/listings");
        router.refresh();
      } else {
        alert("Failed to delete card.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete Card"}
    </button>
  );
}
