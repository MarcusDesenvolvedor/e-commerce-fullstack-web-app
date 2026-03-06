import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateCartSessionId } from "@/lib/cart-session";

export async function GET() {
  try {
    const sessionId = await getOrCreateCartSessionId();

    let cart = await prisma.cart.findFirst({
      where: { sessionId },
      include: {
        items: {
          orderBy: { createdAt: "asc" },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                stock: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId },
        include: {
          items: {
            orderBy: { createdAt: "asc" },
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  stock: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });
    }

    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: Number(item.product.price),
        stock: item.product.stock,
        imageUrl: item.product.imageUrl,
      },
    }));

    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return NextResponse.json({
      data: { id: cart.id, items, total },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch cart";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
