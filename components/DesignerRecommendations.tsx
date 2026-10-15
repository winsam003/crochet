"use client";

import { useState } from "react";
import type { PopularDesigner } from "@/lib/ravelry";
import DesignerCarousel from "./DesignerCarousel";

export default function DesignerRecommendations({
  crochet,
  knitting,
}: {
  crochet: PopularDesigner[];
  knitting: PopularDesigner[];
}) {
  const [craft, setCraft] = useState<"crochet" | "knitting">(
    crochet.length ? "crochet" : "knitting",
  );
  const designers = craft === "crochet" ? crochet : knitting;
  const label = craft === "crochet" ? "코바늘" : "대바늘";

  return (
    <>
      <div className="designer-craft-buttons" role="group" aria-label="추천 작가 뜨개 종류">
        <button
          type="button"
          aria-pressed={craft === "crochet"}
          onClick={() => setCraft("crochet")}
        >
          코바늘 작가
        </button>
        <button
          type="button"
          aria-pressed={craft === "knitting"}
          onClick={() => setCraft("knitting")}
        >
          대바늘 작가
        </button>
      </div>
      <p className="section-note designer-selection-note">
        최근 인기 {label} 도안 24개에 등장한 작가 중 즐겨찾기가 많은 순으로 최대 12명을 소개해요. 각
        작가의 도안 중 이 인기 목록에서 가장 먼저 등장한 도안을 함께 보여드려요.
      </p>
      {designers.length ? (
        <DesignerCarousel key={craft} designers={designers} craft={craft} />
      ) : (
        <p className="notice" role="status">
          {label} 작가를 불러오지 못했어요. 잠시 후 다시 확인해 주세요.
        </p>
      )}
    </>
  );
}
