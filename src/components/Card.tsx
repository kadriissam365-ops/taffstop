import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        "bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
