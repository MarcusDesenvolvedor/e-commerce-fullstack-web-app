"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { RotatingText } from "@/components/ui/RotatingText";

const ROTATING_WORDS = ["your plan", "your work", "your mode"];

export function HeroSection() {
  return (
    <section className="relative flex w-full flex-col items-center px-4 pt-16 pb-24 md:pb-32">
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-16 pointer-events-none">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block text-muted-foreground/90">Your time,</span>
            <motion.span
              layout
              transition={{ type: "spring", damping: 35, stiffness: 300 }}
              className="mt-2 inline-flex items-baseline text-foreground"
            >
              <RotatingText
                texts={ROTATING_WORDS}
                rotationInterval={4000}
                staggerDuration={0.03}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                mainClassName="inline-flex min-w-[8ch] justify-center rounded-lg bg-purple-500/55 px-3 py-1.5 dark:bg-purple-500/60"
                elementLevelClassName="text-foreground"
              />
            </motion.span>
          </h1>
        </div>
        <div className="flex flex-col items-center gap-12 text-center pointer-events-auto">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              A simple way to build
              <br />
              your online store
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Create your ecommerce store, manage your products
              <br />
              and accept payments easily
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Start for free
            </Link>
            <Link
              href="/cart"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-transparent px-6 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              View plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
