export default function AgeGate() {
  return (
    <div id="age-gate" className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-title">
      <div className="age-gate__card">
        <h1 id="age-title" className="age-gate__title">
          Adults only
        </h1>
        <p className="age-gate__text">
          This site contains material intended for adults. By entering you confirm you are of legal age in your
          place of residence and agree to our terms.
        </p>
        <div className="age-gate__actions">
          <button type="button" className="btn btn--primary" id="age-enter">
            I am 18+ — Enter
          </button>
          <button type="button" className="btn btn--ghost" id="age-exit">
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
