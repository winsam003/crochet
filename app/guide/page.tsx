import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "뜨개 길잡이 · 영문 도안 읽는 법",
  "레이블리 도안 받는 방법부터 실과 바늘, 게이지, 미국식·영국식 코바늘 약어까지 알아보세요.",
  "/guide",
);
export default function GuidePage() {
  return (
    <div className="page-shell guide-page">
      <div className="page-title">
        <p className="eyebrow accent">A SMALL COMPANION</p>
        <h1>첫 코를 뜨기 전에.</h1>
        <p>영문 도안에서 자주 만나는 말들을 풀어두었어요.</p>
      </div>
      <div className="guide-layout">
        <nav aria-label="길잡이 목차">
          <a href="#download">01 도안 받기</a>
          <a href="#yarn">02 실과 바늘</a>
          <a href="#gauge">03 게이지</a>
          <a href="#terms">04 코바늘 약어</a>
        </nav>
        <div>
          <section id="download">
            <span className="guide-number">01</span>
            <h2>무료 도안도, 받는 곳은 달라요.</h2>
            <p>
              어떤 도안은 Ravelry에서 파일로 받고, 어떤 도안은 작가의 블로그에서 읽어요. 웹에서는
              무료로 읽을 수 있지만 PDF 파일은 유료인 경우도 있어요.
            </p>
            <p>
              상세 페이지의 제공 방법을 먼저 확인하고, 이동한 사이트에서 언어와 가격을 한 번 더
              살펴보세요. 책이나 잡지에 실린 도안은 해당 출처를 찾아야 합니다.
            </p>
            <Link href="/free-patterns" className="text-link">
              레이블리 무료 도안 보기 <ArrowUpRight size={14} />
            </Link>
          </section>
          <section id="yarn">
            <span className="guide-number">02</span>
            <h2>실 이름보다, 굵기와 길이를 먼저.</h2>
            <p>
              Fingering, DK, Worsted는 실의 굵기를 나타내는 이름이에요. 같은 굵기 분류라도 소재와
              꼬임에 따라 완성 느낌이 달라지므로, 권장 실과 게이지를 함께 확인하세요.
            </p>
            <p>
              해외 실을 국내 실로 바꿀 때는 ‘몇 볼’보다 필요한 길이(m)를 비교해 보세요. 같은
              50g이라도 실의 길이는 다를 수 있어요. 바늘은 호수보다 mm 표기를 기준으로 고르면 혼동을
              줄일 수 있어요.
            </p>
            <div className="guide-callout">
              상세 페이지의 실 소요량은 여러 사이즈의 범위일 수 있어요. 내가 뜰 사이즈의 소요량은
              실제 도안에서 확인하세요.
            </div>
          </section>
          <AdSlot />
          <section id="gauge">
            <span className="guide-number">03</span>
            <h2>게이지는 크기를 맞추는 작은 연습.</h2>
            <p>
              ‘22 stitches × 30 rows / 4 inches’는 약 10cm 안에 22코와 30단이 들어간다는 뜻이에요.
              도안에 적힌 무늬와 바늘로 작은 편물을 떠서, 같은 크기 안에 몇 코가 들어가는지
              확인합니다.
            </p>
            <p>
              실과 바늘이 같아도 손의 힘에 따라 결과가 달라질 수 있어요. 특히 옷은 도안에서 안내하는
              세탁·블로킹 방법까지 따라 게이지를 확인한 뒤 시작하세요.
            </p>
          </section>
          <section id="terms">
            <span className="guide-number">04</span>
            <h2>같은 약어, 다른 코일 수 있어요.</h2>
            <p>
              코바늘 도안은 미국식(US)과 영국식(UK)의 약어가 달라요. 도안 첫 부분의 표기 기준을 먼저
              확인하세요.
            </p>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>한국어</th>
                    <th>미국식 US</th>
                    <th>영국식 UK</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>사슬뜨기</td>
                    <td>ch</td>
                    <td>ch</td>
                  </tr>
                  <tr>
                    <td>빼뜨기</td>
                    <td>sl st</td>
                    <td>ss / sl st</td>
                  </tr>
                  <tr>
                    <td>짧은뜨기</td>
                    <td>sc</td>
                    <td>dc</td>
                  </tr>
                  <tr>
                    <td>긴뜨기</td>
                    <td>hdc</td>
                    <td>htr</td>
                  </tr>
                  <tr>
                    <td>한길긴뜨기</td>
                    <td>dc</td>
                    <td>tr</td>
                  </tr>
                  <tr>
                    <td>두길긴뜨기</td>
                    <td>tr</td>
                    <td>dtr</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              inc는 코 늘리기, dec는 코 줄이기, rep는 반복을 뜻해요. 세부 방법과 반복 횟수는 각
              도안의 약어 설명을 우선해서 읽으세요.
            </p>
            <a
              className="text-link"
              href="https://www.craftyarncouncil.com/standards/crochet-abbreviations"
              target="_blank"
              rel="noopener noreferrer"
            >
              Craft Yarn Council 약어 기준 <ArrowUpRight size={14} />
            </a>
          </section>
          <Link href="/" className="primary-button">
            이제 도안을 찾아볼까요? <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
