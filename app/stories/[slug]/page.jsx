import { fetchPublicCatalog } from "../../../src/lib/site-data.js";
import { fetchStories, findStoryBySlugOrId, storyPageHref } from "../../../src/lib/story-data.js";
import AgeGate from "../../../src/components/AgeGate.jsx";
import TubeHeader from "../../../src/components/TubeHeader.jsx";
import TubeFooter from "../../../src/components/TubeFooter.jsx";
import PageChrome from "../../../src/components/PageChrome.jsx";
import StoryCard from "../../../src/components/StoryCard.jsx";
import StoryReader from "../../../src/components/StoryReader.jsx";
import AdSlot from "../../../src/components/AdSlot.jsx";

export const dynamic = "force-dynamic";

async function loadStory(slug) {
  const [{ settings }, { stories }] = await Promise.all([fetchPublicCatalog(), fetchStories()]);
  const brand = settings.site_name || "WellwetX";
  const current = findStoryBySlugOrId(stories, slug);
  return { brand, current, stories };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { brand, current } = await loadStory(slug);

  if (!current) {
    return { title: `Not found — ${brand}`, robots: "noindex, follow" };
  }

  const pageTitle = String(current.meta_title || current.title || "").trim() || "Story";
  const desc =
    String(current.meta_description || current.description || "").trim() ||
    `Read ${pageTitle} online free in PDF at ${brand}.`;
  const canonical = `https://wellwetx.com${storyPageHref(current)}`;

  return {
    title: `${pageTitle} — ${brand}`,
    description: desc.slice(0, 320),
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: pageTitle.slice(0, 200),
      description: desc.slice(0, 300),
      url: canonical,
      locale: "en_US",
    },
  };
}

export default async function StoryPage({ params }) {
  const { slug } = await params;
  const { brand, current, stories } = await loadStory(slug);

  if (!current) {
    const others = stories.slice(0, 12);
    return (
      <>
        <PageChrome />
        <AgeGate />
        <TubeHeader searchInputId="tube-search-input-story" />
        <main id="main" className="tube-main-outer">
          <div className="wrap-tube stories-page">
            <nav className="watch-crumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span className="watch-crumb__sep" aria-hidden="true">/</span>
              <a href="/stories">Stories</a>
              <span className="watch-crumb__sep" aria-hidden="true">/</span>
              <span>Not found</span>
            </nav>
            <h1 className="stories-head__title">Story not found</h1>
            <p className="watch-desc">This story is unavailable or was removed.</p>
            {others.length ? (
              <section className="stories-series">
                <h2 className="stories-series__h">More stories</h2>
                <div className="story-grid" role="list">
                  {others.map((s) => (
                    <StoryCard key={s.id} story={s} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </main>
        <TubeFooter />
      </>
    );
  }

  const sameSeries = stories.filter(
    (s) =>
      String(s.id) !== String(current.id) &&
      String(s.series || "").trim() &&
      String(s.series || "").trim() === String(current.series || "").trim()
  );
  const others = stories.filter(
    (s) => String(s.id) !== String(current.id) && !sameSeries.some((x) => String(x.id) === String(s.id))
  );
  const related = [...sameSeries, ...others].slice(0, 12);

  const series = String(current.series || "").trim();
  const tags = String(current.tags || "")
    .split(/[,;]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 28);
  const description = String(current.description || "").trim();
  const crumbTitle = current.title.length > 48 ? `${current.title.slice(0, 45)}…` : current.title;

  return (
    <>
      <PageChrome />
      <AgeGate />
      <a className="skip-link" href="#story-content">
        Skip to content
      </a>
      <TubeHeader searchInputId="tube-search-input-story" />
      <main id="main" className="tube-main-outer">
        <div className="wrap-tube">
          <AdSlot variant="leaderboard" zoneClass="eas6a97888e2" zoneId="5900172" keywords="keywords" sub="123450000" />
        </div>

        <div className="wrap-tube stories-page" id="story-content">
          <nav className="watch-crumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="watch-crumb__sep" aria-hidden="true">/</span>
            <a href="/stories">Stories</a>
            <span className="watch-crumb__sep" aria-hidden="true">/</span>
            <span>{crumbTitle}</span>
          </nav>

          <section className="watch-single" aria-labelledby="story-title">
            <header className="watch-head">
              <h1 className="watch-head__title" id="story-title">
                {current.title}
              </h1>
              <div className="watch-head__tags">
                <span className="watch-chip watch-chip--cat">PDF</span>
                {series ? <span className="watch-chip watch-chip--cat">{series}</span> : null}
                {current.episode != null && current.episode !== "" ? (
                  <span className="watch-chip watch-chip--tag">Episode {current.episode}</span>
                ) : null}
                {current.pages ? <span className="watch-chip watch-chip--tag">{current.pages} pages</span> : null}
                {tags.map((t) => (
                  <span key={t} className="watch-chip watch-chip--tag">
                    {t}
                  </span>
                ))}
              </div>
            </header>

            <div className="watch-layout">
              <div className="watch-layout__main">
                <StoryReader pdfUrl={current.pdf_url} coverUrl={current.cover_url} title={current.title} />

                {description ? <p className="watch-desc">{description}</p> : null}

                <AdSlot variant="leaderboard" zoneClass="eas6a97888e2" zoneId="5900210" keywords="keywords" sub="123450000" />
              </div>

              <aside className="watch-sidebar" aria-labelledby="story-sidebar-title">
                <AdSlot variant="sidebar" zoneClass="eas6a97888e2" zoneId="5900778" />

                <h2 id="story-sidebar-title" className="watch-sidebar__h">
                  {series ? `More from ${series}` : "More stories"}
                </h2>
                <div className="story-grid story-grid--sidebar" role="list">
                  {related.slice(0, 4).map((s) => (
                    <StoryCard key={s.id} story={s} />
                  ))}
                </div>

                <AdSlot variant="rect" zoneClass="eas6a97888e2" zoneId="5900208" keywords="keywords" sub="123450000" />

                <a href="/stories" className="watch-sidebar__all">
                  Browse all stories
                </a>
              </aside>
            </div>
          </section>

          {related.length ? (
            <section className="watch-related-block" aria-labelledby="story-related-heading">
              <h2 id="story-related-heading" className="watch-related-block__h">
                Related stories
              </h2>
              <div className="story-grid" role="list">
                {related.map((s) => (
                  <StoryCard key={s.id} story={s} />
                ))}
              </div>
              <AdSlot variant="leaderboard" zoneClass="eas6a97888e2" zoneId="5900782" label="Recommended" />
            </section>
          ) : null}
        </div>
      </main>
      <TubeFooter />
    </>
  );
}
