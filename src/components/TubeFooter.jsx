import Link from "next/link";
import AdSlot from "./AdSlot.jsx";
import StickyAdBar from "./StickyAdBar.jsx";

/** Wide footer with column links + a single footer ad zone, used on home + watch pages. */
export default function TubeFooter() {
  return (
    <>
      <footer className="site-footer site-footer--tube site-footer--wide">
        <div className="wrap-tube site-footer__grid">
          <div className="site-footer__col">
            <span className="site-footer__col-title">Site</span>
            <Link href="/#tube-content">Home</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/alternatives">Alternatives</Link>
          </div>
          <div className="site-footer__col">
            <span className="site-footer__col-title">Help</span>
            <Link href="/contact">Support</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
          <div className="site-footer__col">
            <span className="site-footer__col-title">Legal</span>
            <Link href="/terms">Terms of use</Link>
            <Link href="/privacy">Privacy policy</Link>
          </div>
        </div>

        <div className="wrap-tube">
          <AdSlot variant="banner" zoneClass="eas6a97888e35" zoneId="5972168" keywords="keywords" sub="123450000" />
        </div>

        <div className="wrap-tube site-footer__bottom">
          <p className="site-footer__line">
            © <span id="year" /> <span id="footer-brand">WellwetX</span>
          </p>
          <p className="site-footer__muted">
            18+ only · All models are over 18 · RTA label: restricted to adults where applicable
          </p>
        </div>
      </footer>

      <StickyAdBar />
    </>
  );
}
