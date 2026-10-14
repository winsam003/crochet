import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import PatternCard from "@/components/PatternCard";
import { getPatterns } from "@/lib/ravelry";
import { CATEGORIES, SORTS, interpretSearch } from "@/lib/patterns";
import { pageMetadata } from "@/lib/seo";

const collections = [
  { key: "all", label: "전체", params: {} },
  { key: "korean", label: "한국어 도안", params: { language: "kr" } },
  { key: "chart", label: "기호 도안", params: { format: "chart" } },
  { key: "easy", label: "쉬운 도안", params: { difficulty: "easy" } },
] as const;
const freeSorts = SORTS.filter(([key]) => key !== "best");

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function selection(raw: Awaited<Props["searchParams"]>) {
  const collection = collections.find((item) => item.key === raw.collection) || collections[0];
  const craft = raw.craft === "knitting" ? "knitting" : "crochet";
  const { page, category } = interpretSearch({
    page: typeof raw.page === "string" ? raw.page : undefined,
    category: typeof raw.category === "string" ? raw.category : undefined,
  });
  const sort = freeSorts.find(([key]) => key === raw.sort)?.[0] || "projects";
  return { collection, craft, page, category, sort };
}

function collectionUrl(
  craft: string,
  collection: string,
  category: string,
  sort: string,
  page = 1,
) {
  const params = new URLSearchParams();
  if (craft !== "crochet") params.set("craft", craft);
  if (collection !== "all") params.set("collection", collection);
  if (category) params.set("category", category);
  if (sort !== "projects") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  return `/free-patterns${params.size ? `?${params}` : ""}`;
}

export async function generateMetadata({ searchParams }: Props) {
  const { collection, craft, page, category, sort } = selection(await searchParams);
  const suffix = `${craft === "knitting" ? " · 대바늘" : ""}${collection.key !== "all" ? ` · ${collection.label}` : ""}${category ? ` · ${CATEGORIES.find(([id]) => id === category)?.[1]}` : ""}${page > 1 ? ` · ${page}페이지` : ""}`;
  return pageMetadata(
    `레이블리(Ravelry) 무료 도안 보기${suffix}`,
    "레이블리 무료 코바늘·대바늘 도안을 찾아보세요. 한국어, 기호 도안, 쉬운 도안을 골라 무료 웹 도안과 다운로드 제공처를 확인할 수 있어요.",
    collectionUrl(craft, collection.key, category, sort, page),
  );
}

