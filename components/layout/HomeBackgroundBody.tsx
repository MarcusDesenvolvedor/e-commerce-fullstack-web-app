"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function HomeBackgroundBody() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (isHome) {
      document.documentElement.classList.add("home-page");
      document.body.classList.add("home-page");
    } else {
      document.documentElement.classList.remove("home-page");
      document.body.classList.remove("home-page");
    }
    return () => {
      document.documentElement.classList.remove("home-page");
      document.body.classList.remove("home-page");
    };
  }, [isHome]);

  return null;
}
