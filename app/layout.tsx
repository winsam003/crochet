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
        <footer className="border-t bg-white py-8">
          <div className="container mx-auto px-4 text-center text-sm text-stone-500">
            © 2026 WinSam Crochet. Powered by Ravelry API
          </div>
        </footer>
      </body>
    </html>
  );
}
