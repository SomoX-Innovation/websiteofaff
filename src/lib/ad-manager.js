/**
 * Ad Network Manager — ExoClick only
 */

export const AD_CONFIG = {
  EXOCLICK_ENABLED: true,

  // ExoClick Zone IDs
  EXOCLICK_BANNER_300x250_ID:    "5900210",  // Banner 300x250
  EXOCLICK_SIDEBAR_300x250_ID:   "5900204",  // Banner 300x250 (sidebar)
  EXOCLICK_STICKY_728x90_ID:     "5900606",  // Sticky Banner 728x90
  EXOCLICK_INSTANT_MSG_ID:       "5899668",  // Instant Message 300x250
  EXOCLICK_INTERSTITIAL_D_ID:    "5900608",  // Desktop Fullpage Interstitial
  EXOCLICK_INTERSTITIAL_M_ID:    "5900714",  // Mobile Fullpage Interstitial
  EXOCLICK_OUTSTREAM_ID:         "5900780",  // Outstream Video
  EXOCLICK_RECOMMENDATION_ID:    "5900782",  // Recommendation Widget
  EXOCLICK_VAST_ID:              "5969012",  // In-Stream Video (VAST)
  MAGSRV_VAST_URL: "https://s.magsrv.com/v1/vast.php?idz=5969012",
  MAGSRV_INVIDEO_VAST_URL: "https://s.magsrv.com/v1/vast.php?idz=5969014", // In-Video banner (shown on pause)

  // Interstitial overlay steps
  EXOCLICK_OVERLAY_STEP1_ID: "5900204",
  EXOCLICK_OVERLAY_STEP2_ID: "5900208",
  EXOCLICK_OVERLAY_STEP3_ID: "5900210",
};

/**
 * Initializes all ExoClick ad zones.
 */
export function initAdManager() {
  if (!AD_CONFIG.EXOCLICK_ENABLED) return;

  loadExoClickScript();

  document.querySelectorAll('[data-ad-zone]').forEach(el => {
    const zoneType = el.getAttribute('data-ad-zone');

    if (zoneType === 'leaderboard') {
      loadExoClickBanner(el, AD_CONFIG.EXOCLICK_STICKY_728x90_ID, 728, 90);
    } else if (zoneType.includes('sidebar')) {
      loadExoClickBanner(el, AD_CONFIG.EXOCLICK_SIDEBAR_300x250_ID, 300, 250);
    } else if (zoneType === 'infeed') {
      loadExoClickBanner(el, AD_CONFIG.EXOCLICK_RECOMMENDATION_ID, 300, 250);
    } else if (zoneType === 'banner') {
      loadExoClickBanner(el, AD_CONFIG.EXOCLICK_STICKY_728x90_ID, 728, 90);
    } else if (zoneType === 'medium') {
      loadExoClickBanner(el, AD_CONFIG.EXOCLICK_BANNER_300x250_ID, 300, 250);
    } else if (zoneType === 'rect') {
      loadExoClickBanner(el, AD_CONFIG.EXOCLICK_BANNER_300x250_ID, 300, 250);
    }
  });

  // Instant message / interstitial
  loadExoClickInstantMsg(AD_CONFIG.EXOCLICK_INSTANT_MSG_ID);
}

function loadExoClickScript() {
  if (window.exoClickLoaded) return;
  window.exoClickLoaded = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://a.magsrv.com/ad-provider.js';
  document.head.appendChild(script);
  script.onload = () => {
    if (window.AdProvider) window.AdProvider.push({ serve: {} });
  };
}

function loadExoClickBanner(element, zoneId, width, height) {
  if (!zoneId || !element) return;
  const w = width || element.getAttribute('data-width') || 300;
  const h = height || element.getAttribute('data-height') || 250;
  element.innerHTML = `<iframe src="https://a.exdynsrv.com/iframe.php?idzone=${zoneId}&size=${w}x${h}" width="${w}" height="${h}" frameborder="0" scrolling="no" marginwidth="0" marginheight="0"></iframe>`;
}

