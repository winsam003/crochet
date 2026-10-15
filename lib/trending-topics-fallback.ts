export interface DiscoveryTopic {
  id: string;
  title: string;
  params: Record<string, string>;
  rank?: number;
  keyword?: string;
  monthlySearches?: number;
}

export interface DiscoverySnapshot {
  source: "naver-searchad" | "default";
  updatedAt: string | null;
  topics: DiscoveryTopic[];
}

export function validTrendingSnapshot(value: unknown): value is DiscoverySnapshot {
  if (!value || typeof value !== "object") return false;
  const data = value as DiscoverySnapshot;
  return (
    data.source === "naver-searchad" &&
    typeof data.updatedAt === "string" &&
    Number.isFinite(Date.parse(data.updatedAt)) &&
    Array.isArray(data.topics) &&
    data.topics.length === 3 &&
    data.topics.every(
      (topic, index) =>
        topic &&
        typeof topic.id === "string" &&
        topic.id.length > 0 &&
        topic.rank === index + 1 &&
        typeof topic.title === "string" &&
        topic.title.length > 0 &&
        typeof topic.keyword === "string" &&
        typeof topic.monthlySearches === "number" &&
        Number.isFinite(topic.monthlySearches) &&
        topic.monthlySearches >= 0 &&
        typeof topic.params?.query === "string" &&
        typeof topic.params?.category === "string" &&
        ["all", "crochet", "knitting"].includes(topic.params?.craft),
    ) &&
    new Set(data.topics.map((topic) => topic.id)).size === 3
  );
}

export function selectTrendingSnapshot(remote: unknown, local: unknown): DiscoverySnapshot {
  if (validTrendingSnapshot(remote)) return remote;
  if (validTrendingSnapshot(local)) return local;
  return {
    source: "default",
    updatedAt: null,
    topics: [
      { id: "bag", title: "가방·파우치", params: { craft: "crochet", category: "bag" } },
      { id: "dolls", title: "인형", params: { craft: "crochet", category: "softies" } },
      { id: "home", title: "생활 소품", params: { craft: "crochet", category: "home" } },
    ],
  };
}
