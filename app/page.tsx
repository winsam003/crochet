// app/page.tsx

import { getPatterns } from "@/lib/ravelry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Link from "next/link";
import AdFit from "@/lib/Adfit";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    query?: string;
    free?: string;
    category?: string;
    sort?: string;
    craft?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentQuery = params.query || "";
  const freeFilter = params.free || "";
  const categoryFilter = params.category || "";
  const sortFilter = params.sort || "best";
  const craftFilter = params.craft || "crochet";

  const data = await getPatterns(
    currentQuery,
    currentPage,
    freeFilter,
    categoryFilter,
    sortFilter,
    craftFilter,
  );
  const patterns = data.patterns || [];
  const paginator = data.paginator;
  const totalPages = paginator?.page_count || 1;
  const totalResults = paginator?.results || 0;

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    const pages = [];
    for (let i = start; i <= end; i++) {
      if (i >= 1 && i <= totalPages) pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const getPageUrl = (page: number) => {
    const urlParams = new URLSearchParams({
      query: currentQuery,
      page: page.toString(),
      craft: craftFilter,
      ...(freeFilter && { free: freeFilter }),
      ...(categoryFilter && { category: categoryFilter }),
      ...(sortFilter && { sort: sortFilter }),
    });
    return `/?${urlParams.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 max-w-6xl">
      {/* 1. 배너 섹션: 폰트 두께와 간격 미세 조정 */}
      <section className="text-center py-16 bg-stone-50 rounded-[3rem] space-y-4 border border-stone-100 shadow-sm">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-stone-900">
          WinSam Crochet
        </h1>
        <p className="text-stone-500 max-w-2xl mx-auto text-lg font-medium italic">
          "전 세계의 예쁜 코바늘 도안을 한눈에"
        </p>
      </section>

      {/* 2. 필터 및 검색 섹션: 레이아웃 그룹화 및 정렬 최적화 */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm space-y-8">
        <form action="/" method="GET" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            {/* 카테고리 셀렉트 */}
            {/* [추가] 4. 공예 종류 선택 (코바늘/대바늘) - 2컬럼 할당 */}
            <div className="lg:col-span-2 space-y-2">
              <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1">
                공예
              </label>
              <select
                name="craft"
                defaultValue={craftFilter}
                className="w-full h-12 px-4 rounded-2xl border border-stone-100 bg-stone-50 text-sm font-bold text-stone-700 outline-none focus:ring-2 focus:ring-stone-200 shadow-sm cursor-pointer"
              >
                <option value="crochet">🧶 코바늘</option>
                <option value="knitting">🥢 대바늘</option>
              </select>
            </div>
            <div className="lg:col-span-3 space-y-2">
              <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <Filter className="w-3 h-3" /> 종류
              </label>
              <select
                name="category"
                defaultValue={categoryFilter}
                className="w-full h-12 px-4 rounded-2xl border border-stone-100 bg-stone-50 text-sm font-bold text-stone-700 outline-none focus:ring-2 focus:ring-stone-200 transition-all cursor-pointer appearance-none shadow-sm"
              >
                <option value="">모든 카테고리</option>
                <option value="softies">🧸 인형/아미구루미</option>
                <option value="accessories">🧣 목도리/기타소품</option>
                <option value="clothing">🧶 의류 (스웨터/탑)</option>
                <option value="bag">👜 가방/파우치</option>
                <option value="hat">👒 모자/비니</option>
                <option value="hands">🧤 장갑/핸드워머</option>
                <option value="socks">🧦 양말/신발</option>
                <option value="home">🏠 홈데코/인테리어</option>
                <option value="pet">🐾 반려동물 용품</option>
              </select>
            </div>

            {/* 가격/정렬 셀렉트 */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1">
                  가격
                </label>
                <select
                  name="free"
                  defaultValue={freeFilter}
                  className="w-full h-12 px-4 rounded-2xl border border-stone-100 bg-stone-50 text-sm font-bold text-stone-700 outline-none focus:ring-2 focus:ring-stone-200 shadow-sm cursor-pointer"
                >
                  <option value="">전체 도안</option>
                  <option value="free">무료</option>
                  <option value="online">유료</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1">
                  정렬
                </label>
                <select
                  name="sort"
                  defaultValue={sortFilter}
                  className="w-full h-12 px-4 rounded-2xl border border-stone-100 bg-stone-50 text-sm font-bold text-stone-700 outline-none focus:ring-2 focus:ring-stone-200 shadow-sm cursor-pointer"
                >
                  <option value="best">추천순</option>
                  <option value="favorites">좋아요순</option>
                  <option value="rating">별점순</option>
                  <option value="difficulty">난이도순</option>
                  <option value="popular">인기순</option>
                  <option value="projects">작품순</option>
                  <option value="recently-popular">최신유행</option>
                  <option value="created_at">최신 등록순</option>
                </select>
              </div>
            </div>

            {/* 검색창 및 버튼 */}
            <div className="lg:col-span-12 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  name="query"
                  defaultValue={currentQuery}
                  placeholder="영문 검색 (예: Totoro, Bag)"
                  className="h-12 pl-11 pr-4 border-stone-100 bg-stone-50 rounded-2xl focus:ring-stone-200 shadow-sm font-medium"
                />
              </div>
              <Button
                type="submit"
                className="h-12 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl px-8 font-black transition-all shadow-md active:scale-95"
              >
                검색
              </Button>
            </div>
          </div>
        </form>

        <div className="flex justify-between items-center pt-4 border-t border-stone-50">
          <p className="text-sm font-bold text-stone-500">
            총 <span className="text-stone-900">{totalResults.toLocaleString()}</span>
            개의 결과
          </p>
          <Badge
            variant="outline"
            className="rounded-full border-stone-200 text-stone-400 px-3 py-1 font-bold"
          >
            Page {currentPage} of {totalPages}
          </Badge>
        </div>
      </div>

      {/* [NEW] 2.5 중단 배너 광고 섹션 - 300x250 최적화 */}
      <div className="w-full flex justify-center py-2">
        <div className="w-[300px] h-[250px] bg-white border border-stone-200 flex flex-col items-center justify-center shadow-sm relative group">
          {/* 광고 라벨 (애드핏 정책상 있으면 좋음) */}
          <span className="absolute top-2 right-3 text-[9px] text-stone-300 font-bold tracking-widest uppercase">
            ADVERTISEMENT
          </span>

          <div className="w-full h-full flex items-center justify-center text-[11px] text-stone-400 font-bold bg-stone-50/50">
            {/* 여기에 카카오 애드핏 300x250 스크립트 삽입 */}
            <AdFit unit="DAN-kS3c01Bcu5rrcqvI" width="300" height="250" />
          </div>
        </div>
      </div>

      {/* 3. 도안 그리드: 카드 디자인 정교화 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {patterns.map((pattern: any) => (
          <Card
            key={pattern.id}
            className="group border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-stone-100"
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={pattern.first_photo?.medium_url || "/api/placeholder/400/400"}
                alt={pattern.name}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
              />
              <Badge
                className={`absolute top-6 right-6 shadow-lg px-4 py-1.5 rounded-full font-black border-none ${pattern.free ? "bg-green-600 text-white" : "bg-blue-600 text-white"}`}
              >
                {pattern.free ? "무료" : "유료"}
              </Badge>
            </div>
            <CardHeader className="p-7 pb-3 space-y-1">
              <CardTitle className="text-xl font-black line-clamp-1 text-stone-800 tracking-tight leading-tight">
                {pattern.name}
              </CardTitle>
              <p className="text-sm text-stone-400 font-bold tracking-tight italic">
                by {pattern.designer?.name || "Unknown"}
              </p>
            </CardHeader>
            <CardContent className="p-7 pt-0">
              <div className="flex justify-between items-center pt-5 border-t border-stone-50">
                <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest truncate max-w-[130px]">
                  {pattern.pattern_sources?.[0]?.name || "Ravelry"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-stone-200 text-stone-800 font-bold hover:bg-stone-900 hover:text-white transition-all px-5 h-9"
                  asChild
                >
                  <Link href={`/pattern/${pattern.id}`}>상세보기</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 4. 페이지네이션: 버튼 크기 및 폰트 조정 */}
      <div className="flex flex-col items-center gap-6 py-16">
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
            className="rounded-full w-12 h-12 border-stone-200 hover:bg-stone-50"
          >
            <Link href={getPageUrl(currentPage - 1)}>
              <ChevronLeft className="h-5 w-5 text-stone-600" />
            </Link>
          </Button>
          <div className="flex items-center gap-1.5">
            {pageNumbers.map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? "default" : "ghost"}
                size="sm"
                className={`w-12 h-12 rounded-full font-black text-base transition-all ${pageNum === currentPage ? "bg-stone-900 text-white shadow-lg scale-110" : "text-stone-400 hover:bg-stone-100"}`}
                asChild
              >
                <Link href={getPageUrl(pageNum)}>{pageNum}</Link>
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
            className="rounded-full w-12 h-12 border-stone-200 hover:bg-stone-50"
          >
            <Link href={getPageUrl(currentPage + 1)}>
              <ChevronRight className="h-5 w-5 text-stone-600" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
