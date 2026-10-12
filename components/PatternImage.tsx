"use client";
import { useState } from "react";
export default function PatternImage({
  src,
  alt,
  eager = false,
}: {
  src?: string;
  alt: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} />
  ) : (
    <div className="image-placeholder">
      <span>사진 준비 중</span>
    </div>
  );
}
