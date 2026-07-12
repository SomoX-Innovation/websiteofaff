import { notFound } from "next/navigation";
import { fetchPublicCatalog, findOfferBySlugOrId, pseudoViewsFromId, watchPageHref } from "../../../src/lib/site-data.js";
import AgeGate from "../../../src/components/AgeGate.jsx";
import TubeHeader from "../../../src/components/TubeHeader.jsx";
import TubeFooter from "../../../src/components/TubeFooter.jsx";
import PageChrome from "../../../src/components/PageChrome.jsx";
import VideoCard from "../../../src/components/VideoCard.jsx";
import WatchPlayer from "../../../src/components/WatchPlayer.jsx";
import WatchSidebarList from "../../../src/components/WatchSidebarList.jsx";
import AffiliateCta from "../../../src/components/AffiliateCta.jsx";
import AdSlot from "../../../src/components/AdSlot.jsx";

export const dynamic = "force-dynamic";

async function loadOffer(slug) {
  const { settings, offers } = await fetchPublicCatalog();
  const brand = settings.site_name || "WellwetX";
  const current = findOfferBySlugOrId(offers, slug);
  return { brand, current, offers };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { brand, current } = await loadOffer(slug);

  if (!current) {
    return { title: `Not found — ${brand}`, robots: "noindex, follow" };
  }

  const pageTitle = String(current.meta_title || current.title || "").trim() || "Video";
  const desc =
    String(current.meta_description || current.description || "").trim() || `${pageTitle} — ${brand}`;
  const canonical = `https://wellwetx.com${watchPageHref(current)}`;

  return {
    title: `${pageTitle} — ${brand}`,
    description: desc.slice(0, 320),
    alternates: { canonical },
    openGraph: {
      type: "video.other",
      title: pageTitle.slice(0, 200),
      description: desc.slice(0, 300),
      url: canonical,
      locale: "en_US",
    },
  };
}

