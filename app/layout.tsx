import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={`${inter.className} bg-stone-50 text-stone-900`}
        suppressHydrationWarning
      >
        {/* Header: 모든 페이지 공통 */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              🧶 WinSam Crochet
            </Link>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="min-h-screen">{children}</main>

        {/* Footer: 하단 공통 */}
        <footer className="border-t bg-white py-12">
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
