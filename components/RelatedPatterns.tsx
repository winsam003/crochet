// components/RelatedPatterns.tsx
import Link from "next/link";
import { getRelatedPatterns } from "@/lib/ravelry";

interface Props {
  category: string;
  craft: string;
  weight: string;
}

export default async function RelatedPatterns({ category, craft, weight }: Props) {
  // 연관 데이터 가져오기
  const related = await getRelatedPatterns(category, craft, weight);

  if (!related || related.length === 0) return null;

  return (
    <div className="mt-16 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-stone-900">비슷한 느낌의 도안들</h2>
        <span className="text-sm text-stone-400 font-medium">옆으로 밀어서 보기 →</span>
      </div>

      {/* 가로 스크롤 컨테이너 */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {related.map((item: any) => (
          <Link
            key={item.id}
            href={`/pattern/${item.id}`} // 본인의 라우팅 구조에 맞게 수정
            className="flex-none w-40 sm:w-48 group"
          >
            <div className="space-y-3">
              {/* 이미지 카드 */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border-2 border-white transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                <img
                  // 기존: item.first_photo?.square_url || item.first_photo?.small_url
                  // 수정: 더 큰 사이즈인 medium_url 또는 medium2_url 사용
                  src={
                    item.first_photo?.medium_url ||
                    item.first_photo?.medium2_url ||
                    item.first_photo?.small_url
                  }
                  alt={item.name}
                  className="w-full h-full object-cover"
                  // 팁: Next.js Image 컴포넌트를 안 쓴다면 loading="lazy"라도 넣어주는 게 좋습니다.
                  loading="lazy"
                />
                {item.free && (
                  <span className="absolute top-2 right-2 bg-green-500 text-[10px] text-white px-2 py-0.5 rounded-full font-bold">
                    무료
                  </span>
                )}
              </div>

              {/* 텍스트 정보 */}
              <div className="px-1">
                <p className="text-sm font-bold text-stone-800 truncate group-hover:text-stone-600">
                  {item.name}
                </p>
                <p className="text-xs text-stone-400 truncate">by {item.designer.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
