import { expandKeywords } from "./search-keywords.ts";

export interface Photo {
  id?: number;
  medium_url?: string;
  medium2_url?: string;
  small_url?: string;
  copyright_holder?: string;
}
export interface Source {
  name?: string;
  url?: string;
  pattern_source_type?: { name?: string };
}
export interface Pattern {
  id: number;
  name: string;
  permalink?: string;
  free?: boolean;
  designer?: { id?: number; permalink?: string; name?: string };
  pattern_author?: { id?: number; permalink?: string; name?: string };
  first_photo?: Photo;
  photos?: Photo[];
  pattern_sources?: Source[];
  languages?: { code: string; name: string }[];
  pattern_attributes?: { permalink: string }[];
  pattern_categories?: { permalink: string; name?: string }[];
  craft?: { permalink: string };
  yarn_weight?: { name?: string; id?: number };
  yarn_weight_description?: string | null;
  pattern_needle_sizes?: { metric: number }[];
  difficulty_average?: number;
  difficulty_count?: number | null;
  rating_average?: number;
  rating_count?: number | null;
  projects_count?: number;
  favorites_count?: number;
  notes?: string;
  url?: string | null;
  download_location?: { type?: string; free?: boolean; url?: string } | null;
  ravelry_download?: boolean;
  downloadable?: boolean;
  price?: number | string | null;
  currency?: string | null;
  yardage?: number | null;
  yardage_max?: number | null;
  gauge?: number | null;
  row_gauge?: number | null;
  gauge_divisor?: number;
  gauge_pattern?: string;
  sizes_available?: string;
  has_us_terminology?: boolean;
  has_uk_terminology?: boolean;
  printings?: { pattern_not_available?: boolean; pattern_source: Source }[];
  packs?: {
    yarn_name?: string;
    yarn?: { name?: string; yarn_company_name?: string; permalink?: string };
  }[];
}
export const CATEGORIES = [
  ["", "전체"],
  ["bag", "가방·파우치"],
  ["clothing", "의류"],
  ["hat", "모자"],
  ["softies", "인형"],
  ["neck-torso", "목도리·숄"],
  ["home", "생활 소품"],
  ["socks", "양말"],
  ["hands", "장갑"],
] as const;
export const SORTS = [
  ["best", "관련도순"],
  ["projects", "완성작 많은 순"],
  ["favorites", "관심 많은 순"],
  ["recently-popular", "최근 인기순"],
  ["date", "최신 등록순"],
] as const;
export type SearchParams = Record<string, string | undefined>;
export function interpretSearch(input: SearchParams) {
  const originalQuery = (input.query || "").trim().slice(0, 160);
  const raw = input.mode === "raw";
  const expanded = expandKeywords(raw ? "" : originalQuery);
  const query = raw ? originalQuery : expanded.query;
  const designer = (input.designer || "").trim().slice(0, 160);
  const explicitCraft = ["all", "crochet", "knitting"].includes(input.craft || "");
  const inferredCraft =
    expanded.intents.has("crochet") && expanded.intents.has("knitting")
      ? ""
      : expanded.intents.has("knitting")
        ? "knitting"
        : expanded.intents.has("crochet")
          ? "crochet"
          : designer
            ? ""
            : "crochet";
  const craft = explicitCraft ? (input.craft === "all" ? "" : input.craft!) : inferredCraft;
  const explicitCategory = CATEGORIES.some(([id]) => id === input.category);
  const category = explicitCategory
    ? input.category!
    : expanded.categories.length === 1
      ? expanded.categories[0]
      : "";
  const availability = ["", "free", "online", "ravelry"].includes(input.free ?? "invalid")
    ? input.free!
    : expanded.intents.has("free")
      ? "free"
      : "";
  const difficulty = ["", "easy"].includes(input.difficulty ?? "invalid")
    ? input.difficulty!
    : expanded.intents.has("easy")
      ? "easy"
      : "";
  return {
    query,
    originalQuery,
    raw,
    choices: expanded.choices,
    broaderSearch: expanded.broaderSearch,
    changed:
      !raw &&
      (query !== originalQuery ||
        [...expanded.intents].some((value) => value && value !== "ignore") ||
        !!category),
    designer,
    craft,
    category,
    availability,
    difficulty,
    language: ["kr", "en", "ja"].includes(input.language || "") ? input.language! : "",
    format: ["chart", "written-pattern", "video-tutorial"].includes(input.format || "")
      ? input.format!
      : "",
    sort: SORTS.some(([key]) => key === input.sort) ? input.sort! : query ? "best" : "projects",
    page: Math.min(1000, Math.max(1, Math.floor(Number(input.page) || 1))),
  };
}

