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
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const adScripts = document.querySelectorAll(
        `script[src*="daumcdn.net/kas/static/ba.min.js"]`,
      );
      adScripts.forEach((s) => s.remove());
    };
  }, []);

  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "none" }}
      data-ad-unit={unit}
      data-ad-width={width}
      data-ad-height={height}
    ></ins>
  );
}
