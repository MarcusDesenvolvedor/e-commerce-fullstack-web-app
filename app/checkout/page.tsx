"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

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
  };
};

type CartData = {
  id: string;
  items: CartItem[];
  total: number;
};

export default function CheckoutPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=" + encodeURIComponent("/checkout"));
      return;
    }
    fetch("/api/cart", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => setCart(json.data))
      .catch(() => setCart(null))
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim() || shippingAddress.trim().length < 5) {
      setError("Enter a valid shipping address (at least 5 characters)");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress: shippingAddress.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to place order");
      router.push(`/orders/${json.data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="container py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-4 text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold">Checkout</h1>
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
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium">
            Shipping address
          </label>
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Street, number, city, state, ZIP..."
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            rows={4}
            required
          />
          {error && (
            <p className="mt-2 text-sm text-destructive">{error}</p>
          )}
        </div>

        <div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {cart.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex justify-between"
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>
                    $
                    {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-border pt-4 text-xl font-bold">
              Total: ${cart.total.toFixed(2)}
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? "Placing order..." : "Place order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
