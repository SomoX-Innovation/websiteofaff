import AgeGate from "../../src/components/AgeGate.jsx";
import CompactHeader from "../../src/components/CompactHeader.jsx";
import SimpleFooter from "../../src/components/SimpleFooter.jsx";
import PageChrome from "../../src/components/PageChrome.jsx";

export const metadata = {
  title: "Privacy Policy - WellwetX | Data Protection & Personal Information",
  description:
    "Privacy Policy for WellwetX - Learn how we protect your personal data and maintain your privacy across all regions including UK, USA, Canada, India, and Sri Lanka.",
  keywords: "privacy policy, data protection, personal information, terms",
  alternates: { canonical: "https://wellwetx.com/privacy" },
  openGraph: {
    type: "website",
    title: "Privacy Policy - WellwetX",
    description: "Our comprehensive privacy policy protecting user data across UK, USA, Canada, India, and Sri Lanka.",
    url: "https://wellwetx.com/privacy",
    locale: "en_US",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <PageChrome withAuthModal={false} />
      <AgeGate />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CompactHeader current="privacy" />
      <main id="main" className="page-legal wrap">
        <h1 className="page-legal__title">Privacy policy</h1>
        <p className="page-legal__meta">Last updated: April 3, 2026 · Replace with your final policy.</p>
        <div className="prose">
          <p>
            This page is a placeholder. Adult sites typically explain what data you collect (contact messages,
            analytics, cookies) and how long you keep it.
          </p>
          <h2>Data we collect</h2>
          <p>
            If you use the contact form, we store what you send so we can reply. Hosting and analytics tools may log
            technical data (IP, browser) according to their own policies.
          </p>
          <h2>Third parties</h2>
          <p>
            Embedded players or ads from other companies may use cookies or similar technologies. List the services
            you actually use and link to their policies.
          </p>
          <h2>Contact</h2>
          <p>
            Questions go through our <a href="/contact">contact</a> page.
          </p>
        </div>
      </main>
      <SimpleFooter />
    </>
  );
}
