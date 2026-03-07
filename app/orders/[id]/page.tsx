import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getOrCreateUserFromClerk } from "@/lib/clerk-user";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/orders");

  const clerkUserData = await currentUser();
  const email =
    clerkUserData?.emailAddresses?.[0]?.emailAddress ?? "user@example.com";
  const fullName =
    [clerkUserData?.firstName, clerkUserData?.lastName].filter(Boolean).join(" ") ||
    "Customer";

  const user = await getOrCreateUserFromClerk(userId, email, fullName);

  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: {
      items: {
        include: {
          product: { select: { name: true, slug: true } },
        },
      },
    },
  });

  if (!order) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold">Order not found</h1>
        <Link href="/orders" className="mt-4 inline-block text-primary hover:underline">
          View orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-3xl font-bold">Order confirmed</h1>
      <p className="mb-8 text-muted-foreground">
        Thank you for your order. Order #{order.id.slice(0, 8)}
      </p>

      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Shipping to</p>
        <p className="mt-1 whitespace-pre-wrap">{order.shippingAddress}</p>
        <ul className="mt-6 space-y-2 border-t border-border pt-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <Link
                href={`/products/${item.product.slug}`}
                className="hover:text-primary"
              >
                {item.product.name} × {item.quantity}
              </Link>
              <span>${(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-border pt-4 text-xl font-bold">
          Total: ${Number(order.total).toFixed(2)}
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/products"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Continue shopping
        </Link>
        <Link
          href="/orders"
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          View all orders
        </Link>
      </div>
    </div>
  );
}
