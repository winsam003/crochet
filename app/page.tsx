import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { Fragment, Suspense } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getPatterns } from "@/lib/ravelry";
import { CATEGORIES, SORTS, interpretSearch, searchLink, type SearchParams } from "@/lib/patterns";
import PatternCard from "@/components/PatternCard";
import HotPatterns from "@/components/HotPatterns";
import PopularDesigners from "@/components/PopularDesigners";
import DiscoverPatterns from "@/components/DiscoverPatterns";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = new URLSearchParams();
  for (const key of [
    "query",
    "designer",
    "craft",
    "category",
    "free",
    "language",
    "format",
    "difficulty",
    "sort",
    "page",
    "mode",
  ]) {
    const value = Array.isArray(raw[key]) ? raw[key][0] : raw[key];
    if (value !== undefined) params.set(key, value);
  }
  const s = interpretSearch(Object.fromEntries(params));
  const title = params.size
    ? [
        s.designer,
        s.query,
        s.craft === "knitting" ? "대바늘" : s.craft === "crochet" ? "코바늘" : "뜨개",
        CATEGORIES.find(([id]) => id === s.category && id)?.[1],
        s.availability === "free" ? "무료 도안" : "도안 찾기",
        s.language === "kr" ? "한국어" : s.language,
        s.format === "chart" ? "기호 도안" : s.format,
        s.difficulty ? "쉬운 도안" : "",
        SORTS.find(([id]) => id === s.sort)?.[1],
        s.page > 1 ? `${s.page}페이지` : "",
      ]
        .filter(Boolean)
        .join(" · ")
    : "레이블리 도안 찾기 · 코바늘과 대바늘";
  return pageMetadata(
    title,
    params.size
      ? `${title}. 도안 언어와 형식, 실과 바늘, 무료 제공·구매 경로를 확인하세요.`
      : "Ravelry(레이블리)의 코바늘·대바늘 도안을 한국어로 찾아보세요. 무료 도안, 기호 도안, 실과 바늘, 원문 제공처까지 한눈에.",
    params.size ? `/?${params}` : "/",
  );
}
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params: SearchParams = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
  const s = interpretSearch(params);
  const current = new URLSearchParams(
    Object.entries(params).filter((v): v is [string, string] => typeof v[1] === "string"),
  );
  const returnTo = `/?${current}`;
  const pageUrl = (page: number) => {
    const next = new URLSearchParams(current);
    next.set("page", String(page));
    return `/?${next}#results`;
  };
  const isDiscovery = !Object.values(params).some((value) => value?.trim());
  let data;
  try {
    if (!isDiscovery) data = await getPatterns(params);
  } catch {
    /* Show a recoverable error, never fabricated patterns. */
  }
  const patterns = data?.patterns || [],
    totalPages = data?.paginator.page_count || 1;
  const active = !!(
    s.designer ||
    params.query ||
    params.category ||
    params.free ||
    params.format ||
    params.difficulty ||
    params.language ||
    params.craft ||
    params.sort ||
    params.page
  );
  return (
    <div className="page-shell">
      <section className="home-intro">
        <div>
          <p className="eyebrow accent">A LITTLE TIME, A FEW STITCHES</p>
          <h1>
            다음에 뜰 것은
            <br />
            <em>어떤 모습인가요?</em>
          </h1>
          <p className="intro-description">
            마음에 드는 도안부터 준비할 실과 바늘까지.
            <br />한 코씩 시작할 수 있도록, 함께 살펴보세요.
          </p>
          <Link href="/free-patterns" className="primary-button home-free-link">
            레이블리 무료 도안 보기 <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="intro-note">
          <span className="note-number">01 —</span>
          <p>
            찾고, 살펴보고,
            <br />
            나만의 것으로.
          </p>
          <Link href="/guide">
            영문 도안이 처음이라면 <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <section className="search-section" aria-label="도안 검색">
        <form key={current.toString()} action="/" method="GET">
          <div className="search-main">
            <Search size={22} />
            <label className="sr-only" htmlFor="query">
              찾고 싶은 도안
            </label>
            <input
              id="query"
              name="query"
              defaultValue={params.query || ""}
              placeholder="예: 피카츄 인형, 무료 대바늘 조끼"
              aria-describedby="query-hint"
              maxLength={160}
            />
            <button className="primary-button" type="submit">
              도안 찾기 <ArrowRight size={17} />
            </button>
          </div>
          <p id="query-hint" className="section-note">
            한글 캐릭터 이름과 뜨개 용어를 영어 검색어로 바꿔 찾아요. 등록되지 않은 이름은 그대로
            검색해요. 한글 검색이 한국어 도안만 찾는다는 뜻은 아니에요.
          </p>
          <label className="search-raw-option">
            <input type="checkbox" name="mode" value="raw" defaultChecked={s.raw} />
            검색어를 변환하지 않고 그대로 검색
          </label>
          <div className="designer-search">
            <label htmlFor="designer">작가명</label>
            <input
              id="designer"
              name="designer"
              defaultValue={s.designer}
              placeholder="예: PetiteKnit, Sarah Zimmerman"
              maxLength={160}
              aria-describedby="designer-hint"
            />
            <p id="designer-hint">
              Ravelry에 등록된 작가명을 입력하세요. 뜨개 종류가 자동이면 작가 검색 시 전체를
              보여드려요.
            </p>
          </div>
          <div className="filter-row">
            <label>
              뜨개 종류
              <select name="craft" defaultValue={params.craft || "auto"}>
                <option value="auto">자동 선택 · 기본 코바늘</option>
                <option value="all">전체</option>
                <option value="crochet">코바늘</option>
                <option value="knitting">대바늘</option>
              </select>
            </label>
            <label>
              만들고 싶은 것
              <select name="category" defaultValue={params.category ?? "auto"}>
                <option value="auto">검색어에서 자동 선택</option>
                {CATEGORIES.map(([id, label]) => (
                  <option value={id} key={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              도안 받는 방법
              <select name="free" defaultValue={params.free ?? "auto"}>
                <option value="auto">검색어에서 자동 선택</option>
                <option value="">전체</option>
                <option value="free">무료 제공</option>
                <option value="online">온라인 구매 가능</option>
                <option value="ravelry">Ravelry 다운로드 제공</option>
              </select>
            </label>
            <label>
              도안 언어
              <select name="language" defaultValue={s.language}>
                <option value="">모든 언어</option>
                <option value="kr">한국어 제공</option>
                <option value="en">영어 제공</option>
                <option value="ja">일본어 제공</option>
              </select>
            </label>
            <label>
              도안 형식
              <select name="format" defaultValue={s.format}>
                <option value="">전체 형식</option>
                <option value="chart">기호 도안 포함</option>
                <option value="written-pattern">글로 설명하는 도안</option>
                <option value="video-tutorial">따라 볼 영상 있음</option>
              </select>
            </label>
            <label>
              난이도
              <select name="difficulty" defaultValue={params.difficulty ?? "auto"}>
                <option value="auto">검색어에서 자동 선택</option>
                <option value="">모든 난이도</option>
                <option value="easy">쉬운 편 (평가 1–2)</option>
              </select>
            </label>
            <label>
              정렬
              <select name="sort" defaultValue={s.sort}>
                {SORTS.map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </form>
        <div className="quick-search">
          <span>어디서 시작할까요?</span>
          <Link href="/?craft=crochet&language=kr">
            한국어로 읽는 도안 <ArrowUpRight size={13} />
          </Link>
          <Link href="/?craft=crochet&free=free&format=chart">
            기호 도안이 있는 무료 도안 <ArrowUpRight size={13} />
          </Link>
          <Link href="/?craft=knitting&category=clothing&sort=projects">
            많이 뜬 대바늘 의류 <ArrowUpRight size={13} />
          </Link>
        </div>
        {(params.query || s.designer) && (
          <div className="search-interpretation" aria-live="polite">
            <p>
              검색에 반영한 조건:{" "}
              {s.craft === "crochet"
                ? "코바늘"
                : s.craft === "knitting"
                  ? "대바늘"
                  : "모든 뜨개 종류"}
              {s.designer && ` · 작가 “${s.designer}”`}
              {s.category && ` · ${CATEGORIES.find(([id]) => id === s.category)?.[1]}`}
              {s.difficulty && " · 난이도 평가 1–2 (평가 없는 도안 제외)"}
              {s.availability &&
                ` · ${s.availability === "free" ? "무료" : s.availability === "online" ? "온라인 구매 가능" : "Ravelry 다운로드 제공"}`}
              {s.language &&
                ` · ${s.language === "kr" ? "한국어" : s.language === "en" ? "영어" : "일본어"} 도안`}
              {s.format &&
                ` · ${s.format === "chart" ? "기호 도안" : s.format === "written-pattern" ? "글 도안" : "영상 도안"}`}
            </p>
            <p>
              실제 검색어: <strong>{s.query || "없음 · 선택한 조건으로 검색"}</strong>
            </p>
            {s.raw ? (
              <Link className="text-link" href={searchLink(params, { mode: undefined })}>
                한글 키워드 변환 사용하기
              </Link>
            ) : s.changed && params.query ? (
              <Link className="text-link" href={searchLink(params, { mode: "raw" })}>
                입력한 검색어 그대로 재검색
              </Link>
            ) : null}
            {s.choices.length > 0 && (
              <div className="search-help">
                <p>여러 뜻이 있는 이름이에요. 찾으려는 대상을 선택해 주세요.</p>
                <div className="search-help-links">
                  {s.choices.map((choice) => (
                    <Link
                      key={`${choice.label}-${choice.query}`}
                      className="secondary-button"
                      href={searchLink(params, { query: choice.query, mode: "raw" })}
                    >
                      {choice.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
      {isDiscovery ? (
        <>
          <Suspense fallback={null}>
            <PopularDesigners />
          </Suspense>
          <Suspense
            fallback={
              <p className="notice" role="status">
                둘러볼 도안을 찾고 있어요…
              </p>
            }
          >
            <DiscoverPatterns />
          </Suspense>
        </>
      ) : (
        <section id="results" className="results-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE PATTERN INDEX</p>
              <h2>
                {s.designer
                  ? `${s.designer} 작가의 도안`
                  : active
                    ? "찾고 있던 도안"
                    : "오래 사랑받는 도안"}
                <span>
                  {data
                    ? `${data.paginator.results.toLocaleString("ko-KR")}${data.paginator.results >= 100000 ? "+" : ""}`
                    : ""}
                </span>
              </h2>
            </div>
            {active ? (
              <Link className="text-link" href="/">
                조건 초기화 <SlidersHorizontal size={15} />
              </Link>
            ) : (
              <p className="section-note">완성작이 많은 순서로 모았어요.</p>
            )}
          </div>
          {data?.detailsUnavailable && (
            <p className="notice">
              일부 상세 정보를 가져오지 못했어요. 언어·준비물은 도안 상세에서 다시 확인해 주세요.
            </p>
          )}
          {!data ? (
            <div className="empty-state">
              <h3>잠시 도안을 불러오지 못했어요.</h3>
              <p>검색 조건은 그대로 남아 있어요. 잠시 후 다시 시도해 주세요.</p>
              <a className="primary-button" href={returnTo}>
                다시 불러오기 <ArrowRight size={16} />
              </a>
            </div>
          ) : !patterns.length ? (
            <div className="empty-state">
              <Search size={28} />
              <h3>이 조건에 맞는 도안이 없어요.</h3>
              <p>검색 범위를 넓히거나 조건을 하나씩 풀어 보세요.</p>
              <div className="search-help-links">
                {data.paginator.results === 0 && s.broaderSearch && (
                  <Link
                    className="secondary-button"
                    href={searchLink(params, { query: s.broaderSearch.query, mode: "raw" })}
                  >
                    ‘{s.broaderSearch.label}’로 검색 범위 넓히기
                  </Link>
                )}
                {s.language && (
                  <Link className="secondary-button" href={searchLink(params, { language: "" })}>
                    모든 언어로 찾기
                  </Link>
                )}
                {s.difficulty && (
                  <Link className="secondary-button" href={searchLink(params, { difficulty: "" })}>
                    난이도 제한 풀기
                  </Link>
                )}
                {s.format && (
                  <Link className="secondary-button" href={searchLink(params, { format: "" })}>
                    모든 도안 형식으로 찾기
                  </Link>
                )}
                {s.category && (
                  <Link className="secondary-button" href={searchLink(params, { category: "" })}>
                    모든 작품 종류로 찾기
                  </Link>
                )}
                {s.craft && (
                  <Link className="secondary-button" href={searchLink(params, { craft: "all" })}>
                    코바늘·대바늘 함께 찾기
                  </Link>
                )}
                {s.availability && (
                  <Link className="secondary-button" href={searchLink(params, { free: "" })}>
                    무료·구매 조건 풀기
                  </Link>
                )}
                {s.page > 1 && (
                  <Link className="secondary-button" href={searchLink(params)}>
                    첫 페이지로 돌아가기
                  </Link>
                )}
              </div>
              {/[가-힣]/.test(s.query) && (
                <p>
                  등록되지 않았거나 뜻이 모호한 한글이 남아 있어요. 영문 이름을 알고 있다면 검색어를
                  바꿔 보세요.
                </p>
              )}
              <p>
                여러 캐릭터를 입력했다면 이름 하나씩 검색해 보세요. 도안이 아직 등록되지 않았을 수도
                있어요.
              </p>
              <Link href="/" className="primary-button">
                전체 도안 보기
              </Link>
            </div>
          ) : (
            <>
              <div className="pattern-grid">
                {patterns.map((p, i) => (
                  <Fragment key={p.id}>
                    <PatternCard pattern={p} returnTo={returnTo} index={i} />
                    {i === 5 && i < patterns.length - 1 && <AdSlot />}
                  </Fragment>
                ))}
              </div>
              <nav aria-label="검색 결과 페이지" className="pagination">
                {s.page > 1 ? (
                  <Link href={pageUrl(s.page - 1)} aria-label="이전 페이지">
                    <ChevronLeft size={18} />
                  </Link>
                ) : (
                  <span className="disabled">
                    <ChevronLeft size={18} />
                  </span>
                )}
                {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => Math.max(1, Math.min(s.page - 2, totalPages - 4)) + i,
                ).map((n) => (
                  <Link key={n} href={pageUrl(n)} aria-current={n === s.page ? "page" : undefined}>
                    {n}
                  </Link>
                ))}
                {s.page < Math.min(1000, totalPages) ? (
                  <Link href={pageUrl(s.page + 1)} aria-label="다음 페이지">
                    <ChevronRight size={18} />
                  </Link>
                ) : (
                  <span className="disabled">
                    <ChevronRight size={18} />
                  </span>
                )}
              </nav>
            </>
          )}
        </section>
      )}
      <aside className="guide-banner">
        <div>
          <p className="eyebrow">BEFORE YOUR FIRST STITCH</p>
          <h2>영문 도안, 천천히 읽어도 괜찮아요. 🧶</h2>
          <p>실 굵기부터 게이지, 코바늘 약어까지. 시작에 필요한 말을 풀어두었어요.</p>
        </div>
        <Link href="/guide" className="secondary-button">
          뜨개 길잡이 <ArrowUpRight size={17} />
        </Link>
      </aside>
      {!isDiscovery && (
        <Suspense fallback={null}>
          <HotPatterns craft={s.craft} />
        </Suspense>
      )}
    </div>
  );
}
