// Pure selection logic shared by the offline refresh script and tests.
export const TREND_SEEDS = ["코바늘", "대바늘", "뜨개질", "코바늘도안", "대바늘도안"];

const subjects = [
  ["scarf", "목도리", "목도리|머플러", "scarf", "neck-torso"],
  ["bag", "가방", "가방|뜨개백", "bag", "bag"],
  ["scrubbie", "수세미", "수세미", "scrubbie", "home"],
  ["pouch", "파우치", "파우치", "pouch", "bag"],
  ["doll", "인형", "인형|아미구루미", "amigurumi", "softies"],
  ["hat", "모자", "모자|비니|버킷햇|벙거지", "hat", "hat"],
  ["vest", "조끼", "조끼|베스트", "vest", "clothing"],
  ["cardigan", "가디건", "가디건|카디건", "cardigan", "clothing"],
  ["sweater", "스웨터", "스웨터|스웨타", "sweater", "clothing"],
  ["blanket", "담요", "담요|블랭킷", "blanket", "home"],
  ["coaster", "코스터", "코스터|컵받침", "coaster", "home"],
  ["socks", "양말", "양말", "socks", "socks"],
  ["gloves", "장갑", "장갑|벙어리장갑", "mittens", "hands"],
  ["shawl", "숄", "숄", "shawl", "neck-torso"],
  ["cushion", "쿠션", "쿠션", "cushion", "home"],
] as const;

export interface KeywordStat {
  relKeyword: string;
  monthlyPcQcCnt: number | string;
  monthlyMobileQcCnt: number | string;
}

export function searchCount(value: number | string): number {
  // Naver suppresses small counts. Use their lower bound, never invent a count.
  if (typeof value === "string" && /^<\s*10$/.test(value)) return 0;
  const count = Number(value);
  if (!Number.isFinite(count) || count < 0 || value === "") {
    throw new Error("Invalid keyword search count");
  }
  return count;
}

export function rankTopics(rows: KeywordStat[]) {
  const candidates = rows
    .flatMap((row) => {
      const keyword = row.relKeyword.replace(/\s/g, "");
      if (!/코바늘|대바늘|뜨개|뜨기|도안|아미구루미/.test(keyword)) return [];
      if (
        /부자재|뜨개실|수세미실|가방실|재료|키트|패키지|공방|학원|수업|클래스|구매|쇼핑|판매|완제품|바늘세트/.test(
          keyword,
        )
      )
        return [];
      const matches = subjects.filter(([, , pattern]) => new RegExp(pattern).test(keyword));
      if (matches.length !== 1) return [];
      const [id, title, , query, category] = matches[0];
      const pc = searchCount(row.monthlyPcQcCnt);
      const mobile = searchCount(row.monthlyMobileQcCnt);
      return [
        {
          id,
          title,
          keyword,
          monthlySearches: pc + mobile,
          pcSearches: row.monthlyPcQcCnt,
          mobileSearches: row.monthlyMobileQcCnt,
          params: {
            query,
            category,
            craft: keyword.includes("대바늘")
              ? "knitting"
              : keyword.includes("코바늘")
                ? "crochet"
                : "all",
          },
        },
      ];
    })
    .sort(
      (a, b) => b.monthlySearches - a.monthlySearches || a.keyword.localeCompare(b.keyword, "ko"),
    );
  // Keep the largest individual keyword, not the sum of overlapping variants.
  return candidates.filter(
    (topic, index) => candidates.findIndex((other) => other.id === topic.id) === index,
  );
}
