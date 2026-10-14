import styles from "./materials.module.css";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import DesignerLink from "@/components/DesignerLink";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, BookOpen } from "lucide-react";
import { getPatternDetail } from "@/lib/ravelry";
import {
  acquisition,
  difficultyLabel,
  formatLabels,
  languageLabel,
  meterage,
  priceLabel,
  savedPattern,
  safeReturn,
  safeUrl,
} from "@/lib/patterns";
import { translateYarnWeight } from "@/lib/utils";
import { SaveButton, RecentTracker } from "@/components/Library";
import PatternImage from "@/components/PatternImage";
import CrochetTerms from "@/components/CrochetTerms";
import RelatedPatterns from "@/components/RelatedPatterns";
import PatternVideos from "@/components/PatternVideos";
export default async function PatternDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const back = safeReturn((await searchParams).from);
  const p = await getPatternDetail(id);
  if (!p) notFound();
  const access = acquisition(p),
    formats = formatLabels(p),
    saved = savedPattern(p),
    photos = p.photos || [];
  const needles = [...new Set(p.pattern_needle_sizes?.map((n) => n.metric) || [])];
  const craft = p.craft?.permalink;
  const craftLabel =
    craft === "crochet" ? "코바늘" : craft === "knitting" ? "대바늘" : "뜨개 종류 미확인";
  const yarns = [
    ...new Set(
      (p.packs || [])
        .map((pack) =>
          [pack.yarn?.yarn_company_name, pack.yarn?.name || pack.yarn_name]
            .filter(Boolean)
            .join(" "),
        )
        .filter(Boolean),
    ),
  ];
  return (
    <div className="page-shell detail-page">
      <RecentTracker pattern={saved} />
      <Link className="back-link" href={back}>
        <ArrowLeft size={16} />
        {back === "/saved" ? "내 도안함" : "검색 결과로 돌아가기"}
      </Link>
      <div className="detail-grid">
        <section className="detail-gallery" aria-label="도안 사진">
          <div className="detail-photo">
            <PatternImage
              src={photos[0]?.medium2_url || photos[0]?.medium_url}
              alt={p.name}
              eager
            />
          </div>
          {photos[0]?.copyright_holder && (
            <p className="photo-credit">사진 © {photos[0].copyright_holder}</p>
          )}
          {photos.length > 1 && (
            <div className="gallery-thumbnails">
              {photos.slice(1, 7).map((photo, i) => (
                <a
                  key={photo.id || i}
                  href={safeUrl(photo.medium2_url || photo.medium_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} 추가 사진 ${i + 1} 새 창에서 크게 보기`}
                >
                  <PatternImage
                    src={photo.medium_url || photo.small_url}
                    alt={`${p.name} 다른 모습 ${i + 1}`}
                  />
                </a>
              ))}
            </div>
          )}
        </section>
        <section className="detail-overview">
          <p className="eyebrow accent">{craftLabel}</p>
          <h1>{p.name}</h1>
          <p className="designer">
            <DesignerLink pattern={p} />
          </p>
          <div className="detail-tags">
            <span>{languageLabel(p)}</span>
            {formats.length ? (
              formats.map((f) => <span key={f}>{f}</span>)
            ) : (
              <span>도안 형식 미확인</span>
            )}
          </div>
          <section className="preparation-summary" aria-labelledby="preparation-title">
            <h2 id="preparation-title">이 도안, 뜨려면 뭐가 필요해요?</h2>
            <dl>
              <div>
                <dt>준비할 바늘</dt>
                <dd>
                  {needles.length
                    ? `${craft === "crochet" || craft === "knitting" ? craftLabel : "바늘"} ${needles.join(" / ")} mm`
                    : "바늘 크기 미등록"}
                </dd>
              </div>
              <div>
                <dt>준비할 실</dt>
                <dd>
                  {translateYarnWeight(p.yarn_weight?.name || p.yarn_weight_description)}
                  <br />
                  {p.yardage ? `필요한 길이 ${meterage(p)}` : "소요량 미등록"}
                </dd>
              </div>
              <div>
                <dt>도안 읽기</dt>
                <dd>
                  {languageLabel(p)} · {formats.length ? formats.join(" · ") : "도안 형식 미확인"}
                  {craft === "crochet" && (
                    <small>
                      {p.has_us_terminology && p.has_uk_terminology
                        ? "미국식·영국식 약어 모두 제공"
                        : p.has_us_terminology
                          ? "미국식(US) 약어 사용"
                          : p.has_uk_terminology
                            ? "영국식(UK) 약어 사용"
                            : "약어 기준 미등록"}{" "}
                      · <a href="#crochet-terms">약어 뜻 바로 보기</a>
                    </small>
                  )}
                </dd>
              </div>
            </dl>
            <p>등록된 준비물 기준이에요. 선택할 사이즈의 실 소요량은 도안에서 확인하세요.</p>
          </section>
          <div className="overview-stats">
            <div>
              <span>뜨는 난이도</span>
              <strong>{difficultyLabel(p)}</strong>
              {!!p.difficulty_count && (
                <small>{p.difficulty_count.toLocaleString("ko-KR")}명의 평가</small>
              )}
            </div>
            <div>
              <span>다른 사람의 완성작</span>
              <a href={`${access.original}/people`} target="_blank" rel="noopener noreferrer">
                <strong>
                  {p.projects_count?.toLocaleString("ko-KR") ?? "—"}개 <ArrowUpRight size={15} />
                </strong>
              </a>
              <small>Ravelry에서 살펴보기</small>
            </div>
          </div>
          <div className="acquisition-box">
            <p className="eyebrow">도안 받기</p>
            <h2>{access.label}</h2>
            {priceLabel(p) && (
              <p className="price-line">
                등록 가격 {priceLabel(p)} <span>최종 가격은 제공처에서 확인하세요.</span>
              </p>
            )}
            <div className="access-links">
              {access.links.map((link, i) => (
                <a
                  key={`${link.url}-${i}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={i === 0 ? "primary-button" : "secondary-button"}
                >
                  {link.label}
                  <ArrowUpRight size={17} />
                </a>
              ))}
              <a
                className={access.links.length ? "text-link" : "primary-button"}
                href={access.original}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ravelry 원문·제공처 확인 <ExternalLink size={14} />
              </a>
            </div>
            <p className="access-note">
              외부 제공처로 이동합니다. 도안 언어와 무료 제공 범위, 다운로드 조건을 확인해 주세요.
            </p>
            <div className="save-actions">
              <SaveButton pattern={saved} />
            </div>
          </div>
        </section>
      </div>
      <AdSlot />
      <div className="detail-content">
        <section className="materials">
          <p className="eyebrow">실과 바늘 준비</p>
          <h2>시작하기 전에 준비해요.</h2>
          <p className="section-note">
            도안에 등록된 정보를 모았어요. 사이즈별 준비물은 원문에서 확인해 주세요.
          </p>
          <dl className="material-list">
            <div>
              <dt>바늘 크기</dt>
              <dd>
                {needles.length ? `${needles.join(" / ")} mm` : "미등록"}
                <small>호수는 제품마다 다를 수 있어 mm를 기준으로 확인하세요.</small>
              </dd>
            </div>
            <div>
              <dt>실 굵기</dt>
              <dd>{translateYarnWeight(p.yarn_weight?.name || p.yarn_weight_description)}</dd>
            </div>
            <div>
              <dt>권장 실</dt>
              <dd>{yarns.length ? yarns.join(" / ") : "미등록"}</dd>
            </div>
            <div>
              <dt>필요한 실 길이</dt>
              <dd>
                {meterage(p)}
                {p.yardage && (
                  <small>사이즈별 소요량이 다를 수 있어요. 중량(g)으로 바로 바꾸지는 마세요.</small>
                )}
              </dd>
            </div>
            <div>
              <dt>
                코·단 수<br />
                (게이지)
              </dt>
              <dd>
                {p.gauge
                  ? `${Math.round((p.gauge_divisor || 4) * 2.54 * 10) / 10}cm 안에 ${p.gauge}코${p.row_gauge ? ` × ${p.row_gauge}단` : ""}`
                  : "미등록"}
                <small>
                  도안의 무늬로 떠서, 안내된 길이 안에 같은 수의 코와 단이 들어가는지 확인해요.
                </small>
                {p.gauge_pattern && <small>측정할 무늬 (원문): {p.gauge_pattern}</small>}
              </dd>
            </div>
            <div>
              <dt>제공 사이즈</dt>
              <dd>
                {p.sizes_available || "미등록"}
                <small>원문 표기입니다. 완성 치수와 여유분을 확인하세요.</small>
              </dd>
            </div>
          </dl>
          {(craft === "crochet" || craft === "knitting") && (
            <>
              <aside className={styles["yarn-choice-card"]} aria-labelledby="yarn-choice-title">
                <p className="eyebrow">실 고르기</p>
                <h3 id="yarn-choice-title">실을 찾기 전에 확인하세요</h3>
                <dl>
                  <div>
                    <dt>권장 실</dt>
                    <dd>{yarns.length ? yarns.join(" / ") : "원문 도안에서 확인"}</dd>
                  </div>
                  <div>
                    <dt>실 굵기</dt>
                    <dd>{translateYarnWeight(p.yarn_weight?.name || p.yarn_weight_description)}</dd>
                  </div>
                  <div>
                    <dt>필요한 길이</dt>
                    <dd>{p.yardage ? meterage(p) : "원문 도안에서 확인"}</dd>
                  </div>
                </dl>
                <p className={styles["yarn-choice-note"]}>
                  같은 굵기라도 소재와 길이가 달라요. 선택할 사이즈의 소요량을 원문에서 확인한 뒤
                  비교하세요.
                </p>
              </aside>
              <aside className={styles["coupang-partners-card"]} aria-labelledby="coupang-partners-title">
                <p className={styles["affiliate-disclosure"]}>
                  이 페이지는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                </p>
                <p className="eyebrow">쿠팡 파트너스 · 상품 예시</p>
                <h3 id="coupang-partners-title">뜨개실 상품 살펴보기</h3>
                <p className={styles["coupang-partners-note"]}>
                  이 상품은 예시이며, 이 도안의 권장 실과 일치한다는 뜻은 아니에요. 상품의 굵기와
                  길이를 확인해 주세요.
                </p>
                <div className={styles["coupang-partners-product"]}>
                  <iframe
                    title="쿠팡파트너스 예시 뜨개실 상품"
                    src="https://coupa.ng/cp8HLl"
                    width="120"
                    height="240"
                    frameBorder="0"
                    scrolling="no"
                    referrerPolicy="unsafe-url"
                    loading="lazy"
                  />
                </div>
              </aside>
            </>
          )}
          <Link href="/guide" className="text-link">
            <BookOpen size={16} />실 굵기와 게이지가 낯설다면 <ArrowUpRight size={15} />
          </Link>
        </section>
        <section className="pattern-notes">
          {craft === "crochet" && (
            <div id="crochet-terms">
              <CrochetTerms pattern={p} />
            </div>
          )}
          <p className="eyebrow">도안 소개</p>
          <h2>작가의 도안 소개</h2>
          <p className="section-note">소개글이며, 실제 도안 파일의 전체 내용과는 다를 수 있어요.</p>
          {p.notes ? (
            <>
              <div className="notes-text">{p.notes}</div>
              <a
                className="secondary-button"
                href={`https://translate.google.com/?sl=auto&tl=ko&text=${encodeURIComponent(p.notes.slice(0, 4500))}&op=translate`}
                target="_blank"
                rel="noopener noreferrer"
              >
                소개글 한국어로 번역하기 <ArrowUpRight size={16} />
              </a>
              {p.notes.length > 4500 && (
                <p className="section-note">긴 소개글은 앞부분 4,500자만 번역기로 전달합니다.</p>
              )}
            </>
          ) : (
            <p className="notice">등록된 소개글이 없어요. 원문 제공처에서 확인해 주세요.</p>
          )}
          {!!p.printings?.length && (
            <div className="source-list">
              <h3>도안이 실린 곳</h3>
              {p.printings.map((printing, i) => (
                <p key={i}>
                  {printing.pattern_source.name}
                  {printing.pattern_not_available && " · 현재 제공 여부 확인 필요"}
                </p>
              ))}
            </div>
          )}
        </section>
      </div>
      <Suspense
        fallback={
          <p className="section-note" role="status">
            관련 영상을 찾고 있어요…
          </p>
        }
      >
        <PatternVideos pattern={p} />
      </Suspense>
      <Suspense fallback={null}>
        <RelatedPatterns
          category={p.pattern_categories?.[0]?.permalink || ""}
          craft={craft || ""}
          id={p.id}
        />
      </Suspense>
    </div>
  );
}
