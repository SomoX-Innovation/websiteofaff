"use client";

import AdZoneScript from "./AdZoneScript.jsx";

export default function StickyAdBar() {
  return (
    <div className="ad-sticky-bottom" id="ad-sticky-bottom">
      <ins className="eas5900606" data-zoneid="5900606" data-keywords="adult" data-block-ad-types="0" />
      <AdZoneScript />
      <button
        className="ad-sticky-bottom__close"
        onClick={(e) => e.currentTarget.closest("#ad-sticky-bottom")?.remove()}
      >
        ✕
      </button>
    </div>
  );
}
