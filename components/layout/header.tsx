import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-6 md:px-8 lg:px-10">
        <Link href="/" className="mr-6 ml-6 flex items-center space-x-2 font-semibold">
          <span>E-commerce</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Products
          </Link>
          <Link
            href="/cart"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Cart
          </Link>
        </nav>
      </div>
    </header>
  );
}
