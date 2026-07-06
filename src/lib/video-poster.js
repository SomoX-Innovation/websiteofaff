import { getGoogleDriveFileIdFromUrl, parseVideoUrl } from "./video-embed.js";
import { getPublicStorageUrl } from "./supabase.js";
/** Normalize a poster URL - skip Google Drive URLs (they have CORS issues). */
export function normalizePosterUrl(url) {
  const input = String(url || "").trim();
  if (!input) return null;

  // Google Drive view/share links cannot be used as <img> src (CORS-blocked by Google).
  // Return null so the fallback/placeholder path kicks in instead.
  const driveId = getGoogleDriveFileIdFromUrl(input);
  if (driveId) return null;

  // Return other URLs as-is
  if (input.startsWith("http")) {
    return input;
  }

  return null;
}
/** @deprecated Google Drive thumbnail URLs are CORS-blocked for <img> embedding. Use Supabase Storage instead. */
export function syncGoogleDrivePosterUrl(videoUrl) {
  const id = getGoogleDriveFileIdFromUrl(videoUrl);
  if (!id) return null;
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w640`;
}

/** YouTube still image (no API key). */
export function syncYoutubePosterUrl(videoUrl) {
  const parsed = parseVideoUrl(videoUrl);
  if (!parsed || parsed.kind !== "iframe") return null;
  const m = parsed.src.match(/youtube\.com\/embed\/([^/?]+)/);
  if (!m) return null;
  const id = decodeURIComponent(m[1]);
  if (!id) return null;
  return `https://img.youtube.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
}

