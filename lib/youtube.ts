import "server-only";
import { cache } from "react";
import type { Pattern } from "./patterns";
import { selectRelatedVideos, videoSearchContext, type VideoCandidate } from "./video-matching";

interface Snippet {
  title?: string;
  description?: string;
  channelTitle?: string;
  defaultAudioLanguage?: string;
  defaultLanguage?: string;
  thumbnails?: { medium?: { url?: string } };
}
interface SearchItem {
  id?: { videoId?: string };
  snippet?: Snippet;
}
interface VideoItem {
  id: string;
  snippet?: Snippet;
  contentDetails?: {
    duration?: string;
    regionRestriction?: { blocked?: string[]; allowed?: string[] };
  };
  status?: { privacyStatus?: string };
}
let unavailableUntil = 0;
async function request<T>(resource: string, params: Record<string, string>): Promise<T[]> {
  if (!process.env.YOUTUBE_API_KEY || Date.now() < unavailableUntil)
    throw new Error("YouTube unavailable");
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/${resource}?${new URLSearchParams(params)}`,
    {
      headers: { "X-Goog-Api-Key": process.env.YOUTUBE_API_KEY },
      next: { revalidate: 7 * 24 * 60 * 60 },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) {
    // Stop repeated failed requests in this server instance; never log the key or API response.
    if (response.status === 403 || response.status === 429)
      unavailableUntil = Date.now() + 60 * 60 * 1000;
    throw new Error("YouTube unavailable");
  }
  const data = (await response.json()) as { items?: T[] };
  return data.items || [];
}
const search = cache(async (query: string): Promise<VideoCandidate[]> => {
  const items = await request<SearchItem>("search", {
    part: "snippet",
    type: "video",
    q: query,
    maxResults: "10",
    relevanceLanguage: "ko",
    regionCode: "KR",
    order: "relevance",
  });
  const ids = items
    .map((v) => v.id?.videoId)
    .filter((id): id is string => !!id && /^[\w-]{11}$/.test(id));
  if (!ids.length) return [];
  // Fetch full descriptions and language information once for all ten search results.
  const videos = await request<VideoItem>("videos", {
    part: "snippet,contentDetails,status",
    id: ids.join(","),
  });
  return videos.map((v) => {
    const s = v.snippet || {};
    const region = v.contentDetails?.regionRestriction;
    return {
      id: v.id,
      title: s.title || "",
      description: s.description || "",
      channel: s.channelTitle || "",
      thumbnail: s.thumbnails?.medium?.url,
      audioLanguage: s.defaultAudioLanguage,
      textLanguage: s.defaultLanguage,
      duration: v.contentDetails?.duration,
      available:
        v.status?.privacyStatus === "public" &&
        !region?.blocked?.includes("KR") &&
        (!region?.allowed || region.allowed.includes("KR")),
    };
  });
});

export async function getPatternVideos(pattern: Pattern) {
  const context = videoSearchContext(pattern);
  const searchUrl = `https://www.youtube.com/results?${new URLSearchParams({ search_query: context.primary })}`;
  let candidates: VideoCandidate[] = [];
  let failed = false;
  if (!process.env.YOUTUBE_API_KEY) return { videos: [], searchUrl, failed: true };
  try {
    candidates = await search(context.primary);
    const first = selectRelatedVideos(pattern, candidates);
    // At most two searches per uncached pattern. Reuse the first response, including foreign matches.
    if (first.filter((v) => v.korean).length < 3 && context.fallback !== context.primary) {
      candidates = [...candidates, ...(await search(context.fallback))];
    }
  } catch {
    failed = true;
  }
  return { videos: selectRelatedVideos(pattern, candidates), searchUrl, failed };
}
