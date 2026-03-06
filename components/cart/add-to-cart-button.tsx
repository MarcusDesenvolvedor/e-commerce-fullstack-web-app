"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AddToCartButtonProps = {
  productId: string;
  stock: number;
};

export function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAdd = async () => {
    if (stock <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add");
      router.refresh();
      router.push("/cart");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  if (stock <= 0) {
    return (
      <button
        disabled
        className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-muted px-6 text-sm font-medium text-muted-foreground"
      >
        Out of stock
      </button>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={handleAdd}
        disabled={loading}
        className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add to cart"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
