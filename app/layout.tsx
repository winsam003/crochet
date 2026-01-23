// layout.tsx

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import AdFit from "@/lib/Adfit";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <meta
        name="google-site-verification"
        content="RNkeSZzWbR8T4Pp_OTNspdHciimBargpK1SBOpatEyY"
      />
      <meta
        name="naver-site-verification"
        content="3afbf9d6c09fc55895f2273c277d6c41dafa7ada"
      />
      <body
        className={`${inter.className} bg-stone-50 text-stone-900`}
        suppressHydrationWarning
      >
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              🧶 WinSam Crochet
            </Link>
          </div>
        </header>

        <div className="flex justify-center w-full relative">
          {/* items-stretch를 통해 aside가 main의 높이만큼 길어집니다. */}
          <div className="relative flex items-stretch gap-8 py-8 w-full justify-center">
            {/* [좌측 광고] aside는 기둥 역할을 합니다. */}
            <aside className="hidden 2xl:block w-[160px]">
              {/* 실제 움직이는 것은 이 div입니다. */}
              <div className="sticky top-24 w-[160px] h-[600px] bg-white border border-stone-200 rounded-3xl flex items-center justify-center text-[10px] text-stone-300 shadow-sm font-bold">
                <AdFit unit="DAN-h19L3JpqEVNOWZtk" width="160" height="600" />
              </div>
            </aside>

            {/* [중앙 콘텐츠] */}
            <main className="w-full max-w-5xl px-4 sm:px-6 shrink-0">
              {children}
            </main>

            {/* [우측 광고] */}
            <aside className="hidden 2xl:block w-[160px]">
              {/* 실제 움직이는 것은 이 div입니다. */}
              <div className="sticky top-24 w-[160px] h-[600px] bg-white border border-stone-200 rounded-3xl flex items-center justify-center text-[10px] text-stone-300 shadow-sm font-bold">
                <AdFit unit="DAN-7Wqj3cnxmklPlmCw" width="160" height="600" />
              </div>
            </aside>
          </div>
        </div>

        {/* [NEW] 2.5 중단 배너 광고 섹션 - 300x250 최적화 */}
        <div className="w-full flex justify-center py-2">
          <div className="w-[300px] h-[250px] bg-white border border-stone-200 rounded-2xl flex flex-col items-center justify-center shadow-sm overflow-hidden relative group">
            {/* 광고 라벨 (애드핏 정책상 있으면 좋음) */}
            <span className="absolute top-2 right-3 text-[9px] text-stone-300 font-bold tracking-widest uppercase">
              ADVERTISEMENT
            </span>

            <div className="w-full h-full flex items-center justify-center text-[11px] text-stone-400 font-bold bg-stone-50/50">
              {/* 여기에 카카오 애드핏 300x250 스크립트 삽입 */}
              <AdFit unit="DAN-Isg7W9GyLwQgmWcF" width="300" height="250" />
            </div>
          </div>
        </div>

        <footer className="border-t bg-white py-12 relative z-10">
          <div className="container mx-auto px-4 text-center space-y-3">
            <p className="text-sm font-bold text-stone-700">WinSam Crochet</p>
            <div className="text-xs text-stone-500 space-y-1 leading-relaxed">
              <p>
                이 서비스는 세계 최대 뜨개질 커뮤니티인{" "}
                <span className="font-semibold">Ravelry</span>의 데이터를
                기반으로 합니다.
              </p>
              <p className="text-stone-400">
                대부분의 도안 정보가{" "}
                <span className="text-amber-600 font-medium">
                  영문으로 제공
                </span>
                되는 점 참고 부탁드립니다.
              </p>
            </div>
            <div className="pt-4 text-[10px] text-stone-300 uppercase tracking-widest">
              © 2026 WinSam Crochet. Powered by Ravelry API
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
