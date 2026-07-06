"use client";

import { useEffect } from "react";
import { initPageBasics } from "../shared/page-init.js";
import { initAdManager } from "../lib/ad-manager.js";
import { initAuthModal } from "../lib/auth-modal.js";

/**
 * Mounts once per page: age-gate, footer year, floating ad, ExoClick ad zones,
 * and the consumer auth modal. Renders nothing itself.
 */
export default function PageChrome({ withAuthModal = true }) {
  useEffect(() => {
    initPageBasics();
    initAdManager();
    if (withAuthModal) initAuthModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
