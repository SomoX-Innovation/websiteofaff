import AgeGate from "../../src/components/AgeGate.jsx";
import CompactHeader from "../../src/components/CompactHeader.jsx";
import SimpleFooter from "../../src/components/SimpleFooter.jsx";
import PageChrome from "../../src/components/PageChrome.jsx";
import ContactForm from "../../src/components/ContactForm.jsx";

export const metadata = {
  title: "Contact WellwetX - Customer Support & Feedback Form",
  description:
    "Contact WellwetX - Get in touch with our support team. We support customers in UK, USA, Canada, India, and Sri Lanka.",
  keywords: "contact us, customer support, feedback, email, help",
  alternates: { canonical: "https://wellwetx.com/contact" },
  openGraph: {
    type: "website",
    title: "Contact - WellwetX",
    description: "Contact WellwetX customer support team. Available to users in UK, USA, Canada, India, and Sri Lanka.",
    url: "https://wellwetx.com/contact",
    locale: "en_US",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact WellwetX",
  url: "https://wellwetx.com/contact",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    areaServed: ["US", "GB", "CA", "IN", "LK"],
  },
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageChrome withAuthModal={false} />
      <AgeGate />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CompactHeader current="contact" />
      <main id="main" className="page-contact wrap">
        <h1 className="page-contact__title">Contact</h1>
        <p className="page-contact__lead">Send a message to the team. We read every note.</p>
        <ContactForm />
      </main>
      <SimpleFooter />
    </>
  );
}
