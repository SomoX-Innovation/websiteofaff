import AdSlot from "./AdSlot.jsx";

/** Simple footer with a single ad zone, used on contact/privacy/terms/alternatives pages. */
export default function SimpleFooter() {
  return (
    <>
      <div className="wrap">
        <AdSlot variant="banner" zoneClass="eas6a97888e35" zoneId="5972168" keywords="keywords" sub="123450000" />
      </div>

      <footer className="site-footer site-footer--tube">
        <div className="wrap site-footer__inner">
          <p className="site-footer__line">
            © <span id="year" /> WellwetX
          </p>
        </div>
      </footer>
    </>
  );
}
