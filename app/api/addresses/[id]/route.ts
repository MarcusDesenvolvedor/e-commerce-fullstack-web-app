import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getOrCreateUserFromClerk } from "@/lib/clerk-user";

async function ensureAuthAndUser() {
  const { userId } = await auth();
  if (!userId) {
    return {
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }
  const clerkUserData = await currentUser();
  const email =
    clerkUserData?.emailAddresses?.[0]?.emailAddress ?? "user@example.com";
  const fullName =
    [clerkUserData?.firstName, clerkUserData?.lastName]
      .filter(Boolean)
      .join(" ") || "Customer";
  const user = await getOrCreateUserFromClerk(userId, email, fullName);
  return { user };
}

function parseAddressBody(body: unknown) {
  const b = body as Record<string, unknown>;
  const street = (b.street as string)?.trim();
  const neighborhood = (b.neighborhood as string)?.trim();
  const city = (b.city as string)?.trim();
  const state =
    (b.state as string) != null
      ? String(b.state).trim().toUpperCase().slice(0, 2)
      : undefined;
  const country =
    (b.country as string) != null
      ? String(b.country).trim().toUpperCase().slice(0, 2)
      : undefined;
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

function validateAddressPartial(
  v: ReturnType<typeof parseAddressBody>
): string | null {
  if (v.street !== undefined && (!v.street || v.street.length > 100))
    return "Street max 100 chars";
  if (
    v.neighborhood !== undefined &&
    (!v.neighborhood || v.neighborhood.length > 100)
  )
    return "Neighborhood max 100 chars";
  if (
    v.number !== undefined &&
    v.number != null &&
    (isNaN(v.number) || v.number < 0 || v.number > 999999)
  )
    return "Number must be 0-999999";
  if (v.city !== undefined && (!v.city || v.city.length > 100))
    return "City max 100 chars";
  if (v.state !== undefined && v.state !== "" && v.state.length !== 2)
    return "State must be 2 characters";
  if (v.country !== undefined && v.country !== "" && v.country.length !== 2)
    return "Country must be 2 characters (ISO code)";
  if (v.complement !== undefined && v.complement && v.complement.length > 100)
    return "Complement max 100 chars";
  return null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await ensureAuthAndUser();
    if ("error" in authResult) return authResult.error;
    const { user } = authResult;
    const { id } = await params;

    const existing = await prisma.address.findUnique({
      where: { id },
    });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const body = await request.json();
    const v = parseAddressBody(body);
    const err = validateAddressPartial(v);
    if (err) {
      return NextResponse.json({ error: err }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (v.street !== undefined) data.street = v.street;
    if (v.neighborhood !== undefined) data.neighborhood = v.neighborhood;
    if (v.number !== undefined) data.number = v.number;
    if (v.city !== undefined) data.city = v.city;
    if (v.state !== undefined) data.state = v.state;
    if (v.country !== undefined) data.country = v.country;
    if (v.complement !== undefined) data.complement = v.complement;

    const address = await prisma.address.update({
      where: { id },
      data: data as Parameters<typeof prisma.address.update>[0]["data"],
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
      error instanceof Error ? error.message : "Failed to update address";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await ensureAuthAndUser();
    if ("error" in authResult) return authResult.error;
    const { user } = authResult;
    const { id } = await params;

    const existing = await prisma.address.findUnique({
      where: { id },
    });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete address";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
