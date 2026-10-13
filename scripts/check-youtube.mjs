// Read-only live check: 3 searches by default, or one supplied query (10 results each).
// Run with: node scripts/check-youtube.mjs [query]
process.loadEnvFile(".env.local");
const key = process.env.YOUTUBE_API_KEY;
if (!key) throw new Error("YOUTUBE_API_KEY is missing from .env.local");
async function get(resource, params) {
  let response;
  try {
    response = await fetch(
      `https://www.googleapis.com/youtube/v3/${resource}?${new URLSearchParams(params)}`,
      { headers: { "X-Goog-Api-Key": key }, signal: AbortSignal.timeout(15000) },
    );
  } catch (error) {
    throw new Error(`YouTube network error: ${error.cause?.code || error.name}`);
  }
  const data = await response.json();
  if (!response.ok) {
    const reason = String(data.error?.errors?.[0]?.reason || data.error?.status || "unknown")
      .replaceAll(key, "[redacted]");
    throw new Error(`YouTube HTTP ${response.status}: ${reason}`);
  }
  return data.items || [];
}
async function search(query, language) {
  const items = await get("search", {
    part: "snippet", type: "video", q: query, maxResults: "10",
    relevanceLanguage: language, regionCode: "KR", order: "relevance",
  });
  return { query, items };
}
try {
  // Stop immediately if the credentials or API configuration do not work.
  const query = process.argv.slice(2).join(" ").trim();
  const exact = await search(query || "Neat Ripple 코바늘", "ko");
  const remaining = await Promise.allSettled(query ? [] : [
    search("코바늘 물결무늬 담요 뜨기", "ko"),
    search("Attic24 Neat Ripple tutorial", "en"),
  ]);
  const results = [exact];
  for (const result of remaining) {
    if (result.status === "fulfilled") results.push(result.value);
    else console.error(result.reason.message);
  }
  const ids = [...new Set(results.flatMap(r => r.items.map(v => v.id.videoId)))];
  const details = ids.length ? await get("videos", {
    part: "snippet,contentDetails,status", id: ids.join(","),
  }) : [];
  const byId = new Map(details.map(v => [v.id, v]));
  for (const { query, items } of results) {
    console.log(JSON.stringify({ query, returned: items.length, videos: items.map(item => {
      const video = byId.get(item.id.videoId);
      const snippet = video?.snippet || item.snippet;
      const description = snippet.description || "";
      return {
        id: item.id.videoId, title: snippet.title, channel: snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        audioLanguage: snippet.defaultAudioLanguage || null,
        textLanguage: snippet.defaultLanguage || null,
        embeddable: video?.status?.embeddable ?? null,
        duration: video?.contentDetails?.duration,
        description: description.slice(0, 1600),
        patternLinks: description.match(/https?:\/\/[^\s<>]*(?:ravelry|attic24)[^\s<>]*/gi) || [],
      };
    }) }));
  }
  console.log(`Completed ${results.length} searches and ${ids.length ? 1 : 0} batched video detail request.`);
  if (remaining.some(r => r.status === "rejected")) process.exitCode = 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
