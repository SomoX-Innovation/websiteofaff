import { fetchPublicCatalog, watchPageHref } from "../src/lib/site-data.js";
import { fetchStories, storyPageHref } from "../src/lib/story-data.js";

const BASE_URL = "https://wellwetx.com";

export default async function sitemap() {
  const [{ offers }, { stories }] = await Promise.all([fetchPublicCatalog(), fetchStories()]);

  const staticRoutes = ["", "/contact", "/privacy", "/terms", "/alternatives", "/watch", "/stories"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const offerRoutes = offers.map((o) => ({
    url: `${BASE_URL}${watchPageHref(o)}`,
    lastModified: new Date(),
  }));

  const storyRoutes = stories.map((s) => ({
    url: `${BASE_URL}${storyPageHref(s)}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...offerRoutes, ...storyRoutes];
}
