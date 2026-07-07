"use client";

import { useEffect, useRef, useState } from "react";
import { mountPosterPlaceholder, mountVideoMedia, parseVideoUrl } from "../lib/video-embed.js";
import { resolveAutoPoster } from "../lib/video-poster.js";
import { attachPauseBannerAd, showPopupAdOverlay, showVastPreroll } from "../lib/ad-manager.js";

/** Mounts the ad sequence (VAST preroll -> 3-step interstitial) then the real player, matching the original watch page flow. */
export default function WatchPlayer({ videoUrl, posterUrl }) {
  const frameRef = useRef(null);
  const [showFakeBtn, setShowFakeBtn] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Show poster only until user clicks fake play button, matching original UX.
    resolveAutoPoster(String(videoUrl || ""), posterUrl).then((poster) => {
      if (cancelled || !frameRef.current) return;
      mountPosterPlaceholder(frameRef.current, poster || undefined);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl, posterUrl]);

  function handlePlayClick() {
    setShowFakeBtn(false);
    let cancelled = false;
    const parsed = parseVideoUrl(videoUrl);
    resolveAutoPoster(String(videoUrl || ""), posterUrl).then((effectivePoster) => {
      if (cancelled) return;
      showVastPreroll(() => {
        showPopupAdOverlay(8, () => {
          if (!frameRef.current) return;
          mountVideoMedia(frameRef.current, parsed, effectivePoster || undefined);
          // In-video banner ad on pause (only possible for direct <video> files,
          // not cross-origin iframes like YouTube/Drive).
          const videoEl = frameRef.current.querySelector("video");
          if (videoEl) attachPauseBannerAd(videoEl, frameRef.current);
        });
      });
    });
  }

  return (
    <div className="watch-player-shell">
      <div id="watch-player-frame" className="watch-player__frame video-card__frame" ref={frameRef} />
      {showFakeBtn ? (
        <div className="fake-play-btn" role="button" aria-label="Play" title="Play" onClick={handlePlayClick} />
      ) : null}
    </div>
  );
}
