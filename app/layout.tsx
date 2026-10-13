import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { Bookmark, MoveUpRight } from "lucide-react";
import { Analytics } from "@vercel/analytics/next";
import AdSlot from "@/components/AdSlot";
export const metadata: Metadata = {
  title: { default: "WinSam Crochet — 다음에 뜰 것을 찾아요", template: "%s · WinSam Crochet" },
  description:
    "해외 뜨개 도안을 한국어로 찾아보세요. 도안 언어와 형식, 실과 바늘, 무료 제공·구매 경로까지 한눈에.",
  openGraph: {
    title: "WinSam Crochet",
    description: "마음에 드는 도안부터 준비할 실과 바늘까지.",
    url: "https://crochet.winsam.xyz",
    locale: "ko_KR",
    type: "website",
  },
  verification: {
    google: "RNkeSZzWbR8T4Pp_OTNspdHciimBargpK1SBOpatEyY",
    other: { "naver-site-verification": "3afbf9d6c09fc55895f2273c277d6c41dafa7ada" },
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <a href="#main" className="skip-link">
          본문으로 건너뛰기
        </a>
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="wordmark" aria-label="WinSam Crochet 홈">
              winsam<span>crochet</span>
              <i>✳</i>
            </Link>
            <nav aria-label="주 메뉴">
              <Link href="/">도안 찾기</Link>
              <Link href="/guide">뜨개 길잡이</Link>
              <Link href="/saved" className="saved-nav">
                <Bookmark size={16} />내 도안함
              </Link>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <AdSlot footer />
        <footer className="site-footer">
          <div className="footer-inner">
            <div>
              <Link href="/" className="footer-brand">
                winsam crochet
              </Link>
              <p>좋아하는 것을, 나의 속도로 뜨는 시간.</p>
            </div>
            <div>
              <p>도안 정보와 사진은 Ravelry 및 각 작가에게서 제공됩니다.</p>
              <p>제공 여부와 가격은 원문에서 확인해 주세요.</p>
              <a href="https://www.ravelry.com" target="_blank" rel="noopener noreferrer">
                Powered by Ravelry <MoveUpRight size={12} />
              </a>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
