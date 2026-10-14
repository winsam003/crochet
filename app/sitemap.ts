import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Stable entry pages; patterns are discoverable through their server-rendered links.
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/free-patterns", "/guide"].map((path) => ({ url: `${SITE_URL}${path}` }));
}
