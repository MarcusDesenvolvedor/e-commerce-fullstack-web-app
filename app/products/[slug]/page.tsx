import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const p = await prisma.product.findFirst({
    where: { slug, isActive: true, deletedAt: null },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });

  if (!p) notFound();

  const product = {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    stock: p.stock,
    imageUrl: p.imageUrl,
    category: p.category,
  };

  return (
    <div className="container py-8">
      <Link
        href="/products"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-8xl text-muted-foreground">
              📦
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.category && (
            <p className="mt-2 text-sm text-muted-foreground">
              {product.category.name}
            </p>
          )}
          <p className="mt-4 text-3xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
          {product.description && (
            <p className="mt-4 text-muted-foreground">{product.description}</p>
          )}
          {product.stock <= 0 ? (
            <p className="mt-6 text-destructive">Out of stock</p>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              {product.stock} in stock
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
