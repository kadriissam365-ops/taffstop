"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Plus, Trophy, Settings } from "lucide-react";

const items = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/log", label: "Log", icon: Plus, primary: true },
  { href: "/milestones", label: "Étapes", icon: Trophy },
  { href: "/settings", label: "Profil", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/onboarding")) return null;

  return (
    <nav className="sticky bottom-0 z-30 border-t border-border bg-bg-elevated/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md items-center justify-between px-3 py-2">
        {items.map(({ href, label, icon: Icon, primary }) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          if (primary) {
            return (
              <li key={href} className="flex-1 flex items-center justify-center -mt-6">
                <Link
                  href={href}
                  aria-label={label}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40 active:scale-95 transition-transform"
                >
                  <Icon className="h-7 w-7" />
                </Link>
              </li>
            );
          }
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 py-1 text-[11px] ${
                  active ? "text-brand" : "text-fg-muted"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "scale-110" : ""} transition-transform`} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
