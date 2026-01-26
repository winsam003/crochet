// lib/ravelry.ts
export async function getPatterns(
  query: string = "",
  page: number = 1,
  free: string = "",
  pc: string = "",
  sort: string = "", // 정렬 파라미터 추가
  craft: string = "crochet",
) {
  const auth = Buffer.from(
    `${process.env.RAVELRY_USER_ID}:${process.env.RAVELRY_API_KEY}`,
  ).toString("base64");

  const params = new URLSearchParams({
    query: query,
    page: page.toString(),
    page_size: "9",
    craft: craft,
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

export async function getRelatedPatterns(category: string, craft: string, weight: string) {
  try {
    const auth = Buffer.from(
      `${process.env.RAVELRY_USER_ID}:${process.env.RAVELRY_API_KEY}`,
    ).toString("base64");

    const response = await fetch(
      `https://api.ravelry.com/patterns/search.json?pc=${category}&craft=${craft}&weight=${weight}&page_size=10&sort=best&photo=yes`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
        // 캐시 설정 (성능 최적화)
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ravelry API Error Text:", errorText);
      return []; // 에러 시 빈 배열 반환해서 페이지 중단 방지
    }

    const data = await response.json();
    return data.patterns || [];
  } catch (error) {
    console.error("fetch error:", error);
    return []; // 네트워크 에러 시 빈 배열 반환
  }
}
// lib/ravelry.ts

export async function getHotPatterns(category: string = "", craft: string = "crochet") {
  const auth = Buffer.from(
    `${process.env.RAVELRY_USER_ID}:${process.env.RAVELRY_API_KEY}`,
  ).toString("base64");

  // sort=recently-popular 를 쓰면 투박함을 줄이고 최신 트렌드를 가져옵니다.
  const params = new URLSearchParams({
    sort: "recently-popular",
    page_size: "10",
    photo: "yes",
    craft: craft, // 코바늘/대바늘 구분
  });

  if (category) params.append("pc", category);

  const url = `https://api.ravelry.com/patterns/search.json?${params.toString()}`;

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
    next: { revalidate: 600 },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.patterns || [];
}
