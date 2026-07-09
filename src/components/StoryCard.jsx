import Link from "next/link";
import { storyPageHref } from "../lib/story-data.js";
import PdfCoverImage from "./PdfCoverImage.jsx";

/** Grid card linking to a PDF story page (comic-style portrait cover). */
export default function StoryCard({ story: s }) {
  const href = storyPageHref(s);
  const cover = String(s.cover_url || "").trim();
  const series = String(s.series || "").trim();
  const epLabel = s.episode != null && s.episode !== "" ? `Episode ${s.episode}` : "";

  return (
    <article className="story-card" role="listitem">
      <Link className="story-card__cover-link" href={href} aria-label={`Read: ${s.title}`}>
        <div className="story-card__cover">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="story-card__cover-img" src={cover} alt="" loading="lazy" />
          ) : (
            <PdfCoverImage
              pdfUrl={s.pdf_url}
              imgClassName="story-card__cover-img"
              placeholderClassName="story-card__cover-fallback"
            />
          )}
          <span className="story-card__badge" aria-hidden="true">
            PDF
          </span>
          {s.pages ? (
            <span className="story-card__pages" aria-hidden="true">
              {s.pages} pages
            </span>
          ) : null}
        </div>
      </Link>
      <div className="story-card__body">
        <Link className="story-card__title-link" href={href}>
          <h3 className="story-card__title">{s.title}</h3>
        </Link>
        <p className="story-card__meta">
          {series ? <span className="story-card__series">{series}</span> : null}
          {epLabel ? <span className="story-card__episode">{epLabel}</span> : null}
        </p>
      </div>
    </article>
  );
}