async function fetchVimeoThumbnail(videoId) {
  try {
    const page = `https://vimeo.com/${videoId}`;
    const r = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(page)}`);
    if (!r.ok) return null;
    const j = await r.json();
    return typeof j.thumbnail_url === "string" ? j.thumbnail_url : null;
  } catch {
    return null;
  }
}

/**
 * Grab a frame from a direct video file (MP4/WebM). Fails if the host does not
 * send CORS headers (canvas stays tainted).
 */
export function captureVideoFrameObjectUrl(videoSrc) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.preload = "auto";
    video.crossOrigin = "anonymous";

    const done = (url) => {
      video.removeAttribute("src");
      video.load();
      video.remove();
      resolve(url);
    };

    const failTimer = window.setTimeout(() => done(null), 18_000);

    const fail = () => {
      window.clearTimeout(failTimer);
      done(null);
    };

    video.addEventListener("error", fail, { once: true });

    video.addEventListener(
      "loadeddata",
      () => {
        try {
          const dur = video.duration;
          const t = Number.isFinite(dur) && dur > 0 ? Math.min(0.35, dur * 0.08) : 0;
          video.currentTime = t;
        } catch {
          fail();
        }
      },
      { once: true }
    );

    video.addEventListener(
      "seeked",
      () => {
        try {
          const w = video.videoWidth;
          const h = video.videoHeight;
          if (!w || !h) {
            fail();
            return;
          }
          const maxW = 720;
          const scale = w > maxW ? maxW / w : 1;
          const cw = Math.round(w * scale);
          const ch = Math.round(h * scale);
          const canvas = document.createElement("canvas");
          canvas.width = cw;
          canvas.height = ch;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, cw, ch);
          canvas.toBlob(
            (blob) => {
              window.clearTimeout(failTimer);
              if (!blob) {
                done(null);
                return;
              }
              done(URL.createObjectURL(blob));
            },
            "image/jpeg",
            0.82
          );
        } catch {
          fail();
        }
      },
      { once: true }
    );

    video.src = videoSrc;
  });
}

/** Async poster: Vimeo oEmbed or direct-video frame capture. */
export async function asyncAutoPosterUrl(videoUrl) {
  const parsed = parseVideoUrl(videoUrl);
  if (!parsed) return null;
  if (parsed.kind === "iframe") {
    const vm = parsed.src.match(/vimeo\.com\/video\/(\d+)/);
    if (vm) {
      const t = await fetchVimeoThumbnail(vm[1]);
      if (t) return t;
    }
    return null;
  }
  return captureVideoFrameObjectUrl(parsed.src);
}

/** Final poster URL for player `poster` or `<img src>` (await for capture / Vimeo). */
export async function resolveAutoPoster(videoUrl, explicitPoster) {
  const ep = String(explicitPoster || "").trim();
  if (ep) return ep;
  
  // YouTube has reliable cross-origin image access
  const yt = syncYoutubePosterUrl(videoUrl);
  if (yt) return yt;
  
  return (await asyncAutoPosterUrl(videoUrl)) || null;
}

const IO_OPTS = { rootMargin: "180px", threshold: 0.01 };

function observeWhenConnected(io, target) {
  let attempts = 0;
  const run = () => {
    if (target.isConnected) {
      io.observe(target);
      return;
    }
    if (++attempts > 120) return;
    requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

/**
 * Populate a card/sidebar poster area: explicit URL, YouTube thumb, or lazy async frame/Vimeo.
 * @param {HTMLElement} posterWrap - receives img or fallback first; caller adds overlays after.
 * @param {HTMLElement} ioRoot - usually the card row (for IntersectionObserver)
 */
export function fillPosterSlot(posterWrap, videoUrl, explicitPoster, ioRoot) {
  const ep = String(explicitPoster || "").trim();
  const addImg = (src) => {
    const normalizedSrc = normalizePosterUrl(src);
    if (normalizedSrc === null) {
      return false;
    }
    const finalUrl = getPublicStorageUrl(normalizedSrc) || normalizedSrc;
    const img = document.createElement("img");
    img.className = "video-card__poster-img";
    img.src = finalUrl;
    img.alt = "";
    img.loading = "lazy";
    
    img.addEventListener("error", (e) => {
      console.warn("✗ Poster slot failed:", finalUrl, e);
    });
    
    posterWrap.insertBefore(img, posterWrap.firstChild);
    return true;
  };

  if (ep) {
    if (addImg(ep)) {
      return;
    }
  }

  const yt = syncYoutubePosterUrl(videoUrl);
  if (yt) {
    addImg(yt);
    return;
  }

  const ph = document.createElement("div");
  ph.className = "video-card__poster-fallback";
  ph.setAttribute("aria-hidden", "true");
  posterWrap.insertBefore(ph, posterWrap.firstChild);

  const root =
    ioRoot || posterWrap.closest(".video-card") || posterWrap.closest(".watch-mini") || posterWrap;
  const io = new IntersectionObserver((entries) => {
    if (!entries[0]?.isIntersecting) return;
    io.disconnect();
    void asyncAutoPosterUrl(videoUrl).then((url) => {
      if (!url || !posterWrap.isConnected) return;
      const finalUrl = getPublicStorageUrl(url) || url;
      const img = document.createElement("img");
      img.className = "video-card__poster-img";
      img.src = finalUrl;
      img.alt = "";
      img.loading = "lazy";
      ph.replaceWith(img);
    });
  }, IO_OPTS);
  observeWhenConnected(io, root);
}

/**
 * Mini sidebar thumb: same logic, classes for watch-mini layout.
 */
export function fillMiniPosterSlot(thumbMount, videoUrl, explicitPoster, ioRoot) {
  const ep = String(explicitPoster || "").trim();
  const addImg = (src) => {
    const normalizedSrc = normalizePosterUrl(src);
    if (normalizedSrc === null) {
      return false;
    }
    const finalUrl = getPublicStorageUrl(normalizedSrc) || normalizedSrc;
    const img = document.createElement("img");
    img.src = finalUrl;
    img.alt = "";
    img.loading = "lazy";
    
    img.addEventListener("error", (e) => {
      console.warn("✗ Mini poster failed:", finalUrl, e);
    });
    
    thumbMount.appendChild(img);
    return true;
  };

  if (ep) {
    if (addImg(ep)) {
      return;
    }
  }

  const yt = syncYoutubePosterUrl(videoUrl);
  if (yt) {
    addImg(yt);
    return;
  }

  const ph = document.createElement("div");
  ph.className = "watch-mini__thumb-fallback";
  ph.setAttribute("aria-hidden", "true");
  thumbMount.appendChild(ph);

  const root = ioRoot || thumbMount.closest(".watch-mini") || thumbMount;
  const io = new IntersectionObserver((entries) => {
    if (!entries[0]?.isIntersecting) return;
    io.disconnect();
    void asyncAutoPosterUrl(videoUrl).then((url) => {
      if (!url || !thumbMount.isConnected) return;
      const finalUrl = getPublicStorageUrl(url) || url;
      const img = document.createElement("img");
      img.src = finalUrl;
      img.alt = "";
      img.loading = "lazy";
      ph.replaceWith(img);
    });
  }, IO_OPTS);
  observeWhenConnected(io, root);
}
