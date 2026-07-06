import { fetchPublicCatalog } from "../src/lib/site-data.js";
import AgeGate from "../src/components/AgeGate.jsx";
import TubeHeader from "../src/components/TubeHeader.jsx";
import TubeFooter from "../src/components/TubeFooter.jsx";
import HomeFeed from "../src/components/HomeFeed.jsx";
import PageChrome from "../src/components/PageChrome.jsx";

export const metadata = {
  title: "WellwetX - Premium Adult Videos | Streaming in UK, USA, Canada, India & Sri Lanka",
  description:
    "Premium adult video site with thousands of high-quality videos. Browse free content and premium channels across all categories.",
  keywords: "adult videos, premium content, video site, streaming, adults only",
  authors: [{ name: "WellwetX" }],
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "https://wellwetx.com/",
    languages: {
      en: "https://wellwetx.com/",
      "en-US": "https://wellwetx.com/us/",
      "en-GB": "https://wellwetx.com/uk/",
      "en-CA": "https://wellwetx.com/ca/",
      "en-IN": "https://wellwetx.com/in/",
      "x-default": "https://wellwetx.com/",
    },
  },
  openGraph: {
    type: "website",
    title: "WellwetX - Premium Adult Video Platform",
    description:
      "Explore thousands of premium adult videos with high quality streaming available in UK, USA, Canada, India, and Sri Lanka.",
    url: "https://wellwetx.com/",
    images: ["https://wellwetx.com/og-image.jpg"],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WellwetX - Premium Adult Video Platform",
    description: "Browse premium adult videos with global availability.",
    images: ["https://wellwetx.com/twitter-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WellwetX",
  url: "https://wellwetx.com",
  description: "Premium adult video platform available in UK, USA, Canada, India, and Sri Lanka",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://wellwetx.com/?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  areaServed: [
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "India" },
    { "@type": "Country", name: "Sri Lanka" },
  ],
};

export default async function HomePage() {
  const { settings, offers } = await fetchPublicCatalog();
  const heroTitle = settings.hero_title || "Trending free videos";
  const heroLead = settings.hero_lead || "Fresh clips updated daily.";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageChrome />
      <AgeGate />
      <a className="skip-link" href="#tube-content">
        Skip to content
      </a>
      <TubeHeader />
      <main id="main" className="tube-main-outer">
        <HomeFeed heroTitle={heroTitle} heroLead={heroLead} offers={offers} />
      </main>
      <TubeFooter />
    </>
  );
}
