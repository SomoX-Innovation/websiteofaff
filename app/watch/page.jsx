import { redirect } from "next/navigation";
import { fetchPublicCatalog, findOfferBySlugOrId, watchPageHref } from "../../src/lib/site-data.js";
import AgeGate from "../../src/components/AgeGate.jsx";
import TubeHeader from "../../src/components/TubeHeader.jsx";
import TubeFooter from "../../src/components/TubeFooter.jsx";
import PageChrome from "../../src/components/PageChrome.jsx";
import VideoCard from "../../src/components/VideoCard.jsx";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Watch Videos - WellwetX | Premium Video Streaming",
  description:
    "Watch premium adult videos on WellwetX. Stream high-quality content with availability in UK, USA, Canada, India, and Sri Lanka.",
  alternates: { canonical: "https://wellwetx.com/watch" },
};

/** Handles legacy ?v=uuid / ?s=slug query links by redirecting to the canonical /watch/[slug] route. */
export default async function WatchIndexPage({ searchParams }) {
  const sp = await searchParams;
  const v = String(sp?.v || "").trim();
  const s = String(sp?.s || "").trim();

  if (v || s) {
    const { offers } = await fetchPublicCatalog();
    const wanted = v ? `id-${v}` : s;
    const offer = findOfferBySlugOrId(offers, wanted);
    if (offer) redirect(watchPageHref(offer));
  }

  const { offers } = await fetchPublicCatalog();
  const others = offers.slice(0, 12);

  return (
    <>
      <PageChrome />
      <AgeGate />
      <a className="skip-link" href="#watch-content">
        Skip to content
      </a>
      <TubeHeader searchInputId="tube-search-input-watch" />
      <main id="main" className="tube-main-outer">
        <div className="wrap-tube watch-page" id="watch-content">
          <nav className="watch-crumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="watch-crumb__sep" aria-hidden="true">
              /
            </span>
            <span>Watch</span>
          </nav>
          <section className="watch-single">
            <header className="watch-head">
              <h1 className="watch-head__title">Pick a video</h1>
            </header>
            <p className="watch-desc">Open a clip from the home page to watch it here.</p>
          </section>
          <section className="watch-related-block">
            <h2 className="watch-related-block__h">Videos</h2>
            <div className="video-grid video-grid--tube watch-related-block__grid" role="list">
              {others.map((o) => (
                <VideoCard key={o.id} offer={o} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <TubeFooter />
    </>
  );
}
