"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { loadProfile } from "@/lib/storage";

export function ProfileGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const profile = loadProfile();
    const isOnboarding = pathname?.startsWith("/onboarding");
    if (!profile && !isOnboarding) {
      router.replace("/onboarding");
      return;
    }
    if (profile && isOnboarding) {
      router.replace("/");
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-brand" />
      </div>
    );
  }

  return <>{children}</>;
}
