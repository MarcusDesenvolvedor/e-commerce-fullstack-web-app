"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  AddressForm,
  emptyForm,
  type AddressFormData,
} from "@/components/checkout/address-form";
import { formatAddressShort } from "@/lib/format-address";

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

type Address = {
  id: string;
  street: string;
  neighborhood: string;
  number: number | null;
  city: string;
  state: string;
  country: string;
  complement: string | null;
};

function addressFormToBody(data: AddressFormData) {
  return {
    street: data.street.trim(),
    neighborhood: data.neighborhood.trim(),
    number: data.number ? parseInt(data.number, 10) : undefined,
    city: data.city.trim(),
    state: data.state,
    country: data.country,
    complement: data.complement.trim() || undefined,
  };
}

function validateAddressForm(
  data: AddressFormData
): Partial<Record<keyof AddressFormData, string>> {
  const err: Partial<Record<keyof AddressFormData, string>> = {};
  if (!data.street.trim()) err.street = "Required";
  else if (data.street.length > 100) err.street = "Max 100 chars";
  if (!data.neighborhood.trim()) err.neighborhood = "Required";
  else if (data.neighborhood.length > 100)
    err.neighborhood = "Max 100 chars";
  if (
    data.number &&
    (isNaN(parseInt(data.number, 10)) ||
      parseInt(data.number, 10) > 999999)
  )
    err.number = "0-999999";
  if (!data.city.trim()) err.city = "Required";
  else if (data.city.length > 100) err.city = "Max 100 chars";
  if (!data.state || data.state.length !== 2) err.state = "2 characters";
  if (!data.country || data.country.length !== 2) err.country = "2 chars (ISO)";
  if (data.complement.length > 100) err.complement = "Max 100 chars";
  return err;
}

export default function CheckoutPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentValue, setDocumentValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [newAddressData, setNewAddressData] = useState<AddressFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof AddressFormData, string>>
  >({});

  const fetchData = useCallback(async () => {
    try {
      const [cartRes, addressesRes] = await Promise.all([
        fetch("/api/cart", { cache: "no-store" }),
        fetch("/api/addresses", { cache: "no-store" }),
      ]);
      const [cartJson, addressesJson] = await Promise.all([
        cartRes.json(),
        addressesRes.json(),
      ]);
      setCart(cartJson.data);
      setAddresses(addressesJson.data ?? []);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=" + encodeURIComponent("/checkout"));
      return;
    }
    fetchData();
  }, [isLoaded, isSignedIn, router, fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!documentValue.trim() || documentValue.trim().length < 5) {
      setError("ID document is required (min 5 characters)");
      return;
    }

    let payload: { addressId?: string; address?: object; document: string; phone?: string };

    const useNewAddress = addresses.length === 0 || showNewAddressForm;

    if (useNewAddress) {
      const errs = validateAddressForm(newAddressData);
      if (Object.keys(errs).length > 0) {
        setFormErrors(errs);
        setError("Please fill in all address fields correctly");
        return;
      }
      payload = {
        address: addressFormToBody(newAddressData),
        document: documentValue.trim(),
        phone: phoneValue.trim() || undefined,
      };
    } else if (addresses.length > 0 && selectedAddressId) {
      payload = {
        addressId: selectedAddressId,
        document: documentValue.trim(),
        phone: phoneValue.trim() || undefined,
      };
    } else {
      setError(
        addresses.length > 0
          ? "Select an address or add a new one"
          : "Please fill in the shipping address"
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="mb-3 text-lg font-semibold">
              ID document and shipping address
            </h2>

            <div className="mb-4 space-y-2">
              <label className="block text-sm font-medium">
                ID document *
              </label>
              <input
                type="text"
                value={documentValue}
                onChange={(e) => setDocumentValue(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Passport, ID number..."
                required
              />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium">Phone</label>
              <input
                type="text"
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="+1 234 567 8900"
                maxLength={20}
              />
            </div>

            {addresses.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 font-medium">Shipping address</h3>
                <AddressForm
                  data={newAddressData}
                  onChange={setNewAddressData}
                  errors={formErrors}
                />
                <input type="hidden" value="new" readOnly />
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-sm font-medium">
                  Choose shipping address
                </label>
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                        selectedAddressId === addr.id && !showNewAddressForm
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-accent/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={
                          selectedAddressId === addr.id && !showNewAddressForm
                        }
                        onChange={() => {
                          setSelectedAddressId(addr.id);
                          setShowNewAddressForm(false);
                          setFormErrors({});
                        }}
                        className="mt-1"
                      />
                      <span className="text-sm">
                        {formatAddressShort(addr)}
                      </span>
                    </label>
                  ))}
                </div>

                {showNewAddressForm ? (
                  <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="mb-4 font-medium">Add new address</h3>
                    <AddressForm
                      data={newAddressData}
                      onChange={setNewAddressData}
                      errors={formErrors}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewAddressForm(false);
                        setNewAddressData(emptyForm);
                        setFormErrors({});
                      }}
                      className="mt-4 text-sm text-primary hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewAddressForm(true);
                      setSelectedAddressId("");
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    + Add new address
                  </button>
                )}

                <p className="text-xs text-muted-foreground">
                  <Link href="/account" className="text-primary hover:underline">
                    Manage addresses in account
                  </Link>
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {cart.items.map((item) => (
                <li key={item.productId} className="flex justify-between">
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
