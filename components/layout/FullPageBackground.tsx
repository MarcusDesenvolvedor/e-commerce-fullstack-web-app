"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const LightPillar = dynamic(
  () => import("@/components/backgrounds/LightPillar").then((m) => m.default),
  { ssr: false }
);

const Particles = dynamic(
  () => import("@/components/backgrounds/Particles").then((m) => m.default),
  { ssr: false }
);

export function FullPageBackground() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <div
        className="fixed inset-0 z-0 min-h-screen w-screen bg-black"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
        }}
        aria-hidden
      >
        <Particles
          className="absolute inset-0 h-full w-full min-h-full min-w-full"
          particleCount={250}
          particleSpread={12}
          speed={0.08}
          moveParticlesOnHover
          particleHoverFactor={4}
          alphaParticles
          particleColors={["#ffffff", "#a78bfa", "#c4b5fd"]}
          particleBaseSize={80}
          sizeRandomness={0.8}
        />
      </div>
    );
  }

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
