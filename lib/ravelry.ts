import "server-only";
import { cache } from "react";
import { interpretSearch, type Pattern, type SearchParams } from "./patterns";
export interface SearchResult {
  patterns: Pattern[];
  paginator: { page_count: number; results: number; page: number };
  detailsUnavailable?: boolean;
}
async function request<T>(path: string, revalidate = 3600): Promise<T> {
  const user = process.env.RAVELRY_USER_ID,
    key = process.env.RAVELRY_API_KEY;
  if (!user || !key) throw new Error("Ravelry credentials missing");
  const res = await fetch(`https://api.ravelry.com/${path}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${user}:${key}`).toString("base64")}` },
    next: { revalidate },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Ravelry HTTP ${res.status}`);
  return res.json();
}
async function hydrate(data: SearchResult): Promise<SearchResult> {
  if (!data.patterns.length) return data;
  try {
    // The API expects space-separated IDs. URLSearchParams encodes spaces as +.
    const ids = data.patterns.map((p) => p.id).join(" ");
    const details = await request<{ patterns: Record<string, Pattern> }>(
      `patterns.json?${new URLSearchParams({ ids })}`,
    );
    return {
      ...data,
      detailsUnavailable: data.patterns.some((p) => !details.patterns[String(p.id)]),
      patterns: data.patterns.map((p) => ({ ...p, ...details.patterns[String(p.id)] })),
    };
  } catch {
    return { ...data, detailsUnavailable: true };
  }
}
export async function getPatterns(input: SearchParams = {}): Promise<SearchResult> {
  const s = interpretSearch(input);
  const params = new URLSearchParams({
    query: s.query,
    page: String(s.page),
    page_size: "12",
    sort: s.sort,
    photo: "yes",
  });
  if (s.craft) params.set("craft", s.craft);
  if (s.designer) params.set("designer", s.designer);
  if (s.availability) params.set("availability", s.availability);
  if (s.category) params.set("pc", s.category);
  if (s.language) params.set("language", s.language);
  if (s.format) params.set("pa", s.format);
  if (s.difficulty) params.set("difficulties", "1|2");
  return hydrate(await request<SearchResult>(`patterns/search.json?${params}`));
}
export const getPatternDetail = cache(async (id: string): Promise<Pattern | null> => {
  if (!/^\d+$/.test(id)) return null;
  try {
    return (await request<{ pattern: Pattern }>(`patterns/${id}.json`)).pattern;
  } catch (e) {
    if (e instanceof Error && e.message === "Ravelry HTTP 404") return null;
    throw e;
  }
});
export async function getRelatedPatterns(
  category: string,
  craft: string,
  excludeId: number,
): Promise<Pattern[]> {
  try {
    const params = new URLSearchParams({
      pc: category,
      craft,
      page_size: "5",
      sort: "projects",
      photo: "yes",
    });
    const data = await request<SearchResult>(`patterns/search.json?${params}`);
    return data.patterns.filter((p) => p.id !== excludeId).slice(0, 4);
  } catch {
    return [];
  }
}
export async function getHotPatterns(category = "", craft = "crochet"): Promise<Pattern[]> {
  try {
    const params = new URLSearchParams({
      pc: category,
      craft,
      page_size: "4",
      sort: "recently-popular",
      photo: "yes",
    });
    return (await request<SearchResult>(`patterns/search.json?${params}`, 600)).patterns;
  } catch {
    return [];
  }
}

export interface PopularDesigner {
  id: number;
  name: string;
  favorites_count: number;
  pattern: Pattern;
}

export const getPopularDesigners = cache(
  async (craft: "crochet" | "knitting" = "crochet"): Promise<PopularDesigner[]> => {
    try {
      const params = new URLSearchParams({
        craft,
        page_size: "24",
        sort: "recently-popular",
        photo: "yes",
      });
      const data = await request<SearchResult>(`patterns/search.json?${params}`, 3600);
      const candidates = new Map<number, Pattern>();
      for (const pattern of data.patterns) {
        const author = pattern.pattern_author?.id ? pattern.pattern_author : pattern.designer;
        if (author?.id && !candidates.has(author.id)) candidates.set(author.id, pattern);
      }
      const results = await Promise.allSettled(
        Array.from(candidates, async ([id, pattern]): Promise<PopularDesigner | null> => {
          const { pattern_author: author } = await request<{
            pattern_author: { id: number; name: string; favorites_count?: number };
          }>(`designers/${id}.json`, 86400);
          if (!author.name || typeof author.favorites_count !== "number") return null;
          return {
            id: author.id,
            name: author.name,
            favorites_count: author.favorites_count,
            pattern,
          };
        }),
      );
      return results
        .flatMap((result) => (result.status === "fulfilled" && result.value ? [result.value] : []))
        .sort((a, b) => b.favorites_count - a.favorites_count || a.name.localeCompare(b.name))
        .slice(0, 12);
    } catch {
      return [];
    }
  },
);
