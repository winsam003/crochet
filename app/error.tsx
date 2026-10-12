"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="page-shell empty-state">
      <h1>잠시 도안을 불러오지 못했어요.</h1>
      <p>연결을 확인하고 다시 시도해 주세요.</p>
      <button className="primary-button" onClick={reset}>
        다시 시도
      </button>
      <Link className="text-link" href="/">
        도안 찾기로 돌아가기
      </Link>
    </div>
  );
}
