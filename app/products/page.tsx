import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string; q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim();

  const [productsRaw, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        ...(params.categoryId ? { categoryId: params.categoryId } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" as const } },
                {
                  description: { contains: q, mode: "insensitive" as const },
                },
              ],
            }
          : {}),
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    }),
  ]);

  const products = productsRaw.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    stock: p.stock,
    imageUrl: p.imageUrl,
    category: p.category,
  }));

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Products</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            Categories
          </h2>
          <nav className="flex flex-wrap gap-2 lg:flex-col">
            <Link
              href="/products"
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                !params.categoryId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  params.categoryId === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <form
            action="/products"
            method="get"
            className="mb-6 flex gap-2"
          >
            {params.categoryId && (
              <input
                type="hidden"
                name="categoryId"
                value={params.categoryId}
              />
            )}
            <input
              type="search"
              name="q"
              defaultValue={params.q}
              placeholder="Search products by name or description..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Search
            </button>
          </form>

          {products.length === 0 ? (
            <p className="text-muted-foreground">No products found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
                >
                  <div className="aspect-square bg-muted">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-primary">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-lg font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </p>
                    {product.stock <= 0 && (
                      <p className="mt-1 text-sm text-destructive">
                        Out of stock
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
