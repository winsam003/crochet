import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { selectTrendingSnapshot, validTrendingSnapshot } from "./trending-topics-fallback";

const source =
  "https://raw.githubusercontent.com/winsam003/crochet/trend-data/data/trending-topics.json";

export async function getTrendingTopics() {
  let remote: unknown;
  try {
    const response = await fetch(source, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) remote = await response.json();
  } catch {
    // Continue with saved data if the remote source is unavailable.
  }
  if (validTrendingSnapshot(remote)) return remote;
  let local: unknown;
  try {
    // Runtime read tolerates a missing or malformed file as well.
    local = JSON.parse(await readFile(join(process.cwd(), "data/trending-topics.json"), "utf8"));
  } catch {
    // Default discovery topics need neither JSON nor Naver credentials.
  }
  return selectTrendingSnapshot(remote, local);
}
