import Link from "next/link";

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          E-commerce Fullstack Web App
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Product catalog, cart, checkout, and order history. Built with Next.js,
          TypeScript, Tailwind, Prisma — portfolio project.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/products"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Browse Products
        </Link>
        <Link
          href="/cart"
          className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          View Cart
        </Link>
      </div>
      <div className="mt-8 rounded-lg border border-border bg-muted/50 p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Next steps</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Edit <code className="rounded bg-muted px-1.5 py-0.5">.env</code> with your <code className="rounded bg-muted px-1.5 py-0.5">DATABASE_URL</code> (user:password@host:port/db)</li>
          <li>Run <code className="rounded bg-muted px-1.5 py-0.5">npm run db:migrate</code> to apply schema</li>
          <li>Test connection: <a href="/api/db-test" className="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">/api/db-test</a></li>
          <li>Implement features per <code className="rounded bg-muted px-1.5 py-0.5">docs/rules</code></li>
        </ul>
      </div>
    </div>
  );
}
