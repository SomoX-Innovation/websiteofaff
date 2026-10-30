import Link from "next/link";

/** Compact header used on contact/privacy/terms pages. */
export default function CompactHeader({ current }) {
  return (
    <header className="site-header site-header--tube site-header--compact">
      <div className="wrap tube-top">
        <Link href="/" className="logo logo--tube">
          WellwetX
        </Link>
        <nav className="tube-utils" aria-label="Primary">
          <Link href="/#videos">Videos</Link>
          <Link href="/contact" aria-current={current === "contact" ? "page" : undefined}>
            Contact
          </Link>
          <Link href="/privacy" aria-current={current === "privacy" ? "page" : undefined}>
            Privacy
          </Link>
          <Link href="/terms" aria-current={current === "terms" ? "page" : undefined}>
            Terms
          </Link>
        </nav>
      </div>
    </header>
  );
}
