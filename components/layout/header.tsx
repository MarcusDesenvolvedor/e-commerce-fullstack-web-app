"use client";

import Link from "next/link";
import Image from "next/image";

import logo from "@/assets/images/next-logo.png";
import { usePathname } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { GooeyNav } from "@/components/ui/GooeyNav";
const BASE_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Cart", href: "/cart" },
];

const AUTH_NAV_ITEMS = [
  { label: "Account", href: "/account" },
  { label: "Orders", href: "/orders" },
];

export function Header() {
  const pathname = usePathname();
  const navItems = [...BASE_NAV_ITEMS];
  return (
    <header className="sticky top-0 z-50 flex w-full justify-center px-4 pt-6 md:pt-8">
      <div className="flex h-12 min-w-0 items-center gap-5 rounded-full border border-border/70 bg-transparent px-5 py-2 outline outline-1 outline-border/50 outline-offset-0 md:h-12 md:gap-6 md:px-6">
        <div className="flex items-center gap-0">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
            src={logo}
            alt="E-commerce"
            width={100}
            height={300}
            className="h-20 w-20 object-contain md:h-24 md:w-32"
          />
          </Link>
          <div className="flex items-center">
            <Show when="signed-out">
              <GooeyNav
                items={navItems}
                particleCount={12}
                timeVariance={400}
                particleR={1000}
                initialActiveIndex={Math.max(
                  0,
                  navItems.findIndex(
                    (i) =>
                      pathname === i.href ||
                      (i.href !== "/" && pathname.startsWith(i.href + "/"))
                  )
                )}
              />
            </Show>
            <Show when="signed-in">
              <GooeyNav
                items={[...navItems, ...AUTH_NAV_ITEMS]}
                particleCount={12}
                timeVariance={400}
                particleR={1000}
                initialActiveIndex={Math.max(
                  0,
                  [...navItems, ...AUTH_NAV_ITEMS].findIndex(
                    (i) =>
                      i.href === pathname ||
                      (i.href !== "/" && pathname.startsWith(i.href + "/"))
                  )
                )}
              />
            </Show>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="rounded-full border border-input bg-background px-3 py-1.5 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Sign up
                </button>
              </SignUpButton>
            </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
