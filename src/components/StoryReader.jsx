"use client";

import { useEffect, useState } from "react";
import { showPopupAdOverlay } from "../lib/ad-manager.js";
import { renderPdfCover } from "../lib/pdf-poster.js";

/**
 * PDF reader with the same ad gate as the video player:
 * cover + Read button -> interstitial ad -> embedded PDF.
 */
export default function StoryReader({ pdfUrl, coverUrl, title }) {
  const [reading, setReading] = useState(false);
  const [useAltViewer, setUseAltViewer] = useState(false);
  const [autoCover, setAutoCover] = useState(null);

  // No explicit cover: render the PDF's first page as the gate backdrop.
  useEffect(() => {
    if (coverUrl || !pdfUrl) return undefined;
    let cancelled = false;
    renderPdfCover(pdfUrl, 720).then((url) => {
      if (!cancelled && url) setAutoCover(url);
    });
    return () => {
      cancelled = true;
    };
  }, [pdfUrl, coverUrl]);

  const effectiveCover = coverUrl || autoCover;

  function handleReadClick() {
    showPopupAdOverlay(8, () => setReading(true));
  }

  // Some external hosts block iframe embedding or force a download; the
  // Google Docs viewer renders those PDFs inline instead.
  const frameSrc = useAltViewer
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`
    : `${pdfUrl}#toolbar=0&navpanes=0`;

  if (!reading) {
    return (
      <div className="story-reader story-reader--gate">
        {effectiveCover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="story-reader__cover" src={effectiveCover} alt="" aria-hidden="true" />
        ) : null}
        <button type="button" className="btn btn--primary story-reader__read-btn" onClick={handleReadClick}>
          📖 Read Now — Free
        </button>
      </div>
    );
  }

  return (
    <div className="story-reader">
      <iframe key={frameSrc} className="story-reader__frame" src={frameSrc} title={title || "PDF story"} />
      <div className="story-reader__actions">
        <a className="btn btn--primary" href={pdfUrl} target="_blank" rel="noopener noreferrer">
          Open fullscreen ↗
        </a>
        <a className="btn btn--ghost" href={pdfUrl} download>
          Download PDF
        </a>
        {!useAltViewer ? (
          <button type="button" className="btn btn--ghost" onClick={() => setUseAltViewer(true)}>
            Not loading? Try alternate viewer
          </button>
        ) : null}
      </div>
      <p className="story-reader__hint">
        On some phones the preview shows only the first page — use <strong>Open fullscreen</strong> to read the whole
        PDF.
      </p>
    </div>
  );
}
