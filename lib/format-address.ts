export type AddressParts = {
  street: string;
  neighborhood: string;
  number?: number | null;
  city: string;
  state: string;
  country: string;
  complement?: string | null;
};

export function formatAddressForShipping(addr: AddressParts): string {
  const parts: string[] = [];
  parts.push(addr.street);
  if (addr.number != null) parts.push(String(addr.number));
  if (addr.complement?.trim()) parts.push(addr.complement.trim());
  parts.push(addr.neighborhood);
  parts.push(`${addr.city} - ${addr.state}`);
  parts.push(addr.country);
  return parts.filter(Boolean).join(", ");
}

export function formatAddressShort(addr: AddressParts): string {
  const num = addr.number != null ? ` ${addr.number}` : "";
  return `${addr.street}${num}, ${addr.neighborhood} - ${addr.city}/${addr.state}`;
}
