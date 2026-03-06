"use client";

import Link from "next/link";
import { useState } from "react";

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    imageUrl: string | null;
  };
};

export function CartItemRow({
  item,
  onUpdate,
}: {
  item: CartItem;
  onUpdate: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cart/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.productId, quantity: newQuantity }),
      });
      if (res.ok) onUpdate();
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.productId }),
      });
      if (res.ok) onUpdate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 border-b border-border py-4">
      <Link href={`/products/${item.product.slug}`} className="shrink-0">
        {item.product.imageUrl ? (
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="h-20 w-20 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted text-2xl">
            📦
          </div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${item.product.slug}`}
          className="font-medium hover:text-primary"
        >
          {item.product.name}
        </Link>
        <p className="text-sm text-muted-foreground">
          ${item.product.price.toFixed(2)} each
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.quantity - 1)}
          disabled={loading || item.quantity <= 1}
          className="h-8 w-8 rounded border border-border bg-muted text-sm hover:bg-accent disabled:opacity-50"
        >
          −
        </button>
        <span className="w-8 text-center text-sm">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.quantity + 1)}
          disabled={loading || item.quantity >= item.product.stock}
          className="h-8 w-8 rounded border border-border bg-muted text-sm hover:bg-accent disabled:opacity-50"
        >
          +
        </button>
      </div>
      <p className="w-24 text-right font-medium">
        ${(item.product.price * item.quantity).toFixed(2)}
      </p>
      <button
        onClick={remove}
        disabled={loading}
        className="text-sm text-destructive hover:underline disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  );
}
