// lib/ravelry.ts
export async function getPatterns(
  query: string = "",
  page: number = 1,
  free: string = "",
  pc: string = "",
  sort: string = "", // 정렬 파라미터 추가
) {
  const auth = Buffer.from(
    `${process.env.RAVELRY_USER_ID}:${process.env.RAVELRY_API_KEY}`,
  ).toString("base64");

  const params = new URLSearchParams({
    query: query,
    page: page.toString(),
    page_size: "9",
    craft: "crochet",
  });

  if (free) params.append("availability", free);
  if (pc) params.append("pc", pc);

  // 정렬 옵션 추가 (기본값은 'best'나 'projects')
  if (sort) {
    params.append("sort", sort);
  } else {
    params.append("sort", "best"); // 기본값: 추천순
  }

  const url = `https://api.ravelry.com/patterns/search.json?${params.toString()}`;

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("API 호출 실패");
  return res.json();
}

export async function getPatternDetail(id: string) {
  const auth = Buffer.from(
    `${process.env.RAVELRY_USER_ID}:${process.env.RAVELRY_API_KEY}`,
  ).toString("base64");

  const res = await fetch(`https://api.ravelry.com/patterns/${id}.json`, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
    next: { revalidate: 3600 }, // 1시간 캐싱
  });

  if (!res.ok) {
    throw new Error("상세 데이터를 가져오는데 실패했습니다.");
  }

  const data = await res.json();
  // 라벨리 상세 API는 응답이 { pattern: { ... } } 구조로 옵니다.
  return data.pattern;
}
