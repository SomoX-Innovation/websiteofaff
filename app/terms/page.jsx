import AgeGate from "../../src/components/AgeGate.jsx";
import CompactHeader from "../../src/components/CompactHeader.jsx";
import SimpleFooter from "../../src/components/SimpleFooter.jsx";
import PageChrome from "../../src/components/PageChrome.jsx";

export const metadata = {
  title: "Terms of Service - WellwetX | Legal Agreement & User Terms",
  description:
    "Terms of Service for WellwetX - Legal terms and conditions for users in UK, USA, Canada, India, and Sri Lanka. Read our complete terms of use.",
  keywords: "terms of service, terms of use, legal terms, user agreement",
  alternates: { canonical: "https://wellwetx.com/terms" },
  openGraph: {
    type: "website",
    title: "Terms of Service - WellwetX",
    description: "Complete terms of service and user agreement for WellwetX users across all supported regions.",
    url: "https://wellwetx.com/terms",
    locale: "en_US",
  },
};

export default function TermsPage() {
  return (
    <>
      <PageChrome withAuthModal={false} />
      <AgeGate />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CompactHeader current="terms" />
      <main id="main" className="page-legal wrap">
        <h1 className="page-legal__title">Terms of use</h1>
        <p className="page-legal__meta">Last updated: April 3, 2026 · Replace with your final terms.</p>
        <div className="prose">
          <p>
            By using this site you agree to these placeholder rules. You must be of legal age where you live to view
            adult content.
          </p>
          <h2>External content</h2>
          <p>
            Some videos or links may open third-party sites. We do not control those sites and are not responsible
            for their content, billing, or practices.
          </p>
          <h2>No guarantees</h2>
          <p>The site is provided as-is. Nothing here is legal or professional advice.</p>
          <h2>Contact</h2>
          <p>
            Use the <a href="/contact">contact</a> page.
          </p>
        </div>
      </main>
      <SimpleFooter />
    </>
  );
}