function loadExoClickInstantMsg(zoneId) {
  if (!zoneId) return;
  const ins = document.createElement('ins');
  ins.className = `eas${zoneId}`;
  ins.setAttribute('data-zoneid', zoneId);
  ins.setAttribute('data-keywords', 'adult');
  ins.setAttribute('data-block-ad-types', '0');
  document.body.appendChild(ins);
  if (window.AdProvider) {
    window.AdProvider.push({ serve: {} });
  }
}

// Zone IDs for the 3-step interstitial ads
const MAGSRV_STEPS = [
  { cls: `eas${AD_CONFIG.EXOCLICK_OVERLAY_STEP1_ID}`, zoneId: AD_CONFIG.EXOCLICK_OVERLAY_STEP1_ID },
];

const STEP_DURATIONS = [10]; // seconds per step

/** Fire a popunder (new tab) on first play — gets an extra ad impression */
function firePopunder() {
  if (sessionStorage.getItem('pu_fired')) return;
  sessionStorage.setItem('pu_fired', '1');
  try {
    const w = window.open('about:blank', '_blank');
    if (w) {
      w.document.write(`<!DOCTYPE html><html><head>
        <script async src="https://a.magsrv.com/ad-provider.js"><\/script>
        </head><body>
        <ins class="eas${AD_CONFIG.EXOCLICK_INTERSTITIAL_D_ID}" data-zoneid="${AD_CONFIG.EXOCLICK_INTERSTITIAL_D_ID}" data-keywords="adult"
             data-block-ad-types="0"></ins>
        <script>(AdProvider=window.AdProvider||[]).push({"serve":{}});<\/script>
        </body></html>`);
      w.document.close();
    }
  } catch(_) {}
}

/** Build one MagSrv <ins> + trigger inside a wrapper div */
function buildMagsrvAd(cls, zoneId) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:10px;min-height:260px;';

  const ins = document.createElement('ins');
  ins.className = cls;
  ins.setAttribute('data-zoneid', zoneId);
  ins.setAttribute('data-keywords', 'keywords');
  ins.setAttribute('data-sub', '123450000');
  ins.setAttribute('data-block-ad-types', '0');
  ins.setAttribute('data-ex_av', 'name');
  wrap.appendChild(ins);

  const trigger = document.createElement('script');
  trigger.textContent = '(AdProvider = window.AdProvider || []).push({"serve": {}});';
  wrap.appendChild(trigger);

  return wrap;
}

/**
 * Show 3-step sequential ad interstitial before video plays.
 * Each step has its own countdown + MagSrv ad.
 * After step 3 the user can click "Play Video" and the overlay closes.
 * A popunder fires on step 1 for an extra impression.
 */
