import { LibraryView } from "@/components/Library";
export const metadata = { title: "내 도안함" };
export default function SavedPage() {
  return (
    <div className="page-shell library-page">
      <div className="page-title">
        <p className="eyebrow accent">YOUR LITTLE COLLECTION</p>
        <h1>언젠가 뜨고 싶은 것들.</h1>
        <p>마음에 담아둔 도안과, 방금 살펴본 도안을 다시 만나요.</p>
        <small>이 브라우저에만 저장됩니다. 브라우저 데이터를 지우면 함께 삭제돼요.</small>
      </div>
      <LibraryView />
    </div>
  );
}
