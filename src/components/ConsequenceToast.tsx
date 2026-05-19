"use client";

import { useEffect, useState } from "react";
import { HEALTH_CONSTANTS } from "@/lib/constants";

const messages = [
  (price: number) =>
    `🔥 -${(price).toFixed(2)} €. Brûlés.`,
  () => `🕐 -${HEALTH_CONSTANTS.MINUTES_LOST_PER_CIG} min de vie.`,
  () => `🫁 +${HEALTH_CONSTANTS.TAR_MG_PER_CIG} mg de goudron.`,
  () => `🧪 +${HEALTH_CONSTANTS.CO_MG_PER_CIG} mg de CO.`,
  () => `💉 +${HEALTH_CONSTANTS.NICOTINE_MG_PER_CIG} mg de nicotine.`,
];

export function ConsequenceToast({
  pricePerCig,
  trigger,
}: {
  pricePerCig: number;
  trigger: number;
}) {
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (trigger === 0) return;
    const random = messages[Math.floor(Math.random() * messages.length)];
    setMsg(random(pricePerCig));
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(t);
  }, [trigger, pricePerCig]);

  if (!visible || !msg) return null;
  return (
    <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 animate-scale-pop">
      <div className="rounded-full border border-brand/30 bg-brand-soft px-5 py-2 text-sm font-medium text-brand shadow-lg">
        {msg}
      </div>
    </div>
  );
}
