import { Fragment } from "react";
import { fetchPublicCatalog } from "../../src/lib/site-data.js";
import { fetchStories } from "../../src/lib/story-data.js";
import AgeGate from "../../src/components/AgeGate.jsx";
import TubeHeader from "../../src/components/TubeHeader.jsx";
import TubeFooter from "../../src/components/TubeFooter.jsx";
import PageChrome from "../../src/components/PageChrome.jsx";
import StoryCard from "../../src/components/StoryCard.jsx";
import AdSlot from "../../src/components/AdSlot.jsx";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await fetchPublicCatalog();
  const brand = settings.site_name || "WellwetX";
  return {
    title: `Sex Comics & PDF Stories — ${brand}`,
    description: `Read adult comic series and erotic PDF stories online, episode by episode, free at ${brand}.`,
    alternates: { canonical: "https://wellwetx.com/stories" },
  };
}

export default async function StoriesPage() {
  const [{ settings }, { stories }] = await Promise.all([fetchPublicCatalog(), fetchStories()]);
  const brand = settings.site_name || "WellwetX";

  // Group by series so episodic comics read like a series shelf.
  const bySeries = new Map();
  for (const s of stories) {
    const key = String(s.series || "").trim() || "More stories";
    if (!bySeries.has(key)) bySeries.set(key, []);
    bySeries.get(key).push(s);
  }

  return (
    <>
      <PageChrome />
      <AgeGate />
      <a className="skip-link" href="#stories-content">
        Skip to content
      </a>
      <TubeHeader searchInputId="tube-search-input-stories" />
      <main id="main" className="tube-main-outer">
        <div className="wrap-tube">
          <AdSlot variant="leaderboard" zoneClass="eas6a97888e35" zoneId="5972168" keywords="keywords" sub="123450000" />
        </div>

        <div className="wrap-tube stories-page" id="stories-content">
          <header className="stories-head">
            <h1 className="stories-head__title">Sex Comics &amp; PDF Stories</h1>
            <p className="stories-head__lead">
              Adult comic series and erotic stories in PDF — read online or download, new episodes added at {brand}.
            </p>
          </header>

          <AdSlot variant="banner" zoneClass="eas6a97888e35" zoneId="5972168" keywords="keywords" sub="123450000" />

          {stories.length === 0 ? (
            <p className="stories-empty">No stories published yet — check back soon.</p>
          ) : (
            [...bySeries.entries()].map(([series, items], i) => (
              <Fragment key={series}>
                {i > 0 && i % 3 === 0 ? (
                  <AdSlot variant="rect" zoneClass="eas6a97888e35" zoneId="5972168" keywords="keywords" sub="123450000" />
                ) : null}
                <section className="stories-series" aria-label={series}>
                  <h2 className="stories-series__h">{series}</h2>
                  <div className="story-grid" role="list">
                    {items.map((s) => (
                      <StoryCard key={s.id} story={s} />
                    ))}
                  </div>
                </section>
              </Fragment>
            ))
          )}

          <AdSlot variant="leaderboard" zoneClass="eas6a97888e35" zoneId="5972168" label="Recommended" />
        </div>
      </main>
      <TubeFooter />
    </>
  );
}
