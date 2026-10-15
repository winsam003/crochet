"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Heart, Pause, Play } from "lucide-react";
import type { PopularDesigner } from "@/lib/ravelry";
import PatternImage from "./PatternImage";

const perPage = 4;

export default function DesignerCarousel({
  designers,
  craft,
}: {
  designers: PopularDesigner[];
  craft: "crochet" | "knitting";
}) {
  const craftLabel = craft === "crochet" ? "코바늘" : "대바늘";
  const pageCount = Math.ceil(designers.length / perPage);
  const [firstIndex, setFirstIndex] = useState(0);
  const page = Math.min(Math.floor(firstIndex / perPage), pageCount - 1);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const respectMotion = () => {
      if (motion.matches) setPaused(true);
    };
    respectMotion();
    motion.addEventListener("change", respectMotion);
    return () => motion.removeEventListener("change", respectMotion);
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || pageCount < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setFirstIndex(((page + 1) % pageCount) * perPage);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, page, pageCount]);

  function goTo(nextPage: number) {
    setFirstIndex(((nextPage + pageCount) % pageCount) * perPage);
  }

  return (
    <div
      className="designer-carousel"
      role="region"
      aria-roledescription="캐러셀"
      aria-label="인기 작가 추천"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="designer-carousel-viewport">
        <div
          className="designer-carousel-slide"
          key={page}
          role="group"
          aria-roledescription="슬라이드"
          aria-label={`${page + 1} / ${pageCount}`}
        >
          <ol className="designer-ranking" start={page * perPage + 1}>
            {designers.slice(page * perPage, (page + 1) * perPage).map((designer, index) => (
              <li key={designer.id}>
                <div className="designer-ranking-card">
                  <span className="designer-rank">
                    {String(page * perPage + index + 1).padStart(2, "0")}
                  </span>
                  <div className="designer-ranking-photo">
                    <PatternImage
                      src={designer.pattern.first_photo?.medium_url}
                      alt={designer.pattern.name}
                    />
                  </div>
                  <div className="designer-ranking-info">
                    <h3>
                      <Link
                        href={`/?${new URLSearchParams({ designer: designer.name, craft })}#results`}
                      >
                        {designer.name} <ArrowUpRight size={14} aria-hidden="true" />
                      </Link>
                    </h3>
                    <p className="designer-ranking-pattern-label">인기 {craftLabel} 도안</p>
                    <Link
                      className="designer-ranking-pattern"
                      href={`/pattern/${designer.pattern.id}`}
                    >
                      {designer.pattern.name} <ArrowUpRight size={12} aria-hidden="true" />
                    </Link>
                    <p className="designer-ranking-favorites">
                      <Heart size={12} aria-hidden="true" />
                      작가 즐겨찾기 {designer.favorites_count.toLocaleString("ko-KR")}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {pageCount > 1 && (
        <div className="designer-carousel-controls">
          <span className="designer-carousel-range">
            {page * perPage + 1}–{Math.min((page + 1) * perPage, designers.length)} /{" "}
            {designers.length}명
          </span>
          <button type="button" onClick={() => goTo(page - 1)} aria-label="이전 작가 보기">
            <ArrowLeft size={16} />
          </button>
          <span className="designer-carousel-page">
            {page + 1} / {pageCount}
          </span>
          <button type="button" onClick={() => goTo(page + 1)} aria-label="다음 작가 보기">
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "자동 슬라이드 재생" : "자동 슬라이드 일시정지"}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}
