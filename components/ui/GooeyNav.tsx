"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

export interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
}

const GOOEY_CSS = `
.gooey-nav-container {
  position: relative;
}
.gooey-nav-effect {
  position: absolute;
  opacity: 1;
  pointer-events: none;
  display: grid;
  place-items: center;
  z-index: 1;
}
.gooey-nav-effect.text {
  color: white;
  transition: color 0.3s ease;
}
.gooey-nav-effect.text.active {
  color: black;
}
.gooey-nav-effect.filter {
  filter: blur(7px) contrast(100) blur(0);
  mix-blend-mode: lighten;
}
.gooey-nav-effect.filter::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  background: transparent;
}
.gooey-nav-effect.filter::after {
  content: "";
  position: absolute;
  inset: 0;
  background: white;
  transform: scale(0);
  opacity: 0;
  z-index: -1;
  border-radius: 9999px;
}
.gooey-nav-effect.active::after {
  animation: gooey-pill 0.3s ease both;
}
@keyframes gooey-pill {
  to { transform: scale(1); opacity: 1; }
}
.gooey-particle, .gooey-point {
  display: block;
  opacity: 0;
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  transform-origin: center;
}
.gooey-particle {
  position: absolute;
  top: calc(50% - 8px);
  left: calc(50% - 8px);
}
.gooey-point {
  background: var(--color);
  opacity: 1;
}
@keyframes gooey-particle-anim {
  0% { transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y))); opacity: 1; animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
  70% { transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2)); opacity: 1; animation-timing-function: ease; }
  85% { transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y))); opacity: 1; }
  100% { transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5)); opacity: 1; }
}
@keyframes gooey-point-anim {
  0% { transform: scale(0); opacity: 0; animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
  25% { transform: scale(calc(var(--scale) * 0.25)); }
  38% { opacity: 1; }
  65% { transform: scale(var(--scale)); opacity: 1; animation-timing-function: ease; }
  85% { transform: scale(var(--scale)); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
}
.gooey-nav-li.active { color: black; text-shadow: none; }
.gooey-nav-li.active::after { opacity: 1; transform: scale(1); }
.gooey-nav-li::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: white;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
  z-index: -1;
}
.gooey-nav-li:hover::after {
  opacity: 0.15;
  transform: scale(1);
}
`;

export function GooeyNav({
  items,
  animationTime = 600,
  particleCount = 12,
  particleDistances = [90, 10],
  particleR = 1000,
  timeVariance = 400,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}: GooeyNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (
    distance: number,
    pointIndex: number,
    totalPoints: number
  ): [number, number] => {
    const angle =
      ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };
  const createParticle = (
    i: number,
    t: number,
    d: [number, number],
    r: number
  ) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };
  const makeParticles = (element: HTMLDivElement) => {
    const d: [number, number] = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove("active");
      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("gooey-particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty(
          "--color",
          `var(--color-${p.color}, white)`
        );
        particle.style.setProperty("--rotate", `${p.rotate}deg`);
        particle.style.animation = `gooey-particle-anim calc(var(--time)) ease 1 -350ms`;
        point.classList.add("gooey-point");
        point.style.animation = `gooey-point-anim calc(var(--time)) ease 1 -350ms`;
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => element.classList.add("active"));
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // ignore
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current)
      return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClickByElement = (liEl: HTMLElement, index: number) => {
    if (activeIndex === index) return;
    setActiveIndex(index);
    updateEffectPosition(liEl);
    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll(".gooey-particle");
      particles.forEach((p) => {
        try {
          filterRef.current?.removeChild(p);
        } catch {
          // ignore
        }
      });
    }
    if (textRef.current) {
      textRef.current.classList.remove("active");
      void textRef.current.offsetWidth;
      textRef.current.classList.add("active");
    }
    if (filterRef.current) makeParticles(filterRef.current);
  };

  const handleClick = (e: React.MouseEvent, index: number) => {
    handleClickByElement(e.currentTarget as HTMLElement, index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const liEl = (e.currentTarget as HTMLElement).closest("li") as HTMLElement | null;
      if (liEl) handleClickByElement(liEl, index);
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const lis = navRef.current.querySelectorAll("li");
    const activeLi = lis[activeIndex] as HTMLElement;
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add("active");
    }
    const resizeObserver = new ResizeObserver(() => {
      const currentLi = lis[activeIndex] as HTMLElement;
      if (currentLi) updateEffectPosition(currentLi);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GOOEY_CSS }} />
      <div
        ref={containerRef}
        className="gooey-nav-container relative flex items-center"
      >
        <div
          ref={filterRef}
          className="gooey-nav-effect filter"
          style={{ left: 0, top: 0, width: 0, height: 0 }}
        />
        <div
          ref={textRef}
          className="gooey-nav-effect text text-sm font-medium"
          style={{ left: 0, top: 0, width: 0, height: 0 }}
        />
        <nav>
          <ul
            ref={navRef}
            className="flex list-none items-center gap-1 md:gap-2 text-sm font-medium text-white [text-shadow:0_0_10px_rgba(0,0,0,0.5)]"
          >
            {items.map((item, index) => (
              <li
                key={item.href}
                className={`gooey-nav-li relative cursor-pointer rounded-full py-[0.5em] px-[1em] outline-none ${
                  activeIndex === index ? "active" : ""
                }`}
                onClick={(e) => handleClick(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                role="menuitem"
                tabIndex={0}
              >
                <Link href={item.href} className="relative z-10 block">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
