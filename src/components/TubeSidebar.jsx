"use client";

import { useState } from "react";
import Link from "next/link";
import AdSlot from "./AdSlot.jsx";

const CATEGORIES = [
  "Popular",
  "Amateur",
  "HD",
  "MILF",
  "Latina",
  "Asian",
  "Anal",
  "Lesbian",
  "Mature",
  "Interracial",
  "Homemade",
  "Ebony",
];

export default function TubeSidebar({ onCategoryPick }) {
  const [filter, setFilter] = useState("");

  const filtered = CATEGORIES.filter((c) => c.toLowerCase().includes(filter.trim().toLowerCase()));

  return (
    <aside className="tube-sidebar" id="tube-sidebar" aria-label="Categories">
      <div className="tube-sidebar__block">
        <span className="tube-sidebar__label">Quick</span>
        <ul className="tube-sidebar__list">
          <li>
            <Link href="/#tube-content">Newest</Link>
          </li>
          <li>
            <Link href="/#tube-content">Best</Link>
          </li>
          <li>
            <Link href="/contact">Feedback</Link>
          </li>
        </ul>
      </div>

      <div className="tube-sidebar__block" id="tube-cats">
        <label className="tube-sidebar__label" htmlFor="tube-cat-filter">
          Filter categories
        </label>
        <input
          type="search"
          id="tube-cat-filter"
          className="tube-sidebar__filter"
          placeholder="Filter by name…"
          autoComplete="off"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <ul className="tube-sidebar__cats" id="tube-cat-list">
          {filtered.map((name) => (
            <li key={name}>
              <button
                type="button"
                className="tube-sidebar__cat"
                data-tube-query={name.toLowerCase()}
                onClick={() => onCategoryPick?.(name.toLowerCase())}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AdSlot variant="sidebar" zoneClass="eas6a97888e35" zoneId="5972168" keywords="keywords" sub="123450000" />
    </aside>
  );
}
