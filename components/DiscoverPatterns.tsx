import { Fragment } from "react";
import AdSlot from "./AdSlot";
import { randomInt } from "node:crypto";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPatterns } from "@/lib/ravelry";
import PatternCard from "./PatternCard";

const interests = [
  {
    category: "bag",
    title: "가방·파우치",
    description: "매일 들고 싶은 나만의 소품을 찾아보세요.",
  },
  { category: "softies", title: "인형", description: "한 코씩 완성하는 작은 친구들을 만나보세요." },
  { category: "home", title: "생활 소품", description: "일상 곳곳에 손뜨개의 온기를 더해보세요." },
];

export default async function DiscoverPatterns() {
  // The home page awaits searchParams, so this choice is made per server render.
  const interest = interests[randomInt(interests.length)];
  const sections: { title: string; description: string; params: Record<string, string> }[] = [
    {
      title: interest.title,
      description: interest.description,
      params: { category: interest.category },
    },
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
                  <p className="eyebrow">{index === 0 ? "오늘의 취향 탐색" : "도안 둘러보기"}</p>
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
            {(index === 0 || index === 2) && <AdSlot />}
          </Fragment>
        );
      })}
    </div>
  );
}
