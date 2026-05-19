"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Toast = {
  id: number;
  message: string;
  tone: "brand" | "success" | "warn" | "info";
};

type ToastCtx = {
  push: (message: string, tone?: Toast["tone"]) => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Pas de provider monté (SSR fallback) — no-op
    return { push: () => {} };
  }
  return ctx;
}

export function Toaster({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const push = useCallback((message: string, tone: Toast["tone"] = "brand") => {
    idRef.current += 1;
    const id = idRef.current;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2400);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed left-1/2 top-6 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -14, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className={toneClass(t.tone)}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function toneClass(tone: Toast["tone"]) {
  const base = "rounded-full border px-5 py-2 text-sm font-medium shadow-lg backdrop-blur";
  switch (tone) {
    case "success":
      return `${base} border-success/30 bg-success-soft text-success`;
    case "warn":
      return `${base} border-warn/30 bg-warn-soft text-warn`;
    case "info":
      return `${base} border-info/30 bg-info-soft text-info`;
    default:
      return `${base} border-brand/30 bg-brand-soft text-brand`;
  }
}
