import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateCartSessionId } from "@/lib/cart-session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = body.productId as string | undefined;
    let quantity = Number(body.quantity) || 1;

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    if (quantity < 1) quantity = 1;

    const sessionId = await getOrCreateCartSessionId();

    let cart = await prisma.cart.findFirst({ where: { sessionId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { sessionId } });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true, deletedAt: null },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (quantity > product.stock) {
      return NextResponse.json(
        { error: `Only ${product.stock} in stock` },
        { status: 400 }
      );
    }

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add to cart";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = body.productId as string | undefined;
    const quantity = Number(body.quantity);

    if (!productId || quantity < 1) {
      return NextResponse.json(
        { error: "productId and positive quantity required" },
        { status: 400 }
      );
    }

    const sessionId = await getOrCreateCartSessionId();
    const cart = await prisma.cart.findFirst({ where: { sessionId } });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || quantity > product.stock) {
      return NextResponse.json(
        { error: `Max ${product?.stock ?? 0} in stock` },
        { status: 400 }
      );
    }

    await prisma.cartItem.update({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
      data: { quantity },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update cart";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = body.productId as string | undefined;

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const sessionId = await getOrCreateCartSessionId();
    const cart = await prisma.cart.findFirst({ where: { sessionId } });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to remove from cart";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
