"use client";

import { useEffect, useRef } from "react";
import { mountAdFit } from "./adfit-loader";

export default function AdFit({
  unit,
  width,
  height,
  onEmpty,
}: {
  unit: string;
  width: string;
  height: string;
  onEmpty: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return mountAdFit(container, { unit, width, height, onEmpty });
  }, [unit, width, height, onEmpty]);

  return (
    <div
      ref={containerRef}
      className="adfit-container"
      style={{ minHeight: `${height}px`, width: `${width}px` }}
    />
  );
}
