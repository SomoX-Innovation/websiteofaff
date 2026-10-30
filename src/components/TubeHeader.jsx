import Link from "next/link";

const TAGS = ["milf", "latina", "asian", "amateur", "hd", "lesbian", "teen", "homemade", "anal", "pov"];

/** Full tube-style header used on the homepage and watch page. */
export default function TubeHeader({ searchInputId = "tube-search-input" }) {
  return (
    <header className="site-header site-header--tube">
      <div className="wrap-tube tube-top">
        <Link href="/" className="logo logo--tube" id="tube-logo">
          <span className="logo-word-1" id="logo-w1">
            Wellwet
          </span>
          <span className="logo-word-2" id="logo-w2">
            X
          </span>
        </Link>
        <div className="tube-search" role="search">
          <label className="visually-hidden" htmlFor={searchInputId}>
            Search videos
          </label>
          <input
            id={searchInputId}
            type="search"
            className="tube-search__input"
            placeholder="Search…"
            autoComplete="off"
            maxLength={120}
          />
        </div>
        <div className="tube-top-right">
          <div className="tube-auth">
            <a className="tube-auth__signup" href="/contact">
              Sign up
            </a>
            <a className="tube-auth__login" href="/contact">
              Login
            </a>
          </div>
          <nav className="tube-utils" aria-label="Site links">
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </div>
      <div className="tube-nav-wrap">
        <nav className="tube-main-nav wrap-tube" aria-label="Main sections">
          <Link className="tube-main-nav__btn tube-main-nav__btn--primary" href="/">
            Home
          </Link>
          <Link className="tube-main-nav__btn tube-main-nav__btn--primary" href="/#tube-cats">
            Categories
          </Link>
          <Link className="tube-main-nav__btn tube-main-nav__btn--primary" href="/#tube-tags">
            Tags
          </Link>
          <Link className="tube-main-nav__btn tube-main-nav__btn--primary" href="/#tube-content">
            Videos
          </Link>
        </nav>
        <div className="tube-tag-strip-wrap">
          <nav className="tube-tag-strip wrap-tube" id="tube-tags" aria-label="Popular tags">
            {TAGS.map((t) => (
              <a key={t} className="tube-tag-pill" href="/" data-tube-tag={t}>
                {t === "teen" ? "Teen (18+)" : t[0].toUpperCase() + t.slice(1)}
              </a>
            ))}
            <Link className="tube-tag-pill" href="/#tube-cats">
              All categories
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
