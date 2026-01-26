import { getPatternDetail } from "@/lib/ravelry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Scissors, Ruler, Star, Heart, Languages } from "lucide-react";
import Link from "next/link";
import AdFit from "@/lib/Adfit";
import RelatedPatterns from "@/components/RelatedPatterns";

export default async function PatternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pattern = await getPatternDetail(id);

  // API 응답 구조에 맞게 데이터 추출 (Ravelry 상세 API 기준)
  const category = pattern.pattern_categories?.[0]?.permalink || "";
  const craft = pattern.craft?.permalink || "crochet";
  const weight = pattern.yarn_weight?.slug || "";

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 bg-stone-50/50 min-h-screen">
      {/* 상단 뒤로가기 */}
      <Button variant="ghost" asChild className="hover:bg-stone-200">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" /> 도안 목록으로 돌아가기
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 왼쪽: 이미지 갤러리 */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src={pattern.photos[0]?.medium2_url}
              alt={pattern.name}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {pattern.photos.slice(1, 4).map((photo: any) => (
              <div
                key={photo.id}
                className="rounded-xl overflow-hidden border-2 border-white shadow-sm aspect-square"
              >
                <img src={photo.small_url} alt="sub" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 상세 정보 */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-stone-800 uppercase tracking-widest text-[10px]">
                {/* 도안 타입 한글화: Toys -> 인형/소품 등 */}
                {pattern.pattern_type.name === "Toys" ? "인형/소품" : pattern.pattern_type.name}
              </Badge>
              {pattern.free ? (
                <Badge className="bg-green-600">무료 도안</Badge>
              ) : (
                <Badge className="bg-blue-600">유료 도안</Badge>
              )}
            </div>
            <h1 className="text-4xl font-black text-stone-900 leading-tight">{pattern.name}</h1>
            <p className="text-stone-500 font-medium">
              디자이너:{" "}
              <span className="text-stone-800 border-b border-stone-300">
                {pattern.pattern_author.name}
              </span>
            </p>
          </div>

          {/* 핵심 스펙 카드 (한글 레이블) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center space-y-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs text-stone-400 font-bold uppercase">난이도</span>
              <span className="text-lg font-black text-stone-800">
                {pattern.difficulty_average?.toFixed(1) || "N/A"}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center space-y-1">
              <Ruler className="w-4 h-4 text-stone-400" />
              <span className="text-xs text-stone-400 font-bold uppercase">바늘 크기</span>
              <span className="text-lg font-black text-stone-800">
                {pattern.pattern_needle_sizes[0]?.metric}mm
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center space-y-1">
              <Scissors className="w-4 h-4 text-stone-400" />
              <span className="text-xs text-stone-400 font-bold uppercase">실 굵기</span>
              <span className="text-[13px] font-black text-stone-800 text-center leading-tight">
                {pattern.yarn_weight_description}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center space-y-1">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <span className="text-xs text-stone-400 font-bold uppercase">좋아요</span>
              <span className="text-lg font-black text-stone-800">{pattern.favorites_count}</span>
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
          {/* 도안 설명 섹션 */}
          <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
            <div className="bg-stone-900 p-4 text-white flex justify-between items-center">
              <span className="font-bold flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                도안 상세 설명
              </span>

              {/* 구글 번역기 버튼 추가 */}
              {pattern.notes && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white text-[11px] h-7"
                >
                  <a
                    href={`https://translate.google.com/?sl=en&tl=ko&text=${encodeURIComponent(
                      pattern.notes,
                    )}&op=translate`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Languages className="mr-1.5 h-3 w-3" /> 구글번역기로 번역하기
                  </a>
                </Button>
              )}
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="bg-stone-50 p-6 rounded-2xl text-stone-600 text-sm leading-relaxed whitespace-pre-wrap border border-stone-100">
                  {pattern.notes || "등록된 설명이 없습니다."}
                </div>
              </div>

              {/* 상황별 다운로드/안내 버튼 */}
              {pattern.free ? (
                <Button
                  asChild
                  className="w-full py-8 rounded-2xl bg-green-600 hover:bg-green-700 text-white text-xl font-bold shadow-lg transition-all hover:-translate-y-1"
                >
                  <a
                    href={pattern.download_location?.url || pattern.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🪄 도안 확인하기
                  </a>
                </Button>
              ) : (
                <Button
                  disabled
                  className="w-full py-8 rounded-2xl bg-stone-200 text-stone-500 text-xl font-bold shadow-none"
                >
                  🔒 유료 도안입니다 (구매 필요)
                </Button>
              )}

              <p className="text-center text-xs text-stone-400 leading-relaxed">
                {pattern.free ? (
                  <>
                    * 버튼을 누르면 Ravelry 다운로드 페이지로 이동합니다.
                    <br />
                    <span className="text-amber-600 font-medium">
                      (주의: 디자이너의 설정에 따라 무료 기간이 종료되어 유료로 전환되었을 수 있으니
                      이동 후 무료 여부를 꼭 확인하세요!)
                    </span>
                  </>
                ) : (
                  "* 이 도안은 유료이므로 Ravelry에서 별도 구매가 필요합니다."
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* --- 연관 도안 섹션 추가 --- */}
      <hr className="border-stone-200 mt-12" />
      <RelatedPatterns category={category} craft={craft} weight={weight} />
    </div>
  );
}
