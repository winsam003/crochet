import type { Metadata } from "next";

export const SITE_URL = "https://crochet.winsam.xyz";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      locale: "ko_KR",
      type: "website",
    },
  };
}