export function showPopupAdOverlay(duration = 8, onComplete = null) {
  // Fire popunder once per session on first interaction
  firePopunder();

  let currentStep = 0;
  const totalSteps = MAGSRV_STEPS.length;

  // Overlay backdrop
  const overlay = document.createElement('div');
  overlay.id = 'ad-popup-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.92); display: flex; align-items: center;
    justify-content: center; z-index: 9999; font-family: 'Inter', sans-serif;
  `;

  // Card
  const card = document.createElement('div');
  card.style.cssText = `
    background: #111; padding: 28px 28px 22px; border-radius: 12px;
    text-align: center; width: 90%; max-width: 560px; color: #fff;
    box-shadow: 0 20px 50px rgba(0,0,0,0.6); border: 1px solid #2a2a2a;
  `;

  // Step indicator  e.g.  "Step 1 of 3"
  const stepLabel = document.createElement('div');
  stepLabel.style.cssText = 'font-size:12px;color:#555;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;';

  // Countdown number
  const timerEl = document.createElement('div');
  timerEl.style.cssText = 'font-size:52px;font-weight:800;color:#e50914;margin-bottom:4px;';

  // Message
  const msgEl = document.createElement('p');
  msgEl.style.cssText = 'font-size:14px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:0 0 18px;';

  // Ad slot container (swapped each step)
  const adSlot = document.createElement('div');

  // Continue / Play button
  const btn = document.createElement('button');
  btn.style.cssText = `
    background: #e50914; color: #fff; border: none; padding: 13px 36px;
    font-size: 17px; font-weight: bold; border-radius: 8px; cursor: pointer;
    display: none; margin-top: 14px; width: 100%; transition: background 0.2s;
  `;
  btn.onmouseover = () => { btn.style.background = '#f40a16'; };
  btn.onmouseout  = () => { btn.style.background = '#e50914'; };

  card.append(stepLabel, timerEl, msgEl, adSlot, btn);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  let interval = null;

  function runStep(stepIndex) {
    currentStep = stepIndex;
    const isLast = stepIndex === totalSteps - 1;
    const stepDuration = STEP_DURATIONS[stepIndex] || 5;
    const { cls, zoneId } = MAGSRV_STEPS[stepIndex];

    // Update step label
    stepLabel.textContent = totalSteps > 1 ? `Step ${stepIndex + 1} of ${totalSteps}` : '';

    // Swap ad
    adSlot.replaceChildren(buildMagsrvAd(cls, zoneId));

    // Show button immediately but disabled during countdown
    btn.style.display = 'block';
    btn.disabled = true;
    btn.style.opacity = '0.4';
    btn.style.cursor = 'not-allowed';
    btn.textContent = isLast ? 'Play Video ▶' : 'Continue →';

    // Reset message & timer
    msgEl.textContent = 'Advertisement — please wait…';
    timerEl.style.color = '#e50914';
    timerEl.textContent = stepDuration;

    // Clear any previous interval
    if (interval) clearInterval(interval);

    let remaining = stepDuration;
    interval = setInterval(() => {
      remaining--;
      timerEl.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(interval);
        interval = null;
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        msgEl.textContent = isLast ? 'Ready to play!' : 'Ad complete — continue to next step';
        timerEl.textContent = isLast ? '▶' : '✓';
        timerEl.style.color = isLast ? '#4CAF50' : '#4CAF50';
      }
    }, 1000);
  }

  btn.addEventListener('click', () => {
    if (currentStep < totalSteps - 1) {
      runStep(currentStep + 1);
    } else {
      // All steps done — close overlay and play
      if (interval) clearInterval(interval);
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s';
      setTimeout(() => {
        overlay.remove();
        if (typeof onComplete === 'function') onComplete();
      }, 300);
    }
  });

  runStep(0);
  return overlay;
}

/**
 * VAST Pre-roll video ad player.
 * Fetches the VAST XML, extracts the first MediaFile URL, plays it as a
 * video overlay, then calls onComplete when done or skipped.
 */
export async function showVastPreroll(onComplete) {
  const vastUrl = AD_CONFIG.MAGSRV_VAST_URL;
  if (!vastUrl) { if (typeof onComplete === 'function') onComplete(); return; }

  let mediaUrl = null;
  let skipAfter = 5;
  let duration = 15;
  const impressionUrls = [];

  // VAST responses are often Wrappers pointing at another VAST document —
  // follow VASTAdTagURI until we reach an InLine ad with a MediaFile.
  try {
    let nextUrl = vastUrl;
    for (let hop = 0; hop < 5 && nextUrl; hop++) {
      const res = await fetch(nextUrl);
      const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');

      xml.querySelectorAll('Impression').forEach((n) => {
        const u = n.textContent.trim();
        if (u) impressionUrls.push(u);
      });

      const mediaFile = xml.querySelector('MediaFile');
      if (mediaFile) {
        mediaUrl = mediaFile.textContent.trim();
        const dur = xml.querySelector('Duration');
        if (dur) {
          const parts = dur.textContent.trim().split(':');
          duration = (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2] || 0);
        }
        const skipOffset = xml.querySelector('Linear[skipoffset]')?.getAttribute('skipoffset');
        if (skipOffset) {
          const sp = skipOffset.split(':');
          const s = sp.length === 3 ? (+sp[0]) * 3600 + (+sp[1]) * 60 + (+sp[2] || 0) : parseInt(skipOffset, 10);
          if (Number.isFinite(s) && s > 0) skipAfter = s;
        }
        break;
      }

      const wrapperUri = xml.querySelector('VASTAdTagURI');
      nextUrl = wrapperUri ? wrapperUri.textContent.trim() : null;
    }
  } catch (_) {}

  if (!mediaUrl) { if (typeof onComplete === 'function') onComplete(); return; }

  // Fire impression trackers from the whole wrapper chain so the view is credited.
  impressionUrls.forEach((u) => { try { new Image().src = u; } catch (_) {} });

  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'vast-overlay';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:99999;background:#000;
    display:flex;flex-direction:column;align-items:stretch;justify-content:flex-end;
  `;

  const video = document.createElement('video');
  video.src = mediaUrl;
  video.autoplay = true;
  video.playsInline = true;
  video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;';

  // Controls bar
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;
    padding:10px 16px;background:rgba(0,0,0,0.7);font-family:'Inter',sans-serif;
  `;

  const adLabel = document.createElement('span');
  adLabel.style.cssText = 'color:#aaa;font-size:11px;letter-spacing:1px;text-transform:uppercase;';
  adLabel.textContent = 'Advertisement';

  const skipBtn = document.createElement('button');
  skipBtn.style.cssText = `
    background:#e50914;color:#fff;border:none;padding:8px 20px;
    font-size:13px;font-weight:700;border-radius:5px;cursor:pointer;opacity:0.5;
    pointer-events:none;transition:opacity 0.3s;
  `;
  skipBtn.textContent = `Skip in ${skipAfter}s`;

  const countdown = document.createElement('span');
  countdown.style.cssText = 'color:#fff;font-size:13px;margin:0 12px;';
  countdown.textContent = `0:${String(duration).padStart(2,'0')}`;

  bar.append(adLabel, countdown, skipBtn);
  overlay.append(video, bar);
  document.body.appendChild(overlay);

  const close = () => {
    overlay.remove();
    if (typeof onComplete === 'function') onComplete();
  };

  skipBtn.addEventListener('click', close);
  video.addEventListener('ended', close);

  // Skip countdown
  let skipCount = skipAfter;
  const tick = setInterval(() => {
    skipCount--;
    if (skipCount <= 0) {
      clearInterval(tick);
      skipBtn.textContent = 'Skip Ad ▶';
      skipBtn.style.opacity = '1';
      skipBtn.style.pointerEvents = 'auto';
    } else {
      skipBtn.textContent = `Skip in ${skipCount}s`;
    }
  }, 1000);

  // Video time update
  video.addEventListener('timeupdate', () => {
    const rem = Math.max(0, Math.ceil((video.duration || duration) - video.currentTime));
    const m = Math.floor(rem / 60);
    const s = rem % 60;
    countdown.textContent = `${m}:${String(s).padStart(2,'0')}`;
  });
}

/**
 * In-Video banner on pause.
 * When the user pauses the video, fetch the NonLinear VAST banner (image +
 * click-through) and overlay it on the player. Removed on play/close.
 */
export function attachPauseBannerAd(videoEl, container) {
  const vastUrl = AD_CONFIG.MAGSRV_INVIDEO_VAST_URL;
  if (!vastUrl || !videoEl || !container) return;

  let banner = null;
  let loading = false;

  const removeBanner = () => {
    if (banner) { banner.remove(); banner = null; }
  };

  async function showBanner() {
    if (banner || loading) return;
    loading = true;

    let imgUrl = null;
    let clickUrl = null;
    const impressions = [];
    try {
      const res = await fetch(vastUrl);
      const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
      imgUrl = xml.querySelector('NonLinear StaticResource')?.textContent.trim() || null;
      clickUrl = xml.querySelector('NonLinearClickThrough')?.textContent.trim() || null;
      xml.querySelectorAll('Impression').forEach((n) => {
        const u = n.textContent.trim();
        if (u) impressions.push(u);
      });
    } catch (_) {}
    loading = false;

    // The user may have resumed while the ad was loading — don't show it then.
    if (!imgUrl || banner || !videoEl.paused || videoEl.ended || !videoEl.isConnected) return;

    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    banner = document.createElement('div');
    banner.style.cssText = `
      position:absolute;left:50%;bottom:10%;transform:translateX(-50%);
      z-index:20;background:rgba(0,0,0,0.65);padding:4px;border-radius:8px;
      box-shadow:0 10px 30px rgba(0,0,0,0.6);max-width:min(320px,86%);
    `;

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('aria-label', 'Close ad');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      position:absolute;top:-12px;right:-12px;width:26px;height:26px;
      border-radius:50%;border:none;background:#e50914;color:#fff;
      font-size:13px;font-weight:700;cursor:pointer;line-height:26px;padding:0;
    `;
    closeBtn.addEventListener('click', removeBanner);

    const link = document.createElement('a');
    link.href = clickUrl || '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer sponsored';

    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = 'Advertisement';
    img.style.cssText = 'display:block;max-width:100%;height:auto;border-radius:6px;';
    img.addEventListener('error', removeBanner);

    link.appendChild(img);
    banner.append(closeBtn, link);
    container.appendChild(banner);

    impressions.forEach((u) => { try { new Image().src = u; } catch (_) {} });
  }

  videoEl.addEventListener('pause', () => {
    // Skip pauses caused by seeking or the video finishing.
    if (videoEl.ended || videoEl.seeking) return;
    showBanner();
  });
  videoEl.addEventListener('play', removeBanner);
  videoEl.addEventListener('ended', removeBanner);
}

