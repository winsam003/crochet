"use client";

import { useEffect, useRef } from "react";

export default function AdFit({
  unit,
  width,
  height,
}: {
  unit: string;
  width: string;
  height: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. 이전 광고 잔재물 청소 (중요)
    container.innerHTML = "";

    // 2. ins 태그 동적 생성
    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.setAttribute("data-ad-unit", unit);
    ins.setAttribute("data-ad-width", width);
    ins.setAttribute("data-ad-height", height);

    // 3. 스크립트 태그 동적 생성
    // 매번 새로 생성해서 꽂아야 AdFit이 새로운 태그를 인식하고 바로 렌더링합니다.
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;

    // 4. 컨테이너에 삽입
    container.appendChild(ins);
    container.appendChild(script);

    return () => {
      // 페이지를 떠날 때 깔끔하게 비우기
      container.innerHTML = "";
    };
  }, [unit, width, height]); // 유닛이 바뀌거나 페이지가 전환되어 컴포넌트가 다시 마운트될 때 실행

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center w-full overflow-hidden"
      style={{ minHeight: `${height}px` }}
    />
  );
}
