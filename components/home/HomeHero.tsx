"use client";

import { motion } from "motion/react";
import { RotatingText } from "@/components/ui/RotatingText";

const ROTATING_WORDS = ["your plan", "your work", "your mode"];

export function HomeHero() {
  return (
    <div className="relative flex w-full min-h-[calc(100vh-8rem)] flex-col items-center">
      <div className="flex w-full max-w-4xl min-h-[calc(100vh-8rem)] flex-col items-center justify-start px-4 pt-16 pb-16">
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
      </div>
    </div>
  );
}
