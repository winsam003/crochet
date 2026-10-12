import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page-shell empty-state">
      <p className="eyebrow">404</p>
      <h1>이 도안을 찾을 수 없어요.</h1>
      <p>주소가 바뀌었거나 더 이상 제공되지 않는 도안일 수 있어요.</p>
      <Link href="/" className="primary-button">
        다른 도안 찾아보기
      </Link>
    </div>
  );
}
