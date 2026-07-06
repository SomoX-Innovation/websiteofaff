"use client";

import { useMemo, useState } from "react";
import VideoCard from "./VideoCard.jsx";
import TubeSidebar from "./TubeSidebar.jsx";
import AdSlot from "./AdSlot.jsx";

export default function HomeFeed({ heroTitle, heroLead, offers }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return offers;
    return offers.filter((o) => {
      const hay = [o.title, o.description, o.tags, o.category, o.meta_title, o.meta_description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [offers, query]);

  return (
    <div className="wrap-tube tube-page" id="tube-content">
      <TubeSidebar onCategoryPick={setQuery} />

      <div className="tube-feed">
        <div className="tube-feed__head">
          <div className="tube-feed__titles">
            <h1 className="tube-feed__h1" id="hero-title">
              {heroTitle}
            </h1>
            <p className="tube-feed__sub" id="hero-lead">
              {heroLead}
            </p>
          </div>
          <div className="tube-segments" role="toolbar" aria-label="Quality filters">
            <span className="tube-segments__item tube-segments__item--active">All</span>
            <a className="tube-segments__item" href="/#tube-content">
              HD
            </a>
            <a className="tube-segments__item" href="/#tube-content">
              4K
            </a>
            <a className="tube-segments__item" href="/#tube-content">
              VR
            </a>
          </div>
        </div>

        <section className="videos" id="videos" aria-labelledby="videos-heading">
          <h2 id="videos-heading" className="visually-hidden">
            Video results
          </h2>
          <div className="tube-search" role="search" style={{ marginBottom: "0.75rem" }}>
            <label className="visually-hidden" htmlFor="tube-search-input">
              Search videos
            </label>
            <input
              id="tube-search-input"
              type="search"
              className="tube-search__input"
              placeholder="Search…"
              autoComplete="off"
              maxLength={120}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="video-grid video-grid--tube" id="video-grid" role="list">
            {visible.length === 0 ? (
              <p className="video-grid__status" role="status">
                {offers.length === 0 ? "No videos to show right now. Check back soon." : "No matches."}
              </p>
            ) : (
              visible.map((o) => <VideoCard key={o.id} offer={o} />)
            )}
          </div>
        </section>

        <AdSlot variant="leaderboard" zoneClass="eas6a97888e17" zoneId="5900606" keywords="keywords" sub="123450000" />

        <nav className="tube-pagination" aria-label="Pages">
          <span className="tube-pagination__btn tube-pagination__btn--current" aria-current="page">
            1
          </span>
          <a className="tube-pagination__btn" href="/#tube-content">
            2
          </a>
          <a className="tube-pagination__btn" href="/#tube-content">
            3
          </a>
          <span className="tube-pagination__gap">…</span>
          <a className="tube-pagination__next" href="/#tube-content">
            Next
          </a>
        </nav>
      </div>
    </div>
  );
}
