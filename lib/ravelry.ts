// lib/ravelry.ts
export async function getPatterns(
  query: string = "",
  page: number = 1,
  free: string = "",
) {
  const auth = Buffer.from(
    `${process.env.RAVELRY_USER_ID}:${process.env.RAVELRY_API_KEY}`,
  ).toString("base64");

  // free 값이 있으면 &free=yes 또는 &free=no 를 붙여줍니다.
  let url = `https://api.ravelry.com/patterns/search.json?query=${query}&page=${page}&page_size=9`;
  if (free) url += `&availability=${free}`;

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
    next: { revalidate: 3600 },
  });

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
