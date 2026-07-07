/**
 * Map a user-provided URL to either an iframe embed (YouTube/Vimeo/Google Drive) or a direct <video> source.
 */

/** @param {string} raw */
export function getGoogleDriveFileIdFromUrl(raw) {
  try {
    const u = new URL(String(raw || "").trim());
    const host = u.hostname.replace(/^www\./, "");
    if (host !== "drive.google.com") return null;
    const fromPath = u.pathname.match(/\/file\/d\/([^/]+)/);
    if (fromPath?.[1]) return fromPath[1];
    const id = u.searchParams.get("id");
    return id || null;
  } catch {
    return null;
  }
}

export function parseVideoUrl(raw) {
  const url = String(raw || "").trim();
  if (!url) return null;

  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const v = u.searchParams.get("v");
      if (v)
        return {
          kind: "iframe",
          src: `https://www.youtube.com/embed/${encodeURIComponent(v)}`,
          title: "YouTube video",
        };
      const embed = u.pathname.match(/^\/embed\/([^/?]+)/);
      if (embed)
        return {
          kind: "iframe",
          src: `https://www.youtube.com/embed/${encodeURIComponent(embed[1])}`,
          title: "YouTube video",
        };
    }

    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      if (id)
        return {
          kind: "iframe",
          src: `https://www.youtube.com/embed/${encodeURIComponent(id)}`,
          title: "YouTube video",
        };
    }

    if (host === "vimeo.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      const id = parts[0];
      if (id && /^\d+$/.test(id))
        return {
          kind: "iframe",
          src: `https://player.vimeo.com/video/${id}`,
          title: "Vimeo video",
        };
    }

    if (host === "player.vimeo.com") {
      const m = u.pathname.match(/\/video\/(\d+)/);
      if (m)
        return {
          kind: "iframe",
          src: `https://player.vimeo.com/video/${m[1]}`,
          title: "Vimeo video",
        };
    }

    const driveId = getGoogleDriveFileIdFromUrl(url);
    if (driveId)
      return {
        kind: "iframe",
        src: `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/preview`,
        title: "Google Drive video",
      };

    // Direct media files are fine to load via <video>
    if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(u.pathname)) {
      return { kind: "video", src: url };
    }

    // Any other http(s) URL pointing at a third-party site (xHamster, PornHub, etc.)
    // cannot be embedded via <video> due to CORS — show a link-out card.
    return { kind: "unsupported", href: url };
  } catch {
    return null;
  }
}

/** Pre-play state: show only the poster (or a black placeholder) without judging the video URL. */
export function mountPosterPlaceholder(container, posterUrl) {
  container.replaceChildren();
  const wrap = document.createElement("div");
  wrap.style.cssText = "position:relative;width:100%;height:100%;display:block;background:#000;";
  if (posterUrl) {
    const img = document.createElement("img");
    img.className = "video-card__poster-bg";
    img.src = posterUrl;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.addEventListener("error", () => { img.style.display = "none"; });
    wrap.appendChild(img);
  }
  container.appendChild(wrap);
}

export function mountVideoMedia(container, parsed, posterUrl) {
  container.replaceChildren();
  if (!parsed) {
    const p = document.createElement("p");
    p.className = "video-card__bad-url";
    p.textContent = "Invalid or unsupported video URL.";
    container.appendChild(p);
    return;
  }

  if (parsed.kind === "unsupported") {
    const wrap = document.createElement("div");
    wrap.className = "video-card__unsupported";
    const msg = document.createElement("p");
    msg.textContent = "This video cannot be embedded. ";
    const a = document.createElement("a");
    a.href = parsed.href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "Watch on source site →";
    msg.appendChild(a);
    wrap.appendChild(msg);
    container.appendChild(wrap);
    return;
  }

  if (parsed.kind === "iframe") {
    const iframeWrap = document.createElement("div");
    iframeWrap.style.cssText = "position:relative;width:100%;height:100%;display:block;";

    if (posterUrl) {
      const img = document.createElement("img");
      img.className = "video-card__poster-bg";
      img.src = posterUrl;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.addEventListener("error", () => { img.style.display = "none"; });
      iframeWrap.appendChild(img);
    }

    const iframe = document.createElement("iframe");
    iframe.className = "video-card__iframe";
    iframe.src = parsed.src;
    iframe.title = parsed.title || "Video";
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    iframe.setAttribute("allowfullscreen", "");
    iframe.style.cssText = "width:100%;height:100%;border:0;display:block;";
    iframeWrap.appendChild(iframe);

    // Hide Google Drive "open in new tab" button
    if (parsed.title === "Google Drive video") {
      const blocker = document.createElement("div");
      blocker.setAttribute("aria-hidden", "true");
      blocker.style.cssText = "position:absolute;top:0;right:0;width:60px;height:50px;background:#000;z-index:10;cursor:default;";
      iframeWrap.appendChild(blocker);
    }

    container.appendChild(iframeWrap);
    return;
  }

  const video = document.createElement("video");
  video.className = "video-card__video";
  video.controls = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.preload = "metadata";
  video.muted = true;
  video.style.cssText = "width:100%;height:100%;object-fit:contain;background:#000;display:block;";
  if (posterUrl) video.poster = posterUrl;
  const source = document.createElement("source");
  source.src = parsed.src;
  // Add type hint for better mobile codec detection
  if (/\.mp4(\?|$)/i.test(parsed.src)) source.type = "video/mp4";
  else if (/\.webm(\?|$)/i.test(parsed.src)) source.type = "video/webm";
  else if (/\.ogg(\?|$)/i.test(parsed.src)) source.type = "video/ogg";
  video.appendChild(source);
  container.appendChild(video);
}
