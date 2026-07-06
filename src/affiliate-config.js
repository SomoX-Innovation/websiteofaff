/**
 * Affiliate Monetization Manager
 * Centralizes all of your money-making links across the site.
 */

export const AFFILIATE_LINKS = {
  // Replace these with your actual CPA/RevShare links
  liveCams: "https://a.recordables.com/url/CamsGoHere",
  premiumHD: "https://a.recordables.com/url/HDGoHere",
  dating: "https://a.recordables.com/url/DatingGoHere"
};

/**
 * FAKE PLAY BUTTON CONFIG
 * When a visitor clicks the play button on any video card on the home page,
 * this URL opens in a new tab (ad/affiliate impression) before going to the watch page.
 *
 * HOW TO GET YOUR URL:
 *  - ExoClick  → Publishers → Zones → Create "Smart Link" zone → copy the URL
 *  - JuicyAds  → Publishers → Zones → "Direct Link" → copy the URL
 *  - CPA offer → any cam/dating affiliate link
 *
 * PASTE YOUR URL BELOW (replace the placeholder):
 */
export const FAKE_PLAY_AD_URL = "https://a.recordables.com/url/PlayAdGoHere";

/** Fallback content when the live feed is unavailable. */
export const fallbackSite = {
  siteName: "WellwetX",
  heroTitle: "Trending videos",
  heroLead: "Fresh clips updated daily.",
  offers: [],
};

/**
 * Injects affiliate Call-To-Action buttons into target containers.
 */
export function injectAffiliateCTAs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="affiliate-cta-bar" style="display: flex; gap: 10px; margin: 15px 0;">
      <a href="${AFFILIATE_LINKS.liveCams}" target="_blank" rel="nofollow noopener" 
         class="btn btn--primary" style="flex: 1; text-align: center; background: #e50914; color: white;">
         🔴 Watch Live Cams
      </a>
      <a href="${AFFILIATE_LINKS.premiumHD}" target="_blank" rel="nofollow noopener" 
         class="btn btn--primary" style="flex: 1; text-align: center; background: #ff9900; color: #111;">
         ⭐ Upgrade to Premium HD
      </a>
    </div>
  `;
}
