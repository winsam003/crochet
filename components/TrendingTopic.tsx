import { getPatterns } from "@/lib/ravelry";
import type { DiscoveryTopic } from "@/lib/trending-topics-fallback";
import TrendingTopicCarousel from "./TrendingTopicCarousel";

export default async function TrendingTopic({ topic }: { topic: DiscoveryTopic }) {
  const results = await Promise.allSettled(
    (["crochet", "knitting"] as const).map((craft) =>
      getPatterns({ ...topic.params, craft, sort: "recently-popular" }),
    ),
  );
  const data = results.map((result) =>
    result.status === "fulfilled"
      ? { ...result.value, patterns: result.value.patterns.slice(0, 6) }
      : null,
  );
  return <TrendingTopicCarousel topic={topic} crochet={data[0]} knitting={data[1]} />;
}
