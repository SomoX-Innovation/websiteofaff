import { initializeRegionalSEO } from "../lib/seo-config.js";

const STORAGE_KEY = "age_verified_v1";

/** Initialize SEO optimization for the user's region */
export function initSEO() {
  try {
    initializeRegionalSEO();
  } catch (error) {
    console.warn("SEO initialization failed:", error);
  }
}

/** Tag strip: prefill home search when `#tube-search-input` exists (VTube-style nav). */
export function bindTubeTagNav() {
  document.querySelector("#tube-tags")?.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-tube-tag]");
    if (!a) return;
    const tag = a.getAttribute("data-tube-tag");
    if (!tag) return;
    const input = document.getElementById("tube-search-input");
    if (!input) return;
    e.preventDefault();
    input.value = tag;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

export function initAgeGate() {
  const gate = document.getElementById("age-gate");
  const enter = document.getElementById("age-enter");
  const exitBtn = document.getElementById("age-exit");
  if (!gate || !enter || !exitBtn) return;

  if (localStorage.getItem(STORAGE_KEY) === "1") {
    gate.hidden = true;
    gate.setAttribute("aria-hidden", "true");
    return;
  }

  const close = () => {
    gate.hidden = true;
    gate.setAttribute("aria-hidden", "true");
    localStorage.setItem(STORAGE_KEY, "1");
  };

  enter.addEventListener("click", close);
  exitBtn.addEventListener("click", () => {
    window.location.href = "https://www.google.com/";
  });
}

export function initFooterYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

export function initNativeInterstitials() {
  // ExoClick Desktop Fullpage Interstitial (zone 5900608)
  const ins = document.createElement('ins');
  ins.className = 'eas5900608';
  ins.setAttribute('data-zoneid', '5900608');
  ins.setAttribute('data-keywords', 'adult');
  ins.setAttribute('data-block-ad-types', '0');
  document.body.appendChild(ins);
  if (window.AdProvider) window.AdProvider.push({ serve: {} });
}

export function initPageBasics() {
  initSEO();
  initFooterYear();
  initAgeGate();
  bindTubeTagNav();
}
