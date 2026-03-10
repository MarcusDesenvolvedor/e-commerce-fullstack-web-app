"use client";

import dynamic from "next/dynamic";

const LightPillar = dynamic(
  () => import("@/components/backgrounds/LightPillar").then((m) => m.default),
  { ssr: false }
);

export function FullPageBackground() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <LightPillar
        className="absolute inset-0 h-full w-full"
        topColor="#5227FF"
        bottomColor="#FF9FFC"
        intensity={0.8}
        interactive
      />
    </div>
  );
}
