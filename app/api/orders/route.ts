import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getOrCreateCartSessionId } from "@/lib/cart-session";
import { getOrCreateUserFromClerk } from "@/lib/clerk-user";
import { formatAddressForShipping } from "@/lib/format-address";

type AddressInput = {
  street: string;
  neighborhood: string;
  number?: number | null;
  city: string;
  state: string;
  country: string;
  complement?: string | null;
};

function parseAddressBody(body: unknown): AddressInput | null {
  const b = body as Record<string, unknown>;
  const street = (b.street as string)?.trim();
  const neighborhood = (b.neighborhood as string)?.trim();
  const city = (b.city as string)?.trim();
  const state = ((b.state as string) ?? "").trim().toUpperCase().slice(0, 2);
  const country = ((b.country as string) ?? "").trim().toUpperCase().slice(0, 2);
  if (!street || !neighborhood || !city || !state || !country) return null;
  const numberRaw = b.number;
  const number =
    numberRaw === null || numberRaw === undefined || numberRaw === ""
      ? undefined
      : typeof numberRaw === "number"
        ? numberRaw
        : parseInt(String(numberRaw), 10);
  const complement = (b.complement as string)?.trim() || null;
  if (state.length !== 2 || country.length !== 2) return null;
  if (street.length > 100 || neighborhood.length > 100 || city.length > 100)
    return null;
  if (
    number != null &&
    (isNaN(number) || number < 0 || number > 999999)
  )
    return null;
  if (complement && complement.length > 100) return null;
  return {
    street,
    neighborhood,
    number: number ?? null,
    city,
    state,
    country,
    complement,
  };
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

    const body = await request.json();
    const addressId = body.addressId as string | undefined;
    const addressInput = body.address as unknown;
    const document = (body.document as string)?.trim();
    const phone = (body.phone as string)?.trim() || null;

    if (!document || document.length < 5) {
      return NextResponse.json(
        { error: "ID document is required" },
        { status: 400 }
      );
    }
    if (document.length > 20) {
      return NextResponse.json(
        { error: "Document max 20 characters" },
        { status: 400 }
      );
    }

    let shippingAddress: string;

    const user = await getOrCreateUserFromClerk(userId, email, fullName);

    if (addressId) {
      const addr = await prisma.address.findUnique({
        where: { id: addressId },
      });
      if (!addr || addr.userId !== user.id) {
        return NextResponse.json(
          { error: "Address not found" },
          { status: 400 }
        );
      }
      shippingAddress = formatAddressForShipping(addr);
    } else if (addressInput) {
      const parsed = parseAddressBody(addressInput);
      if (!parsed) {
        return NextResponse.json(
          {
            error:
              "Valid address required: street, neighborhood, city, state (UF), country (code)",
          },
          { status: 400 }
        );
      }
      shippingAddress = formatAddressForShipping(parsed);
      await prisma.address.create({
        data: {
          userId: user.id,
          street: parsed.street,
          neighborhood: parsed.neighborhood,
          number: parsed.number ?? undefined,
          city: parsed.city,
          state: parsed.state,
          country: parsed.country,
          complement: parsed.complement ?? undefined,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Address (addressId or address object) is required" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        document,
        ...(phone !== undefined && phone !== null && { phone }),
      },
    });

    const sessionId = await getOrCreateCartSessionId();
    const cart = await prisma.cart.findFirst({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} available.`,
          },
          { status: 400 }
        );
      }
    }

    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          userId: user.id,
          status: "CONFIRMED",
          total,
          shippingAddress,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
            })),
          },
        },
      }),
      prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      }),
      ...cart.items.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      ),
    ]);

    return NextResponse.json({
      data: {
        id: order.id,
        total,
        status: order.status,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
