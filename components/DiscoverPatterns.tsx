import { Fragment } from "react";
import AdSlot from "./AdSlot";
import { getTrendingTopics } from "@/lib/trending-topics-source";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPatterns } from "@/lib/ravelry";
import PatternCard from "./PatternCard";
import TrendingTopic from "./TrendingTopic";

export default async function DiscoverPatterns() {
  const trendingTopics = await getTrendingTopics();
  const isRanked = trendingTopics.source === "naver-searchad";
  const sections: {
    title: string;
    description: string;
    params: Record<string, string>;
    rank?: number;
  }[] = [
    {
      title: "한국어로 읽는 도안",
      description: "언어 부담 없이 시작해보세요.",
      params: { language: "kr" },
    },
    {
      title: "기호 도안이 있는 무료 도안",
      description: "기호를 보며 차근차근 따라가 보세요.",
      params: { free: "free", format: "chart" },
    },
    {
      title: "처음 도전하는 쉬운 도안",
      description: "이용자 난이도 평가가 1–2인 도안을 모았어요.",
      params: { difficulty: "easy" },
    },
    {
      title: "요즘 인기 있는 도안",
      description: "최근 관심을 모으는 도안에서 영감을 찾아보세요.",
      params: { sort: "recently-popular" },
    },
  ];
  const results = await Promise.allSettled(
    sections.map((section) => getPatterns({ craft: "crochet", ...section.params })),
  );
  const seen = new Set<number>();

  return (
    <div id="results" className="discovery-sections">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{isRanked ? "많이 찾는 뜨개 주제" : "도안 둘러보기"}</p>
          <h2>{isRanked ? "국내 검색 수요 TOP 3" : "오늘의 취향 탐색"}</h2>
          <p className="section-note">
            {isRanked && trendingTopics.updatedAt ? (
              <>
                네이버 연관 검색어 중 도안으로 만날 수 있는 주제를 골랐어요.
                <br />
                주제별 대표 검색어의 월간 검색량 기준 ·{" "}
                {new Intl.DateTimeFormat("ko-KR", {
                  timeZone: "Asia/Seoul",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(trendingTopics.updatedAt))}{" "}
                갱신
              </>
            ) : (
              "가방부터 인형, 생활 소품까지 취향에 맞는 도안을 만나보세요."
            )}
          </p>
        </div>
      </div>
      {trendingTopics.topics.map((topic) => (
        <TrendingTopic key={topic.id} topic={topic} />
      ))}
      <AdSlot />
      {sections.map((section, index) => {
        const result = results[index];
        const data = result.status === "fulfilled" ? result.value : undefined;
        const patterns = (data?.patterns || []).filter((p) => !seen.has(p.id)).slice(0, 6);
        patterns.forEach((p) => seen.add(p.id));
        const query = new URLSearchParams({ craft: "crochet", ...section.params });
        const href = `/?${query}#results`;
        return (
          <Fragment key={section.title}>
            <section className="results-section" aria-labelledby={`discover-${index}`}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">
                    {section.rank ? `국내 검색 수요 ${section.rank}위` : "도안 둘러보기"}
                  </p>
                  <h2 id={`discover-${index}`}>{section.title}</h2>
                  <p className="section-note">{section.description}</p>
                </div>
                <Link className="text-link" href={href}>
                  더 보기 <ArrowUpRight size={15} />
                </Link>
              </div>
              {data?.detailsUnavailable && (
                <p className="notice">
                  일부 상세 정보를 가져오지 못했어요. 도안 상세에서 다시 확인해 주세요.
                </p>
              )}
              {patterns.length ? (
                <div className="pattern-grid">
                  {patterns.map((pattern, cardIndex) => (
                    <PatternCard
                      key={pattern.id}
                      pattern={pattern}
                      index={index === 0 ? cardIndex : cardIndex + 3}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>
                    {!data
                      ? "잠시 도안을 불러오지 못했어요."
                      : data.patterns.length
                        ? "앞 목록에서 소개한 도안과 겹쳐요. 전체 목록에서 더 살펴보세요."
                        : "이 조건에 맞는 도안이 아직 없어요."}
                  </p>
                  <Link className="text-link" href={href}>
                    전체 목록에서 살펴보기 <ArrowUpRight size={15} />
                  </Link>
                </div>
              )}
            </section>
            {index === 1 && <AdSlot />}
          </Fragment>
        );
      })}
    </div>
  );
}
