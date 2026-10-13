import type { Pattern } from "./patterns";

// Deliberately small vocabulary: unknown names stay intact instead of being guessed.
const topics = [
  { ko: "담요", words: /blanket|afghan|throw|담요|블랭킷/i },
  { ko: "가디건", words: /cardigan|가디건|카디건/i },
  { ko: "스웨터", words: /sweater|pullover|스웨터|풀오버/i },
  { ko: "숄", words: /shawl|숄/i },
  { ko: "목도리", words: /scarf|cowl|목도리|스카프|넥워머/i },
  { ko: "모자", words: /\bhat\b|beanie|bonnet|모자|비니|보넷/i },
  { ko: "가방", words: /\bbag\b|tote|pouch|가방|파우치/i },
  { ko: "인형", words: /amigurumi|softies|\btoy\b|인형/i },
  { ko: "양말", words: /sock|양말/i },
  { ko: "장갑", words: /mitten|glove|장갑/i },
  { ko: "조끼", words: /\bvest\b|조끼/i },
];
const features = [
  { ko: "물결", words: /ripple|wave|chevron|물결|웨이브|지그재그/i },
  { ko: "그래니", words: /granny|그래니|그레니/i },
  { ko: "꽈배기", words: /cable|꽈배기/i },
  { ko: "레이스", words: /lace|레이스/i },
  { ko: "배색", words: /stripes?|colorwork|colourwork|배색|줄무늬/i },
];
const clean = (s: string) =>
  s
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
const normalized = (s: string) => clean(s).toLowerCase();

export function videoSearchContext(pattern: Pattern) {
  const name = clean(pattern.name).slice(0, 120);
  const author = clean(pattern.pattern_author?.name || pattern.designer?.name || "");
  // "Lucy of Attic24" -> "Attic24", without depending on a particular designer.
  const designer = (author.split(/\s+of\s+/i).pop() || author).slice(0, 80);
  const categoryText = (pattern.pattern_categories || [])
    .map((c) => `${c.permalink} ${c.name || ""}`)
    .join(" ");
  const topic =
    topics.find((t) => t.words.test(name)) || topics.find((t) => t.words.test(categoryText));
  const attributeText = (pattern.pattern_attributes || []).map((a) => a.permalink).join(" ");
  const feature =
    features.find((f) => f.words.test(name)) || features.find((f) => f.words.test(attributeText));
  const craft =
    pattern.craft?.permalink === "knitting"
      ? "대바늘"
      : pattern.craft?.permalink === "crochet"
        ? "코바늘"
        : "뜨개";
  const description = [feature?.ko, topic?.ko].filter(Boolean).join(" ");
  const primary = [designer, feature && topic ? description : name, !description ? craft : ""]
    .filter(Boolean)
    .join(" ");
  // A category alone is too broad to claim a similar pattern. Keep the name if no feature is known.
  const fallback = feature && topic ? `${craft} ${description} 뜨기` : `${name} ${craft}`;
  return { name, designer, craft, topic, feature, primary, fallback };
}

export interface VideoCandidate {
  id: string;
  title: string;
  description: string;
  channel: string;
  thumbnail?: string;
  audioLanguage?: string;
  textLanguage?: string;
  duration?: string;
  available?: boolean;
}
export interface RelatedVideo extends VideoCandidate {
  korean: boolean;
  languageLabel: string;
  matchLabel: string;
}

export function selectRelatedVideos(
  pattern: Pattern,
  candidates: VideoCandidate[],
): RelatedVideo[] {
  const context = videoSearchContext(pattern);
  const name = normalized(context.name);
  return [...new Map(candidates.map((v) => [v.id, v])).values()]
    .flatMap((video) => {
      if (!/^[\w-]{11}$/.test(video.id) || video.available === false) return [];
      const duration = video.duration?.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
      if (
        duration &&
        Number(duration[1] || 0) * 3600 + Number(duration[2] || 0) * 60 + Number(duration[3] || 0) <
          60
      )
        return [];
      const title = normalized(video.title);
      const text = normalized(`${video.title} ${video.description}`);
      const craftMatch = /crochet|knit|코바늘|대바늘|뜨개|뜨기/i.test(text);
      const wrongCraft =
        context.craft === "코바늘"
          ? /knitting|대바늘/i.test(title) && !/crochet|코바늘/i.test(title)
          : context.craft === "대바늘"
            ? /crochet|코바늘/i.test(title) && !/knitting|대바늘/i.test(title)
            : false;
      if (wrongCraft) return [];
      const named = name.length >= 4 && text.includes(name) && craftMatch;
      // Require both a construction/visual feature and the item type in the title for broad matches.
      const similar =
        !!context.topic &&
        !!context.feature &&
        context.topic.words.test(video.title) &&
        context.feature.words.test(video.title);
      if (!named && !similar) return [];
      const koreanAudio = /^ko(?:-|$)/i.test(video.audioLanguage || "");
      const koreanText =
        /^ko(?:-|$)/i.test(video.textLanguage || "") || /[가-힣]/.test(video.title);
      const korean = koreanAudio || koreanText;
      const designerMatch = !!context.designer && text.includes(normalized(context.designer));
      return [
        {
          ...video,
          korean,
          languageLabel: koreanAudio
            ? "한국어 음성"
            : koreanText
              ? "한국어 제목·설명"
              : "해외 영상",
          matchLabel: named ? "도안명 언급" : "비슷한 작품·기법",
          score: (korean ? 100 : 0) + (named ? 30 : 0) + (designerMatch ? 10 : 0),
        },
      ];
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
