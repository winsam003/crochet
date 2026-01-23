"use client";

import { useEffect } from "react";

export default function AdFit({
  unit,
  width,
  height,
}: {
  unit: string;
  width: string;
  height: string;
}) {
  useEffect(() => {
    // 1. 윈도우 객체에 adfit이 없을 때만 스크립트 로드
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // 컴포넌트가 사라질 때 스크립트 정리 (선택사항)
      document.body.removeChild(script);
    };
  }, [unit]); // 유닛 ID가 바뀔 때마다 다시 실행

  return (
    <div className="flex justify-center items-center w-full overflow-hidden min-h-[250px]">
      <ins
        className="kakao_ad_area"
        style={{ display: "none" }}
        data-ad-unit={unit}
        data-ad-width={width}
        data-ad-height={height}
      ></ins>
    </div>
  );
}
