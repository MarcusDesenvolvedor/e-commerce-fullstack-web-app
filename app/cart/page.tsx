"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CartItemRow } from "@/components/cart/cart-item-row";

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

type CartData = {
  id: string;
  items: CartItem[];
  total: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchIdRef = useRef(0);

  const fetchCart = useCallback(() => {
    const id = ++fetchIdRef.current;
    fetch("/api/cart", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (id === fetchIdRef.current) setCart(json.data);
      })
      .catch(() => {
        if (id === fetchIdRef.current) setCart(null);
      })
      .finally(() => {
        if (id === fetchIdRef.current) setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold">Cart</h1>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold">Cart</h1>
        <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-4 inline-block text-primary hover:underline"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-0">
            {cart.items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onUpdate={fetchCart}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Summary</h2>
            <p className="mt-4 text-2xl font-bold">
              ${cart.total.toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {cart.items.reduce((s, i) => s + i.quantity, 0)} item(s)
            </p>
            <Link
              href="/checkout"
              className="mt-4 block w-full rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
