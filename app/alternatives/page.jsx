import Link from "next/link";
import PageChrome from "../../src/components/PageChrome.jsx";
import SimpleFooter from "../../src/components/SimpleFooter.jsx";
import AffiliateCta from "../../src/components/AffiliateCta.jsx";

export const metadata = {
  title: "Top 5 Alternatives to Premium Adult Sites in 2026 | WellwetX",
  description:
    "Looking for the best adult tube alternatives in 2026? Find out why WellwetX is the top choice for Free HD premium streaming compared to other big sites.",
  keywords: "pornhub alternatives, xvideos alternatives, best tube sites, premium adult videos",
};

export default function AlternativesPage() {
  return (
    <>
      <PageChrome withAuthModal={false} />
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
        </div>
      </header>

      <main className="tube-main-outer" style={{ padding: "40px 0" }}>
        <div className="wrap-tube">
          <article
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "40px",
              borderRadius: "12px",
              maxWidth: "800px",
              margin: "0 auto",
              color: "#fff",
            }}
          >
            <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#e50914" }}>
              The Top 5 Adult Tube Alternatives in 2026
            </h1>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "30px", color: "#aaa" }}>
              Are you tired of millions of popups, low-quality videos, and greedy premium paywalls on the biggest
              adult sites? We rank the absolute best alternatives to watch 1080p and 4K premium content for free.
            </p>

            <h2 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>#1. WellwetX (Top Choice)</h2>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "20px", color: "#ccc" }}>
              We might be biased, but <strong>WellwetX</strong> is completely changing the industry standard.
              Offering thousands of 4K and 1080p videos with minimal ad disruptions, it provides the premium
              experience usually reserved for paying customers.
            </p>
            <Link
              href="/"
              className="btn btn--primary"
              style={{
                display: "inline-block",
                padding: "15px 30px",
                fontSize: "1.2rem",
                background: "#e50914",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "6px",
                marginBottom: "40px",
              }}
            >
              Click here to start watching HD Videos now
            </Link>

            <h2 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>#2. Premium Live Cams</h2>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "20px", color: "#ccc" }}>
              If pre-recorded videos aren&apos;t enough, interactive live cams offer the best alternative. Engage
              directly with models in real-time.
            </p>
            <div id="affiliate-cta-container">
              <AffiliateCta />
            </div>
          </article>
        </div>
      </main>

      <SimpleFooter />
    </>
  );
}