export default async function WatchPage({ params }) {
  const { slug } = await params;
  const { brand, current, offers } = await loadOffer(slug);

  if (!current) {
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
              <span>Not found</span>
            </nav>
            <section className="watch-single">
              <header className="watch-head">
                <h1 className="watch-head__title">Video not found</h1>
              </header>
              <p className="watch-desc">This clip is unavailable or was removed.</p>
            </section>
            <section className="watch-related-block">
              <h2 className="watch-related-block__h">Related videos</h2>
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

  const currentSeries = String(current.series || "").trim();
  const rest = offers.filter((o) => String(o.id) !== String(current.id));
  const sameSeries = currentSeries
    ? rest
        .filter((o) => String(o.series || "").trim() === currentSeries)
        .sort((a, b) => (a.episode ?? 0) - (b.episode ?? 0))
    : [];
  const unrelated = rest.filter((o) => String(o.series || "").trim() !== currentSeries);
  // Sidebar still leads with series episodes (capped) so they're visible without
  // scrolling; the dedicated section below shows every episode, uncapped.
  const sidebarItems = [...sameSeries, ...unrelated].slice(0, 10);
  const gridItems = unrelated.slice(0, 12);
  const views = pseudoViewsFromId(current.id).toLocaleString();
  const cat = String(current.category || "").trim();
  const tags = String(current.tags || "")
    .split(/[,;]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 28);
  const href = String(current.href || "").trim();
  const description = String(current.description || "").trim();
  const crumbTitle = current.title.length > 48 ? `${current.title.slice(0, 45)}…` : current.title;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://wellwetx.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: current.title,
        item: `https://wellwetx.com${watchPageHref(current)}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageChrome />
      <AgeGate />
      <a className="skip-link" href="#watch-content">
        Skip to content
      </a>
      <TubeHeader searchInputId="tube-search-input-watch" />
      <main id="main" className="tube-main-outer">
        <div className="wrap-tube">
          <AdSlot variant="leaderboard" zoneClass="eas6a97888e35" zoneId="5972168" keywords="keywords" sub="123450000" />
        </div>

        <div className="wrap-tube watch-page" id="watch-content">
          <nav className="watch-crumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="watch-crumb__sep" aria-hidden="true">
              /
            </span>
            <span id="watch-crumb-current">{crumbTitle}</span>
          </nav>

          <section className="watch-single" aria-labelledby="watch-title">
            <header className="watch-head">
              <h1 className="watch-head__title" id="watch-title">
                {current.title}
              </h1>
              {cat || tags.length ? (
                <div className="watch-head__tags" id="watch-tags">
                  {cat ? <span className="watch-chip watch-chip--cat">{cat}</span> : null}
                  {tags.map((t) => (
                    <span key={t} className="watch-chip watch-chip--tag">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="watch-head__meta" id="watch-meta">
                <span className="watch-chip watch-chip--tag">HD</span>
                <span className="watch-chip watch-chip--tag">Streaming</span>
                <a className="watch-chip watch-chip--cat" href="/">
                  More at {brand}
                </a>
              </div>
            </header>

            <div className="watch-layout">
              <div className="watch-layout__main">
                <WatchPlayer videoUrl={current.video_url} posterUrl={current.poster_url} />

                <div id="affiliate-cta-container">
                  <AffiliateCta />
                </div>

                <div className="watch-stats" id="watch-stats">
                  <span className="watch-stats__views">
                    <span className="watch-stats__num" id="watch-views">
                      {views}
                    </span>{" "}
                    views
                  </span>
                </div>

                <div className="watch-toolbar" id="watch-toolbar">
                  {href ? (
                    <a className="btn btn--primary watch-toolbar__cta" href={href} rel="noopener noreferrer" target="_blank">
                      Open partner link
                    </a>
                  ) : null}
                </div>

                <AdSlot variant="rect" zoneClass="eas6a97888e35" zoneId="5972168" keywords="keywords" sub="123450000" />

                {description ? (
                  <p className="watch-desc" id="watch-desc">
                    {description}
                  </p>
                ) : null}

                <AdSlot variant="leaderboard" zoneClass="eas6a97888e35" zoneId="5972168" keywords="keywords" sub="123450000" />
              </div>

              <aside className="watch-sidebar" aria-labelledby="watch-sidebar-title">
                <AdSlot variant="sidebar" zoneClass="eas6a97888e35" zoneId="5972168" />

                <h2 id="watch-sidebar-title" className="watch-sidebar__h">
                  More videos
                </h2>
                <WatchSidebarList items={sidebarItems} />

                <AdSlot variant="rect" zoneClass="eas6a97888e35" zoneId="5972168" keywords="keywords" sub="123450000" />

                <a href="/" className="watch-sidebar__all">
                  Browse all videos
                </a>
              </aside>
            </div>
          </section>

          {currentSeries && sameSeries.length ? (
            <section className="watch-related-block" aria-labelledby="watch-series-heading">
              <h2 id="watch-series-heading" className="watch-related-block__h">
                More from “{currentSeries}”
              </h2>
              <div className="video-grid video-grid--tube watch-related-block__grid" role="list">
                {sameSeries.map((o) => (
                  <VideoCard key={o.id} offer={o} />
                ))}
              </div>
            </section>
          ) : null}

          <section className="watch-related-block" aria-labelledby="watch-related-heading">
            <h2 id="watch-related-heading" className="watch-related-block__h">
              Related videos
            </h2>
            <div id="watch-related-grid" className="video-grid video-grid--tube watch-related-block__grid" role="list">
              {gridItems.map((o) => (
                <VideoCard key={o.id} offer={o} />
              ))}
            </div>

            <AdSlot variant="leaderboard" zoneClass="eas6a97888e35" zoneId="5972168" label="Recommended" />
          </section>
        </div>
      </main>
      <TubeFooter />
    </>
  );
}
