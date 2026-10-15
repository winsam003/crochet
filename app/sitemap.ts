import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { FREE_CATEGORIES, freePatternUrl } from "@/lib/free-patterns";

// Stable entry pages; patterns are discoverable through their server-rendered links.
export default function sitemap(): MetadataRoute.Sitemap {
  const collections = FREE_CATEGORIES.flatMap((category) =>
    ["crochet", "knitting"].map((craft) => freePatternUrl(craft, "all", category.id, "projects")),
  );
  return ["/", "/free-patterns", "/guide", ...collections].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
