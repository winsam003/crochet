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
  const adRef = useRef<boolean>(false);

  useEffect(() => {
    // 1. 이미 스크립트가 로드되었는지 확인
    const isScriptLoaded = document.querySelector(
      'script[src="//t1.daumcdn.net/kas/static/ba.min.js"]'
    );

    if (!isScriptLoaded) {
      const script = document.createElement("script");
      script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // 2. 광고 영역이 리렌더링될 때 애드핏이 다시 인식하도록 처리 (선택사항)
    // 애드핏 스크립트가 로드된 후 윈도우 객체에 등록된 함수를 호출할 수 있습니다.
  }, [unit]);

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