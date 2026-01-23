// app/page.tsx

import { getPatterns } from "@/lib/ravelry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    query?: string;
    free?: string;
    category?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentQuery = params.query || "";
  const freeFilter = params.free || "";
  const categoryFilter = params.category || ""; // 카테고리 값 수신

  // API 호출 시 categoryFilter(pc) 전달
  const data = await getPatterns(
    currentQuery,
    currentPage,
    freeFilter,
    categoryFilter,
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

  // 페이지 이동 시 모든 필터 상태 유지
  const getPageUrl = (page: number) => {
    const urlParams = new URLSearchParams({
      query: currentQuery,
      page: page.toString(),
      ...(freeFilter && { free: freeFilter }),
      ...(categoryFilter && { category: categoryFilter }),
    });
    return `/?${urlParams.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-16 bg-stone-100 rounded-3xl space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900 font-sans">
          WinSam Crochet
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto text-lg italic">
          "Ravelry 기반 코바늘 도안 검색"
        </p>
      </section>

      <div className="space-y-6">
        <form
          action="/"
          method="GET"
          className="flex flex-col md:flex-row w-full max-w-4xl mx-auto items-center gap-3"
        >
          {/* 카테고리 필터 추가 (아기용품 제외) */}
          <select
            name="category"
            defaultValue={categoryFilter}
            className="h-10 px-4 rounded-full border border-stone-200 bg-white text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-400 w-full md:w-44"
          >
            <option value="softies">🧸 인형/아미구루미</option>
            <option value="ornaments">🔑 키링/작은장식</option>
            <option value="clothing">🧶 의류 (스웨터/탑)</option>
            <option value="bag">👜 가방/파우치</option>
            <option value="hat">👒 모자/비니</option>
            <option value="hands">🧤 장갑/핸드워머</option>
            <option value="socks">🧦 양말/신발</option>
            <option value="accessories">🧣 목도리/기타소품</option>
            <option value="home">🏠 홈데코/인테리어</option>
            <option value="pet">🐾 반려동물 용품</option>
          </select>

          <select
            name="free"
            defaultValue={freeFilter}
            className="h-10 px-4 rounded-full border border-stone-200 bg-white text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-400 w-full md:w-40"
          >
            <option value="">전체 도안</option>
            <option value="free">무료 도안</option>
            <option value="online">유료 도안</option>
          </select>

          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              name="query"
              defaultValue={currentQuery}
              placeholder="아이템 검색 (영어로 검색해주세요.)"
              className="pl-10 border-stone-200 focus:ring-stone-400 rounded-full w-full"
            />
          </div>
          <Button
            type="submit"
            className="bg-stone-800 hover:bg-stone-700 rounded-full px-8 w-full md:w-auto"
          >
            검색
          </Button>
        </form>

        <div className="flex justify-between items-end border-b pb-2 border-stone-100 text-stone-600">
          <p className="text-sm font-medium">
            전체{" "}
            <span className="text-stone-900 font-bold">
              {totalResults.toLocaleString()}
            </span>
            개의 도안을 찾았습니다.
          </p>
          <p className="text-xs">
            {currentPage} / {totalPages} 페이지
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {patterns.map((pattern: any) => (
          <Card
            key={pattern.id}
            className="group overflow-hidden border-stone-200 hover:shadow-xl transition-all duration-300 rounded-xl bg-white"
          >
            <div className="aspect-square relative overflow-hidden bg-stone-100">
              <img
                src={
                  pattern.first_photo?.medium_url || "/api/placeholder/400/400"
                }
                alt={pattern.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <Badge
                className={`absolute top-3 right-3 shadow-md ${pattern.free ? "bg-green-600" : "bg-blue-600"}`}
              >
                {pattern.free ? "무료" : "유료"}
              </Badge>
            </div>
            <CardHeader className="p-5 pb-2 space-y-1">
              <CardTitle className="text-lg font-bold line-clamp-1 text-stone-800 tracking-tight group-hover:text-stone-600 transition-colors">
                {pattern.name}
              </CardTitle>
              <div className="flex items-center text-xs text-stone-500 gap-1">
                <span className="font-medium text-stone-400">by</span>
                <span className="font-semibold">
                  {pattern.designer?.name || "Unknown"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400 border-t border-stone-50 pt-3">
                <span className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  STORE
                </span>
                <span className="truncate">
                  {pattern.pattern_sources?.[0]?.name || "Ravelry Store"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <div className="flex items-center space-x-1">
                  <span className="text-amber-500 text-xs">⭐</span>
                  <span className="text-xs font-bold text-stone-400">
                    상세정보 확인
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-stone-300 text-stone-700 hover:bg-stone-900 hover:text-white transition-colors h-8 px-4 rounded-lg text-xs"
                  asChild
                >
                  <Link href={`/pattern/${pattern.id}`}>상세보기</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-4 py-10">
        <div className="flex justify-center items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
            className="rounded-full"
          >
            <Link href={getPageUrl(currentPage - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          {pageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? "default" : "ghost"}
              size="sm"
              className={`w-10 h-10 rounded-full ${pageNum === currentPage ? "bg-stone-800" : "text-stone-600 hover:bg-stone-100"}`}
              asChild
            >
              <Link href={getPageUrl(pageNum)}>{pageNum}</Link>
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
            className="rounded-full"
          >
            <Link href={getPageUrl(currentPage + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="text-sm text-stone-400 font-medium tracking-tight">
          {currentPage} / {totalPages} 페이지
        </p>
      </div>
    </div>
  );
}