export default async function FreePatternsPage({ searchParams }: Props) {
  const { collection, craft, page, category, sort } = selection(await searchParams);
  const returnTo = collectionUrl(craft, collection.key, category, sort, page);
  let data;
  try {
    data = await getPatterns({
      ...collection.params,
      craft,
      category,
      sort,
      free: "free",
      page: String(page),
    });
  } catch {
    // Keep the guide and selected filters available during an API outage.
  }
  const totalPages = Math.min(1000, data?.paginator.page_count || 1);
  const firstPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const visiblePages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => firstPage + index,
  );
  return (
    <div className="page-shell free-patterns-page">
      <header className="page-title">
        <p className="eyebrow accent">FIND YOUR NEXT FREE PATTERN</p>
        <h1>레이블리 무료 도안 보기</h1>
        <p>
          Ravelry(레이블리)에 등록된 무료 뜨개 도안을 모았어요.
          <br />
          마음에 드는 작품을 고르고, 언어와 받는 방법을 확인해 보세요.
        </p>
        <a href="#how-to-read" className="text-link">
          무료 도안은 어디서 보나요? <ArrowUpRight size={15} />
        </a>
      </header>
      <section id="results" className="results-section" aria-labelledby="free-results-title">
        <nav className="free-filters" aria-label="뜨개 종류">
          {[
            ["crochet", "코바늘"],
            ["knitting", "대바늘"],
          ].map(([value, label]) => (
            <Link
              key={value}
              href={`${collectionUrl(value, collection.key, category, sort)}#results`}
              aria-current={craft === value ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="free-category-group">
          <p className="free-filter-label">어떤 작품을 만들어 볼까요?</p>
          <nav className="free-filters free-category-filters" aria-label="도안 종류">
            {CATEGORIES.map(([value, label]) => (
              <Link
                key={value}
                href={`${collectionUrl(craft, collection.key, value, sort)}#results`}
                aria-current={category === value ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <nav className="free-filters" aria-label="무료 도안 조건">
          {collections.map((item) => (
            <Link
              key={item.key}
              href={`${collectionUrl(craft, item.key, category, sort)}#results`}
              aria-current={collection.key === item.key ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="free-category-group">
          <p className="free-filter-label">정렬 기준</p>
          <nav className="free-filters free-category-filters" aria-label="무료 도안 정렬">
            {freeSorts.map(([value, label]) => (
              <Link
                key={value}
                href={`${collectionUrl(craft, collection.key, category, value)}#results`}
                aria-current={sort === value ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="section-heading">
          <div>
            <h2 id="free-results-title">
              {craft === "crochet" ? "코바늘" : "대바늘"} 무료 도안 · {collection.label}
              {category && ` · ${CATEGORIES.find(([id]) => id === category)?.[1]}`}
            </h2>
            <p className="section-note">
              {freeSorts.find(([key]) => key === sort)?.[1]}으로 모았어요.
              {collection.key === "easy" && " 쉬운 도안은 이용자 난이도 평가 1–2를 기준으로 해요."}
            </p>
          </div>
        </div>
        {data?.detailsUnavailable && (
          <p className="notice">
            일부 상세 정보를 불러오지 못했어요. 언어와 무료 제공 범위는 원문에서 확인해 주세요.
          </p>
        )}
        {!data ? (
          <div className="empty-state">
            <h3>잠시 도안을 불러오지 못했어요.</h3>
            <p>선택한 조건으로 다시 불러와 주세요.</p>
            <a href={returnTo} className="primary-button">
              다시 불러오기
            </a>
          </div>
        ) : !data.patterns.length ? (
          <div className="empty-state">
            <h3>이 조건에 맞는 도안이 없어요.</h3>
            <Link href="/free-patterns" className="text-link">
              무료 도안 처음부터 보기
            </Link>
          </div>
        ) : (
          <>
            <div className="pattern-grid">
              {data.patterns.map((pattern, index) => (
                <PatternCard key={pattern.id} pattern={pattern} returnTo={returnTo} index={index} />
              ))}
            </div>
            <nav className="free-pagination" aria-label="무료 도안 페이지">
              {page > 1 ? (
                <Link
                  className="free-pagination-direction"
                  href={`${collectionUrl(craft, collection.key, category, sort, page - 1)}#results`}
                  aria-label="이전 페이지"
                  rel="prev"
                >
                  <ChevronLeft size={16} aria-hidden="true" /> 이전
                </Link>
              ) : (
                <span className="free-pagination-direction" aria-disabled="true">
                  <ChevronLeft size={16} aria-hidden="true" /> 이전
                </span>
              )}
              <div className="free-pagination-numbers">
                {visiblePages.map((number) =>
                  number === page ? (
                    <span
                      key={number}
                      aria-current="page"
                      aria-label={`${number}페이지, 현재 페이지`}
                    >
                      {number}
                    </span>
                  ) : (
                    <Link
                      key={number}
                      href={`${collectionUrl(craft, collection.key, category, sort, number)}#results`}
                      aria-label={`${number}페이지`}
                    >
                      {number}
                    </Link>
                  ),
                )}
              </div>
              {page < totalPages ? (
                <Link
                  className="free-pagination-direction"
                  href={`${collectionUrl(craft, collection.key, category, sort, page + 1)}#results`}
                  aria-label="다음 페이지"
                  rel="next"
                >
                  다음 <ChevronRight size={16} aria-hidden="true" />
                </Link>
              ) : (
                <span className="free-pagination-direction" aria-disabled="true">
                  다음 <ChevronRight size={16} aria-hidden="true" />
                </span>
              )}
              <p className="free-pagination-summary">
                전체 {totalPages.toLocaleString("ko-KR")}페이지 중{" "}
                <strong>{page.toLocaleString("ko-KR")}</strong>페이지
              </p>
            </nav>
          </>
        )}
      </section>
      <section id="how-to-read" className="free-guide" aria-labelledby="free-guide-title">
        <p className="eyebrow accent">FROM FINDING TO MAKING</p>
        <h2 id="free-guide-title">무료 도안, 이렇게 보세요.</h2>
        <ol>
          <li>
            <strong>작품을 골라 상세 페이지를 열어요.</strong>
            <p>
              도안 언어와 형식, 필요한 실과 바늘을 확인하세요. 한국어로 안내하는 사이트이지만 모든
              원문 도안이 한국어인 것은 아니에요.
            </p>
          </li>
          <li>
            <strong>무료 제공 방식을 확인해요.</strong>
            <p>
              ‘무료 Ravelry 다운로드’는 파일 제공, ‘무료 제공 · 웹사이트 확인’은 작가 사이트에서
              읽는 방식이에요. ‘무료 제공 · 다운로드는 유료’라면 무료 웹 도안과 유료 파일을 구분해
              주세요.
            </p>
          </li>
          <li>
            <strong>제공처로 이동해 도안을 읽거나 받아요.</strong>
            <p>
              ‘무료 도안 받으러 가기’ 또는 ‘작가 사이트에서 무료 제공 안내 확인’을 누르세요.
              제공처의 로그인 안내와 현재 가격·언어를 확인한 뒤 이용해 주세요.
            </p>
          </li>
        </ol>
        <p>
          WinSam Crochet는 Ravelry API로 도안 정보를 안내하는 독립 서비스예요. 도안 원문과 파일은
          Ravelry 또는 작가의 사이트에서 제공합니다.
        </p>
        <Link href="/guide" className="text-link">
          영문 도안과 코바늘 약어 읽는 법 <ArrowUpRight size={15} />
        </Link>
      </section>
    </div>
  );
}
