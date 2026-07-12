"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { watchPageHref } from "../lib/site-data.js";
import { fillMiniPosterSlot } from "../lib/video-poster.js";

function MiniItem({ offer: o }) {
  const thumbRef = useRef(null);
  useEffect(() => {
    if (!thumbRef.current) return undefined;
    return fillMiniPosterSlot(thumbRef.current, String(o.video_url || ""), String(o.poster_url || "").trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o.id]);

  return (
    <Link className="watch-mini" href={watchPageHref(o)}>
      <div className="watch-mini__thumb" ref={thumbRef} />
      <span className="watch-mini__title">{o.title}</span>
    </Link>
  );
}

export default function WatchSidebarList({ items }) {
  return (
    <div id="watch-sidebar-list" className="watch-sidebar__list">
      {items.map((o) => (
        <MiniItem key={o.id} offer={o} />
      ))}
    </div>
  );
}
