"use client";

import { useEffect } from "react";

export default function StickyAdBar() {
  useEffect(() => {
    try {
      (window.AdProvider = window.AdProvider || []).push({ serve: {} });
    } catch (_) {}
  }, []);

  return (
    <div className="ad-sticky-bottom" id="ad-sticky-bottom">
      <ins className="eas6a97888e2" data-zoneid="5900606" data-keywords="adult" data-block-ad-types="0" />
      <button
        className="ad-sticky-bottom__close"
        onClick={(e) => e.currentTarget.closest("#ad-sticky-bottom")?.remove()}
      >
        ✕
      </button>
    </div>
  );
}
