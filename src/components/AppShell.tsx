import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-md w-full mx-auto px-4 pb-28 pt-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
