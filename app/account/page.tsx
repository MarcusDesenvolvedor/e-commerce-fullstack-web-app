"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  AddressForm,
  emptyForm,
  type AddressFormData,
} from "@/components/checkout/address-form";
import { formatAddressShort } from "@/lib/format-address";

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

function validateAddressForm(data: AddressFormData): Partial<Record<keyof AddressFormData, string>> {
  const err: Partial<Record<keyof AddressFormData, string>> = {};
  if (!data.street.trim()) err.street = "Required";
  else if (data.street.length > 100) err.street = "Max 100 chars";
  if (!data.neighborhood.trim()) err.neighborhood = "Required";
  else if (data.neighborhood.length > 100) err.neighborhood = "Max 100 chars";
  if (data.number && (isNaN(parseInt(data.number, 10)) || parseInt(data.number, 10) > 999999))
    err.number = "0-999999";
  if (!data.city.trim()) err.city = "Required";
  else if (data.city.length > 100) err.city = "Max 100 chars";
  if (!data.state || data.state.length !== 2) err.state = "2 characters";
  if (!data.country || data.country.length !== 2) err.country = "2 chars (ISO)";
  if (data.complement.length > 100) err.complement = "Max 100 chars";
  return err;
}

export default function AccountPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [documentValue, setDocumentValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch("/api/addresses", { cache: "no-store" });
      const json = await res.json();
      if (res.ok) setAddresses(json.data ?? []);
      else setAddresses([]);
    } catch {
      setAddresses([]);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/user", { cache: "no-store" });
      const json = await res.json();
      if (res.ok && json.data) {
        setDocumentValue(json.data.document ?? "");
        setPhoneValue(json.data.phone ?? "");
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=" + encodeURIComponent("/account"));
      return;
    }
    Promise.all([fetchAddresses(), fetchProfile()]).finally(() =>
      setLoading(false)
    );
  }, [isLoaded, isSignedIn, router, fetchAddresses, fetchProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!documentValue.trim() || documentValue.trim().length < 5) {
      setError("ID document is required (min 5 characters)");
      return;
    }
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: documentValue.trim(),
          phone: phoneValue.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update profile");
      setSuccess("Profile updated");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const errs = validateAddressForm(formData);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setFormErrors({});
    setAdding(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressFormToBody(formData)),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add address");
      setFormData(emptyForm);
      setSuccess("Address added");
      fetchAddresses();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add address");
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (addr: Address) => {
    setEditingId(addr.id);
    setFormData({
      street: addr.street,
      neighborhood: addr.neighborhood,
      number: addr.number != null ? String(addr.number) : "",
      city: addr.city,
      state: addr.state,
      country: addr.country,
      complement: addr.complement ?? "",
    });
    setFormErrors({});
    setError(null);
    setSuccess(null);
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setError(null);
    setSuccess(null);
    const errs = validateAddressForm(formData);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setFormErrors({});
    try {
      const res = await fetch(`/api/addresses/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressFormToBody(formData)),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update address");
      setEditingId(null);
      setFormData(emptyForm);
      setSuccess("Address updated");
      fetchAddresses();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update address");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete address");
      setSuccess("Address deleted");
      if (editingId === id) {
        setEditingId(null);
        setFormData(emptyForm);
      }
      fetchAddresses();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete address");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormErrors({});
    setError(null);
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="container py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Account</h1>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold">Profile</h2>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Nome:</span>{" "}
            {user?.fullName ?? "—"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Email:</span>{" "}
            {user?.primaryEmailAddress?.emailAddress ?? "—"}
          </p>
          <form onSubmit={handleSaveProfile} className="mt-4 max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium">
                ID document *
              </label>
              <input
                type="text"
                value={documentValue}
                onChange={(e) => setDocumentValue(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Passport, ID number..."
                maxLength={20}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="text"
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="+1 234 567 8900"
                maxLength={20}
              />
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {savingProfile ? "Saving..." : "Save profile"}
            </button>
          </form>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Addresses</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Manage your shipping addresses. You can select one at checkout.
        </p>

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        {success && (
          <p className="mb-4 text-sm text-green-600 dark:text-green-400">
            {success}
          </p>
        )}

        {editingId ? (
          <form
            onSubmit={handleUpdateAddress}
            className="mb-6 max-w-2xl rounded-lg border border-border p-6"
          >
            <h3 className="mb-4 font-medium">Edit address</h3>
            <AddressForm
                data={formData}
                onChange={setFormData}
                errors={formErrors}
              />
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Save
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-md border border-input px-4 py-2 text-sm hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleAddAddress}
            className="mb-6 max-w-2xl rounded-lg border border-border p-6"
          >
            <h3 className="mb-4 font-medium">Add address</h3>
            <AddressForm
                data={formData}
                onChange={setFormData}
                errors={formErrors}
              />
            <button
              type="submit"
              disabled={adding}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {adding ? "Adding..." : "Add address"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-muted-foreground">Loading addresses...</p>
        ) : addresses.length === 0 ? (
          <p className="text-muted-foreground">No saved addresses.</p>
        ) : (
          <ul className="space-y-4">
            {addresses.map((addr) => (
              <li
                key={addr.id}
                className="flex items-start justify-between rounded-lg border border-border bg-card p-4"
              >
                <div>
                  <p className="font-medium">
                    {formatAddressShort(addr)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(addr)}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="text-sm text-destructive hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <Link href="/orders" className="text-primary hover:underline">
            View order history
          </Link>
        </div>
      </section>
    </div>
  );
}
