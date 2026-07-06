import Script from "next/script";
import "../src/style.css";

export const metadata = {
  metadataBase: new URL("https://wellwetx.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="6a97888e-site-verification" content="51a53663e59891749401dcb15f6fd623" />
        <meta
          httpEquiv="Delegate-CH"
          content="Sec-CH-UA https://s.magsrv.com; Sec-CH-UA-Mobile https://s.magsrv.com; Sec-CH-UA-Arch https://s.magsrv.com; Sec-CH-UA-Model https://s.magsrv.com; Sec-CH-UA-Platform https://s.magsrv.com; Sec-CH-UA-Platform-Version https://s.magsrv.com; Sec-CH-UA-Bitness https://s.magsrv.com; Sec-CH-UA-Full-Version-List https://s.magsrv.com; Sec-CH-UA-Full-Version https://s.magsrv.com;"
        />
        <meta name="theme-color" content="#1a1a1a" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="tube">
        {children}
        <Script async src="https://a.magsrv.com/ad-provider.js" strategy="afterInteractive" />
        <Script async src="https://a.pemsrv.com/ad-provider.js" strategy="afterInteractive" />
        <Script id="pn-config" strategy="afterInteractive">
          {`
            pn_idzone = 5900784; pn_sleep_seconds = 0; pn_position = "bottom";
            pn_is_self_hosted = 1; pn_soft_ask = 1; pn_filename = "/worker.js";
          `}
        </Script>
        <Script src="https://js.wpnsrv.com/pn.php" strategy="afterInteractive" />
      </body>
    </html>
  );
}
