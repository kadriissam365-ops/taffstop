"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "danger" | "subtle" | "success";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--brand)] text-white hover:opacity-90 active:scale-[0.98] shadow-sm",
  ghost:
    "bg-transparent hover:bg-[var(--bg-elevated)] text-[var(--fg)] border border-[var(--border)]",
  danger:
    "bg-transparent text-[var(--brand)] hover:bg-[var(--brand-soft)] border border-[var(--brand)]/40",
  subtle:
    "bg-[var(--bg-elevated)] text-[var(--fg)] hover:bg-[var(--bg-card)] border border-[var(--border)]",
  success:
    "bg-[var(--success)] text-white hover:opacity-90 active:scale-[0.98] shadow-sm",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-5 text-base rounded-xl",
  lg: "h-14 px-7 text-lg rounded-2xl font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", fullWidth, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    />
  );
});