/**
 * Show modal ad popup (like PornXnow style)
 * @param {Object} config - Ad configuration
 * @param {string} config.imageUrl - URL of ad image
 * @param {string} config.title - Ad title/text
 * @param {string} config.okUrl - URL to redirect on OK click
 * @param {function} config.onClose - Optional callback on Cancel
 */
export function showModalAd(config = {}) {
  const {
    imageUrl = 'https://via.placeholder.com/300x300?text=Ad',
    title = 'Special Offer',
    okUrl = '#',
    onClose = null
  } = config;

  // Create backdrop overlay
  const backdrop = document.createElement('div');
  backdrop.id = 'ad-modal-backdrop';
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    animation: fadeIn 0.3s ease-in;
  `;

  // Create modal card
  const modal = document.createElement('div');
  modal.style.cssText = `
    background: #fff;
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    max-width: 420px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.3s ease-out;
  `;

  // Add image
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = title;
  img.style.cssText = `
    width: 100%;
    height: auto;
    max-height: 300px;
    border-radius: 8px;
    margin-bottom: 20px;
    object-fit: cover;
  `;
  modal.appendChild(img);

  // Add title
  const titleEl = document.createElement('h2');
  titleEl.textContent = title;
  titleEl.style.cssText = `
    font-size: 22px;
    font-weight: bold;
    color: #333;
    margin: 0 0 20px 0;
    text-transform: uppercase;
  `;
  modal.appendChild(titleEl);

  // Create button container
  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = `
    display: flex;
    gap: 10px;
    justify-content: center;
  `;

  // OK Button
  const okBtn = document.createElement('button');
  okBtn.textContent = 'OK';
  okBtn.style.cssText = `
    flex: 1;
    padding: 12px 20px;
    background: #2196F3;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
  `;
  okBtn.onmouseover = () => okBtn.style.background = '#1976D2';
  okBtn.onmouseout = () => okBtn.style.background = '#2196F3';
  okBtn.addEventListener('click', () => {
    backdrop.remove();
    if (okUrl && okUrl !== '#') {
      window.open(okUrl, '_blank');
    }
  });
  btnContainer.appendChild(okBtn);

  // Cancel Button
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.cssText = `
    flex: 1;
    padding: 12px 20px;
    background: #f44336;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
  `;
  cancelBtn.onmouseover = () => cancelBtn.style.background = '#da190b';
  cancelBtn.onmouseout = () => cancelBtn.style.background = '#f44336';
  cancelBtn.addEventListener('click', () => {
    backdrop.remove();
    if (onClose) onClose();
  });
  btnContainer.appendChild(cancelBtn);

  modal.appendChild(btnContainer);
  backdrop.appendChild(modal);

  // Add CSS animations
  if (!document.querySelector('style[data-ad-modal]')) {
    const style = document.createElement('style');
    style.setAttribute('data-ad-modal', 'true');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { 
          transform: translateY(50px);
          opacity: 0;
        }
        to { 
          transform: translateY(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(backdrop);
  return backdrop;
}
