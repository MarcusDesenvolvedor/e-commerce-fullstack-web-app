import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getOrCreateUserFromClerk } from "@/lib/clerk-user";

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUserData = await currentUser();
  const email =
    clerkUserData?.emailAddresses?.[0]?.emailAddress ?? "user@example.com";
  const fullName =
    [clerkUserData?.firstName, clerkUserData?.lastName].filter(Boolean).join(" ") ||
    "Customer";

  const user = await getOrCreateUserFromClerk(userId, email, fullName);

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">My orders</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
            >
              <div className="flex justify-between">
                <span className="font-medium">
                  Order #{order.id.slice(0, 8)}
                </span>
                <span className="text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {order.items.length} item(s) · ${Number(order.total).toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/products"
        className="mt-8 inline-block text-primary hover:underline"
      >
        Continue shopping
      </Link>
    </div>
  );
}
