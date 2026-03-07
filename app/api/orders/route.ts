import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getOrCreateCartSessionId } from "@/lib/cart-session";
import { getOrCreateUserFromClerk } from "@/lib/clerk-user";

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
      [clerkUserData?.firstName, clerkUserData?.lastName].filter(Boolean).join(" ") ||
      "Customer";

    const body = await request.json();
    const shippingAddress = (body.shippingAddress as string)?.trim();

    if (!shippingAddress || shippingAddress.length < 5) {
      return NextResponse.json(
        { error: "Valid shipping address is required" },
        { status: 400 }
      );
    }

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

    const user = await getOrCreateUserFromClerk(userId, email, fullName);

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
