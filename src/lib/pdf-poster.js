/**
 * Render the first page of a PDF as a JPEG object URL — used as an automatic
 * story cover when no explicit cover_url is set. Browser-only (pdf.js).
 * Requires the PDF host to send CORS headers; fails gracefully otherwise.
 */

let pdfjsPromise = null;

function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

/** @type {Map<string, Promise<string | null>>} one render per PDF per session */
const coverCache = new Map();

/**
 * @param {string} pdfUrl
 * @param {number} maxWidth target cover width in px
 * @returns {Promise<string | null>} object URL of the rendered page, or null
 */
export function renderPdfCover(pdfUrl, maxWidth = 480) {
  const key = String(pdfUrl || "").trim();
  if (!key || typeof window === "undefined") return Promise.resolve(null);
  if (coverCache.has(key)) return coverCache.get(key);

  const job = (async () => {
    let doc = null;
    try {
      const pdfjs = await loadPdfjs();
      doc = await pdfjs.getDocument({ url: key, disableAutoFetch: true }).promise;
      const page = await doc.getPage(1);
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(2, maxWidth / base.width);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
      return blob ? URL.createObjectURL(blob) : null;
    } catch {
      return null;
    } finally {
      try {
        doc?.destroy();
      } catch {}
    }
  })();

  coverCache.set(key, job);
  return job;
}
