"use client";

import { useRouter } from "next/navigation";

export default function DeleteTrendingButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this trending card?")) return;
    const res = await fetch(`/api/admin/trending/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/trending");
      router.refresh();
    }
  }

  return (
    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors">
      Delete
    </button>
  );
}
