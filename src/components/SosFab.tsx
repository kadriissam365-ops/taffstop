"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Floating action button "SOS" — visible sur certaines pages
const VISIBLE_ON = ["/", "/log", "/stats"];

export function SosFab() {
  const pathname = usePathname();
  if (!pathname) return null;
  if (pathname.startsWith("/sos")) return null;
  if (pathname.startsWith("/onboarding")) return null;

  const isVisible =
    pathname === "/" ||
    VISIBLE_ON.some((p) => p !== "/" && pathname.startsWith(p));
  if (!isVisible) return null;

  return (
    <Link
      href="/sos"
      aria-label="Mode SOS Craving"
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40 animate-pulse-ring transition active:scale-95"
    >
      <span className="text-xs font-bold tracking-wider">SOS</span>
    </Link>
  );
}
