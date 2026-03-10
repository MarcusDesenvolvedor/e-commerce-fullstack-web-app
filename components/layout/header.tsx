import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-6 md:px-8 lg:px-10">
        <Link href="/" className="mr-6 ml-6 flex items-center space-x-2 font-semibold">
          <span>E-commerce</span>
        </Link>
        <nav className="flex flex-1 items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-6">
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
            <Show when="signed-in">
              <Link
                href="/account"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Account
              </Link>
              <Link
                href="/orders"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Orders
              </Link>
            </Show>
          </div>
          <div className="flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Sign up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </nav>
      </div>
    </header>
  );
}
