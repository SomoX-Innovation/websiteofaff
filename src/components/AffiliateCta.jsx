import { AFFILIATE_LINKS } from "../affiliate-config.js";

/** Static replacement for injectAffiliateCTAs(containerId) — same markup, rendered server-side. */
export default function AffiliateCta() {
  return (
    <div className="affiliate-cta-bar" style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
      <a
        href={AFFILIATE_LINKS.liveCams}
        target="_blank"
        rel="nofollow noopener"
        className="btn btn--primary"
        style={{ flex: 1, textAlign: "center", background: "#e50914", color: "white" }}
      >
        🔴 Watch Live Cams
      </a>
      <a
        href={AFFILIATE_LINKS.premiumHD}
        target="_blank"
        rel="nofollow noopener"
        className="btn btn--primary"
        style={{ flex: 1, textAlign: "center", background: "#ff9900", color: "#111" }}
      >
        ⭐ Upgrade to Premium HD
      </a>
    </div>
  );
}
