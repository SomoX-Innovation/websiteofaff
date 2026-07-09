"use client";

import { useEffect, useRef, useState } from "react";
import { renderPdfCover } from "../lib/pdf-poster.js";

/**
 * Lazily renders the PDF's first page as a cover <img> once the element
 * scrolls near the viewport. Shows the placeholder until (or if) that fails.
 */
export default function PdfCoverImage({ pdfUrl, imgClassName, placeholderClassName, placeholderText = "PDF" }) {
  const hostRef = useRef(null);
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const node = hostRef.current;
    if (!node || !pdfUrl) return undefined;
    let cancelled = false;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        renderPdfCover(pdfUrl).then((url) => {
          if (!cancelled && url) setSrc(url);
        });
      },
      { rootMargin: "220px", threshold: 0.01 }
    );
    io.observe(node);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [pdfUrl]);

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={imgClassName} src={src} alt="" aria-hidden="true" loading="lazy" />;
  }

  return (
    <div ref={hostRef} className={placeholderClassName} aria-hidden="true">
      {placeholderText}
    </div>
  );
}
