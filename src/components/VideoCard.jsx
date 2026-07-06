"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { watchPageHref } from "../lib/site-data.js";
import { fillPosterSlot } from "../lib/video-poster.js";

function showAdPopup(watchHref) {
  if (document.getElementById("fake-play-popup")) {
    window.location.href = watchHref;
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "fake-play-popup";
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 99999;
    background: rgba(0,0,0,0.93);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Inter', sans-serif;
  `;

  const card = document.createElement("div");
  card.style.cssText = `
    background: #111; border: 1px solid #2a2a2a; border-radius: 12px;
    padding: 24px; text-align: center; width: 90%; max-width: 360px;
    color: #fff; box-shadow: 0 20px 50px rgba(0,0,0,0.6);
  `;

  const timer = document.createElement("div");
  timer.style.cssText = "font-size:48px;font-weight:800;color:#e50914;margin-bottom:4px;";
  timer.textContent = "5";

  const msg = document.createElement("p");
  msg.style.cssText = "font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;";
  msg.textContent = "Advertisement — loading video…";

  const adWrap = document.createElement("div");
  adWrap.style.cssText = "margin: 0 auto 16px; min-height: 260px; display:flex; align-items:center; justify-content:center;";

  const ins = document.createElement("ins");
  ins.className = "eas6a97888e2";
  ins.setAttribute("data-zoneid", "5900204");
  ins.setAttribute("data-keywords", "keywords");
  ins.setAttribute("data-sub", "123450000");
  ins.setAttribute("data-block-ad-types", "0");
  ins.setAttribute("data-ex_av", "name");
  adWrap.appendChild(ins);

  const trigger = document.createElement("script");
  trigger.textContent = "(AdProvider = window.AdProvider || []).push({'serve': {}});";
  adWrap.appendChild(trigger);

  const skipBtn = document.createElement("button");
  skipBtn.textContent = "Watch Video ▶";
  skipBtn.style.cssText = `
    background: #e50914; color: #fff; border: none; padding: 12px 32px;
    font-size: 16px; font-weight: 700; border-radius: 7px; cursor: pointer;
    display: none; width: 100%; margin-top: 4px;
  `;
  skipBtn.onclick = () => overlay.remove();

  card.append(timer, msg, adWrap, skipBtn);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  let count = 5;
  const tick = setInterval(() => {
    count--;
    timer.textContent = count;
    if (count <= 0) {
      clearInterval(tick);
      timer.textContent = "✓";
      timer.style.color = "#4caf50";
      msg.textContent = "Ad complete — watch now!";
      skipBtn.style.display = "block";
    }
  }, 1000);
}

/** Grid card linking to the watch page (homepage + related strip). */
export default function VideoCard({ offer: o }) {
  const posterWrapRef = useRef(null);
  const articleRef = useRef(null);
  const watchHref = watchPageHref(o);
  const posterUrl = String(o.poster_url || "").trim();

  useEffect(() => {
    if (posterWrapRef.current) {
      fillPosterSlot(posterWrapRef.current, String(o.video_url || ""), posterUrl, articleRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o.id]);

  const searchHay = [o.title, o.description, o.tags, o.category, o.meta_title, o.meta_description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const href = String(o.href || "").trim();

  return (
    <article
      ref={articleRef}
      className="video-card"
      role="listitem"
      data-search={searchHay}
      data-offer-id={String(o.id || "")}
    >
      <div className="video-card__media">
        <div className="video-card__accent-bar" aria-hidden="true" />
        <Link className="video-card__thumb-link" href={watchHref} aria-label={`Watch: ${o.title}`}>
          <div className="video-card__poster-wrap" ref={posterWrapRef}>
            <span className="video-card__duration-badge" aria-hidden="true">
              HD
            </span>
            <span
              className="video-card__play"
              aria-hidden="true"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                showAdPopup(watchHref);
              }}
            />
          </div>
        </Link>
      </div>

      <div className="video-card__body">
        <Link className="video-card__title-link" href={watchHref}>
          <h3 className="video-card__title">{o.title}</h3>
        </Link>
        <p className="video-card__datas">
          <span>HD</span>
          <span>Streaming</span>
        </p>
        {o.description ? <p className="video-card__desc">{o.description}</p> : null}
        {href ? (
          <a className="video-card__cta" href={href} rel="noopener noreferrer" target="_blank">
            Open link
          </a>
        ) : null}
      </div>
    </article>
  );
}
