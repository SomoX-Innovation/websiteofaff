import { fetchPublicCatalog, watchPageHref } from "../src/lib/site-data.js";

const BASE_URL = "https://wellwetx.com";

export default async function sitemap() {
  const { offers } = await fetchPublicCatalog();

  const staticRoutes = ["", "/contact", "/privacy", "/terms", "/alternatives", "/watch"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const offerRoutes = offers.map((o) => ({
    url: `${BASE_URL}${watchPageHref(o)}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...offerRoutes];
}
