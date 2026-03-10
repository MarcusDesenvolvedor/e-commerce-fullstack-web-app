import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getOrCreateUserFromClerk } from "@/lib/clerk-user";

function parseAddressBody(body: unknown) {
  const b = body as Record<string, unknown>;
  const street = (b.street as string)?.trim();
  const neighborhood = (b.neighborhood as string)?.trim();
  const city = (b.city as string)?.trim();
  const state = ((b.state as string) ?? "").trim().toUpperCase().slice(0, 2);
  const country = ((b.country as string) ?? "").trim().toUpperCase().slice(0, 2);
  const numberRaw = b.number;
  const number =
    numberRaw === null || numberRaw === undefined || numberRaw === ""
      ? undefined
      : typeof numberRaw === "number"
        ? numberRaw
        : parseInt(String(numberRaw), 10);
  const complement = (b.complement as string)?.trim() || null;
  return { street, neighborhood, city, state, country, number, complement };
}

function validateAddress(
  v: ReturnType<typeof parseAddressBody>
): string | null {
  if (!v.street || v.street.length > 100)
    return "Street is required (max 100 chars)";
  if (!v.neighborhood || v.neighborhood.length > 100)
    return "Neighborhood is required (max 100 chars)";
  if (v.number != null && (isNaN(v.number) || v.number < 0 || v.number > 999999))
    return "Number must be 0-999999 if provided";
  if (!v.city || v.city.length > 100) return "City is required (max 100 chars)";
  if (v.state.length !== 2)
    return "State must be 2 characters";
  if (v.country.length !== 2)
    return "Country must be 2 characters (ISO code)";
  if (v.complement && v.complement.length > 100)
    return "Complement max 100 chars";
  return null;
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const clerkUserData = await currentUser();
    const email =
      clerkUserData?.emailAddresses?.[0]?.emailAddress ?? "user@example.com";
    const fullName =
      [clerkUserData?.firstName, clerkUserData?.lastName]
        .filter(Boolean)
        .join(" ") || "Customer";

    const user = await getOrCreateUserFromClerk(userId, email, fullName);

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const data = addresses.map((a) => ({
      id: a.id,
      street: a.street,
      neighborhood: a.neighborhood,
      number: a.number,
      city: a.city,
      state: a.state,
      country: a.country,
      complement: a.complement,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch addresses";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const clerkUserData = await currentUser();
    const email =
      clerkUserData?.emailAddresses?.[0]?.emailAddress ?? "user@example.com";
    const fullName =
      [clerkUserData?.firstName, clerkUserData?.lastName]
        .filter(Boolean)
        .join(" ") || "Customer";

    const user = await getOrCreateUserFromClerk(userId, email, fullName);

    const body = await request.json();
    const v = parseAddressBody(body);
    const err = validateAddress(v);
    if (err) {
      return NextResponse.json({ error: err }, { status: 400 });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        street: v.street!,
        neighborhood: v.neighborhood!,
        number: v.number,
        city: v.city!,
        state: v.state!,
        country: v.country!,
        complement: v.complement,
      },
    });

    return NextResponse.json({
      data: {
        id: address.id,
        street: address.street,
        neighborhood: address.neighborhood,
        number: address.number,
        city: address.city,
        state: address.state,
        country: address.country,
        complement: address.complement,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create address";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
