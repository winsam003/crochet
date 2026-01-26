// components/HotPatterns.tsx
import { getHotPatterns } from "@/lib/ravelry";
import Link from "next/link";

interface HotPatternsProps {
  category?: string;
  craft?: string;
  searchParams: { [key: string]: string | undefined };
}

const HOT_CATEGORIES = [
  { name: "전체", slug: "" },
  { name: "의류", slug: "clothing" },
  { name: "모자", slug: "hat" },
  { name: "인형", slug: "softies" },
  { name: "가방", slug: "bag" },
];

export default async function HotPatterns({
  category = "",
  craft = "crochet",
  searchParams,
}: HotPatternsProps) {
  const hotPatterns = await getHotPatterns(category, craft);

  if (!hotPatterns.length) return null;

  // hot_cat 또는 craft만 쏙 바꿔주는 기특한 함수
  const getUpdateHref = (key: "hot_cat" | "craft", value: string) => {
    const newParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") newParams.set(k, v);
    });

    if (value) newParams.set(key, value);
    else newParams.delete(key);

    return `/?${newParams.toString()}`;
  };

  return (
    <div className="py-10 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-2">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-2xl shadow-inner ${craft === "crochet" ? "bg-orange-100" : "bg-blue-100"}`}
          >
            <span className="text-2xl">{craft === "crochet" ? "🧶" : "🥢"}</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-stone-900 leading-none tracking-tight">
              Trending
            </h2>
            <p className="text-[11px] text-stone-400 font-bold mt-1 uppercase tracking-widest">
              실시간 인기 차트
            </p>
          </div>
        </div>

        {/* --- 여기 버튼들이 모여있는 곳입니다 --- */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. 코바늘/대바늘 스위치 버튼 */}
          <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200">
            <Link
              href={getUpdateHref("craft", "crochet")}
              scroll={false}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                craft === "crochet" ? "bg-white text-orange-600 shadow-sm" : "text-stone-400"
              }`}
            >
              코바늘
            </Link>
            <Link
              href={getUpdateHref("craft", "knitting")}
              scroll={false}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                craft === "knitting" ? "bg-white text-blue-600 shadow-sm" : "text-stone-400"
              }`}
            >
              대바늘
            </Link>
          </div>

          {/* 2. 기존 카테고리 탭 */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide bg-stone-50 p-1 rounded-2xl border border-stone-100">
            {HOT_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={getUpdateHref("hot_cat", cat.slug)}
                scroll={false}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  category === cat.slug
                    ? "bg-stone-900 text-white shadow-md"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* --- 카드 리스트 부분 --- */}
      <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {hotPatterns.map((pattern: any, index: number) => (
          <Link
            key={pattern.id}
            href={`/pattern/${pattern.id}`}
            className="flex-none w-64 group relative"
          >
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-stone-900 w-8 h-8 rounded-full flex items-center justify-center font-black shadow-lg border border-stone-100 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              {index + 1}
            </div>
            <div className="space-y-4">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
                <img
                  src={pattern.first_photo?.medium2_url || pattern.first_photo?.medium_url}
                  alt={pattern.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="px-2">
                <h3 className="font-bold text-stone-900 truncate group-hover:text-orange-600 transition-colors">
                  {pattern.name}
                </h3>
                <p className="text-xs text-stone-400 font-medium mt-0.5">
                  by {pattern.designer.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
