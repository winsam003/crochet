"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { SearchResult } from "@/lib/ravelry";
import type { DiscoveryTopic } from "@/lib/trending-topics-fallback";
import PatternCard from "./PatternCard";

export default function TrendingTopicCarousel({
  topic,
  crochet,
  knitting,
}: {
  topic: DiscoveryTopic;
  crochet: SearchResult | null;
  knitting: SearchResult | null;
}) {
  const id = useId();
  const [craft, setCraft] = useState<"crochet" | "knitting">(
    topic.params.craft === "knitting" || (!crochet?.patterns.length && knitting?.patterns.length)
      ? "knitting"
      : "crochet",
  );
  const [page, setPage] = useState(0);
  const touchStart = useRef<number | null>(null);
  const data = craft === "crochet" ? crochet : knitting;
  const patterns = data?.patterns || [];
  const pageCount = Math.ceil(patterns.length / 3);
  const label = craft === "crochet" ? "코바늘" : "대바늘";
  const href = `/?${new URLSearchParams({ ...topic.params, craft, sort: "recently-popular" })}#results`;

  function move(direction: number) {
    setPage((current) => Math.max(0, Math.min(current + direction, pageCount - 1)));
  }

  return (
    <section className="results-section" aria-labelledby={`${id}-title`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            {topic.rank ? `국내 검색 수요 ${topic.rank}위` : "도안 둘러보기"}
          </p>
          <div className="topic-title-controls">
            <h2 id={`${id}-title`}>{topic.title}</h2>
            <div
              className="designer-craft-buttons"
              role="group"
              aria-label={`${topic.title} 뜨개 종류`}
            >
              {(["crochet", "knitting"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={craft === value}
                  aria-controls={`${id}-patterns`}
                  onClick={() => {
                    setCraft(value);
                    setPage(0);
                  }}
                >
                  {value === "crochet" ? "코바늘" : "대바늘"}
                </button>
              ))}
            </div>
          </div>
          <p className="section-note">
            {typeof topic.monthlySearches === "number" && (
              <>
                “{topic.keyword}” 월간 검색 {topic.monthlySearches.toLocaleString("ko-KR")}회 ·{" "}
              </>
            )}
            {label} 도안 · 최근 인기순
          </p>
        </div>
        <Link className="text-link" href={href}>
          더 보기 <ArrowUpRight size={15} />
        </Link>
      </div>
      {data?.detailsUnavailable && (
        <p className="notice">일부 상세 정보를 가져오지 못했어요. 도안 상세에서 확인해 주세요.</p>
      )}
      <div
        id={`${id}-patterns`}
        role="region"
        aria-roledescription="캐러셀"
        aria-label={`${topic.title} ${label} 도안`}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
        onTouchCancel={() => {
          touchStart.current = null;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current !== null) {
            const distance = touchStart.current - event.changedTouches[0].clientX;
            if (Math.abs(distance) > 60) move(distance > 0 ? 1 : -1);
          }
          touchStart.current = null;
        }}
      >
        {patterns.length ? (
          <>
            <div className="designer-carousel-viewport">
              <div
                key={`${craft}-${page}`}
                className="designer-carousel-slide"
                role="group"
                aria-roledescription="슬라이드"
                aria-label={`${page + 1} / ${pageCount}`}
              >
                <div className="pattern-grid topic-pattern-grid">
                  {patterns.slice(page * 3, page * 3 + 3).map((pattern, index) => (
                    <PatternCard key={pattern.id} pattern={pattern} index={page * 3 + index} />
                  ))}
                </div>
              </div>
            </div>
            <div className="designer-carousel-controls">
              <span className="designer-carousel-range" role="status">
                {page * 3 + 1}–{Math.min(page * 3 + 3, patterns.length)} / {patterns.length}개
              </span>
              <button
                type="button"
                onClick={() => move(-1)}
                disabled={page === 0}
                aria-label={`${topic.title} 이전 도안`}
              >
                <ArrowLeft size={16} />
              </button>
              <span className="designer-carousel-page">
                {page + 1} / {pageCount}
              </span>
              <button
                type="button"
                onClick={() => move(1)}
                disabled={page >= pageCount - 1}
                aria-label={`${topic.title} 다음 도안`}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>
              {data
                ? `이 주제의 ${label} 도안이 아직 없어요. 다른 뜨개 종류를 선택해 보세요.`
                : "잠시 도안을 불러오지 못했어요. 다른 뜨개 종류를 선택하거나 다시 방문해 주세요."}
            </p>
            <Link className="text-link" href={href}>
              전체 목록에서 살펴보기 <ArrowUpRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