// Freeze effective filters before changing a single condition, so inferred intent
// cannot silently restore a filter that the visitor just removed.
export function searchLink(input: SearchParams, changes: SearchParams = {}) {
  const s = interpretSearch(input);
  const values: SearchParams = {
    query: input.query || "",
    designer: s.designer,
    craft: s.craft || "all",
    category: s.category,
    free: s.availability,
    difficulty: s.difficulty,
    language: s.language,
    format: s.format,
    sort: s.sort,
    mode: s.raw ? "raw" : undefined,
    ...changes,
  };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) params.set(key, value);
  }
  return `/?${params}#results`;
}
export function safeUrl(value?: string | null): string | undefined {
  if (!value) return;
  try {
    const u = new URL(value);
    if (!["https:", "http:"].includes(u.protocol)) return;
    if (u.hostname === "www.ravelry.com" || u.hostname === "ravelry.com") u.protocol = "https:";
    return u.href;
  } catch {
    return;
  }
}
export function originalUrl(p: Pattern) {
  return `https://www.ravelry.com/patterns/library/${encodeURIComponent(p.permalink || String(p.id))}`;
}
export function acquisition(p: Pattern) {
  const location = p.download_location;
  const download = safeUrl(location?.url);
  const website = safeUrl(p.url);
  const links: { label: string; url: string; kind: string }[] = [];
  // A pattern can be free on a blog AND have a paid Ravelry PDF.
  if (download)
    links.push({
      label:
        location?.free === true
          ? "무료 도안 받으러 가기"
          : location?.free === false
            ? "도안 구매처로 가기"
            : "도안 제공처 확인",
      url: download,
      kind: location?.free === true ? "free" : "source",
    });
  if (website && website !== download)
    links.push({
      label: p.free ? "작가 사이트에서 무료 제공 안내 확인" : "작가 사이트 보기",
      url: website,
      kind: "website",
    });
  // When the web version is free but the download is paid, surface the free route first.
  if (p.free && location?.free === false && website && website !== download) {
    links.sort((a, b) => Number(b.kind === "website") - Number(a.kind === "website"));
  }
  let label = "제공 방식 확인 필요";
  if (download && location?.free === true)
    label = location.type === "ravelry" ? "무료 Ravelry 다운로드" : "무료 제공처 있음";
  else if (p.free && download && location?.free === false) label = "무료 제공 · 다운로드는 유료";
  else if (p.free && website) label = "무료 제공 · 웹사이트 확인";
  else if (download && location?.free === false) label = "유료 다운로드";
  else if (p.free) label = "무료 · 제공처 확인 필요";
  else if (
    p.printings?.some((v) =>
      ["Book", "Magazine"].includes(v.pattern_source.pattern_source_type?.name || ""),
    )
  )
    label = "책·잡지 수록";
  else if (p.free === false) label = "유료 · 제공처 확인";
  return { label, links, original: originalUrl(p) };
}
const languages: Record<string, string> = {
  kr: "한국어",
  ko: "한국어",
  en: "영어",
  ja: "일본어",
  zh: "중국어",
  de: "독일어",
  fr: "프랑스어",
  es: "스페인어",
  ru: "러시아어",
  nl: "네덜란드어",
  da: "덴마크어",
  sv: "스웨덴어",
  no: "노르웨이어",
  fi: "핀란드어",
  it: "이탈리아어",
  pt: "포르투갈어",
};
export function languageLabel(p: Pattern) {
  return p.languages?.length
    ? [...p.languages]
        .sort(
          (a, b) => Number(["kr", "ko"].includes(b.code)) - Number(["kr", "ko"].includes(a.code)),
        )
        .map((l) => languages[l.code] || l.name)
        .join(" · ")
    : "언어 미확인";
}
export function formatLabels(p: Pattern) {
  const attrs = p.pattern_attributes?.map((a) => a.permalink) || [];
  return [
    ["chart", "기호 도안 포함"],
    ["written-pattern", "글로 설명하는 도안"],
    ["video-tutorial", "따라 볼 영상 있음"],
    ["phototutorial", "과정 사진"],
  ]
    .filter(([id]) => attrs.includes(id))
    .map(([, label]) => label);
}
export function difficultyLabel(p: Pattern) {
  if (!p.difficulty_count || !p.difficulty_average) return "난이도 평가 없음";
  return `${p.difficulty_average <= 2 ? "쉬운 편" : p.difficulty_average <= 5 ? "보통" : "도전적인 편"} · ${p.difficulty_average.toFixed(1)}/10`;
}
export function meterage(p: Pattern) {
  if (!p.yardage) return "소요량 미등록";
  const min = Math.round(p.yardage * 0.9144),
    max = p.yardage_max ? Math.round(p.yardage_max * 0.9144) : min;
  return `${min.toLocaleString("ko-KR")}${max > min ? `–${max.toLocaleString("ko-KR")}` : ""} m`;
}
export function priceLabel(p: Pattern) {
  if (p.price == null || !p.currency) return "";
  try {
    return new Intl.NumberFormat("ko-KR", { style: "currency", currency: p.currency }).format(
      Number(p.price),
    );
  } catch {
    return `${p.price} ${p.currency}`;
  }
}
export interface SavedPattern {
  id: number;
  name: string;
  image: string;
  designer: string;
}
export function savedPattern(p: Pattern): SavedPattern {
  return {
    id: p.id,
    name: p.name,
    image: safeUrl(p.first_photo?.medium_url || p.photos?.[0]?.medium_url) || "",
    designer: p.pattern_author?.name || p.designer?.name || "작가 미등록",
  };
}
export function detailHref(id: number, returnTo = "/") {
  return `/pattern/${id}?from=${encodeURIComponent(returnTo)}`;
}
export function safeReturn(value?: string) {
  return typeof value === "string" &&
    (value === "/" ||
      value.startsWith("/?") ||
      value === "/saved" ||
      value === "/free-patterns" ||
      value.startsWith("/free-patterns?") ||
      /^\/free-patterns\/(bags|clothing|hats|dolls|scarves-shawls|home|socks|gloves)(?:\?[^#\\]*)?$/.test(
        value,
      ))
    ? value
    : "/";
}

export function designerHref(name: string) {
  return `/?${new URLSearchParams({ designer: name, craft: "all" })}#results`;
}
