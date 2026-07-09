"use client";

import { useEffect } from "react";

/**
 * Single consistent ad placement: a labeled card with a fixed-size, centered
 * ExoClick zone inside. `variant` controls sizing/aspect so every slot on the
 * site shares the same visual language instead of one-off inline styles.
 *
 * The serve trigger runs in an effect (not an inline <script>) so zones are
 * requested on client-side navigations too, not only on hard page loads.
 *
 * variant: "leaderboard" (728x90) | "sidebar" (300x250) | "rect" (308x286) | "banner" (468x60)
 */
const VARIANTS = {
  leaderboard: { minHeight: 90, maxWidth: 728 },
  sidebar: { minHeight: 250, maxWidth: 300 },
  rect: { minHeight: 286, maxWidth: 308 },
  banner: { minHeight: 60, maxWidth: 468 },
};

export default function AdSlot({ variant = "sidebar", zoneClass, zoneId, keywords = "adult", sub, label = "Advertisement" }) {
  const v = VARIANTS[variant] || VARIANTS.sidebar;

  useEffect(() => {
    try {
      (window.AdProvider = window.AdProvider || []).push({ serve: {} });
    } catch (_) {}
  }, []);

  return (
    <div className={`ad-slot ad-slot--${variant}`} style={{ maxWidth: v.maxWidth, minHeight: v.minHeight }}>
      <span className="ad-slot__label">{label}</span>
      <div className="ad-slot__inner">
        <ins
          className={zoneClass}
          data-zoneid={zoneId}
          data-keywords={keywords}
          data-sub={sub}
          data-block-ad-types="0"
        />
      </div>
    </div>
  );
}
