/** Inline trigger script that fires after each ExoClick <ins> tag, matching the original static markup. */
export default function AdZoneScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: '(AdProvider = window.AdProvider || []).push({"serve": {}});',
      }}
    />
  );
}
