export const FREE_CATEGORIES = [
  {
    id: "bag",
    slug: "bags",
    label: "가방·파우치",
    description:
      "매일 들기 좋은 가방부터 작은 물건을 담는 파우치까지, 레이블리의 무료 도안을 비교해 보세요.",
    tips: [
      "완성 크기와 손잡이 길이를 확인하고 사용할 물건이 들어갈지 살펴보세요.",
      "권장 실의 소재와 굵기, 안감·지퍼 등 추가 준비물이 필요한지 확인하세요.",
    ],
  },
  {
    id: "clothing",
    slug: "clothing",
    label: "의류",
    description:
      "스웨터·카디건·조끼 등 무료 의류 도안을 모았어요. 제공 사이즈와 게이지를 확인하고 나에게 맞는 작품을 골라보세요.",
    tips: [
      "완성 치수와 여유분을 비교해 원하는 핏의 사이즈를 선택하세요.",
      "선택한 사이즈의 실 소요량을 확인하고, 시작 전에 도안의 무늬로 게이지를 측정하세요.",
    ],
  },
  {
    id: "hat",
    slug: "hats",
    label: "모자",
    description:
      "비니부터 챙이 있는 모자까지 무료 도안을 찾아보세요. 머리둘레와 완성 높이, 계절에 맞는 소재를 함께 확인할 수 있어요.",
    tips: [
      "착용할 사람의 머리둘레와 도안의 완성 치수를 비교하세요.",
      "늘어나는 정도와 모자 깊이는 실과 무늬에 따라 달라지므로 권장 게이지를 확인하세요.",
    ],
  },
  {
    id: "softies",
    slug: "dolls",
    label: "인형",
    description:
      "동물 인형과 아미구루미 등 레이블리 무료 인형 도안을 모았어요. 도안 언어와 과정 사진, 조립 방법을 살펴보고 시작해 보세요.",
    tips: [
      "뜨개 실 외에 솜·돗바늘 등 필요한 부자재와 완성 크기를 확인하세요.",
      "몸통과 팔다리를 따로 떠서 연결하는지, 과정 사진이나 기호 도안이 있는지 살펴보세요.",
    ],
  },
  {
    id: "neck-torso",
    slug: "scarves-shawls",
    label: "목도리·숄",
    description:
      "길게 두르는 목도리부터 어깨를 감싸는 숄까지 무료 도안을 모았어요. 완성 크기와 실 소요량, 반복 무늬를 비교해 보세요.",
    tips: [
      "목에 닿는 작품인 만큼 실의 소재와 촉감을 고려해 선택하세요.",
      "길이나 폭을 변경하면 실 소요량도 달라져요. 반복 무늬의 코 수와 도안의 조절 안내를 확인하세요.",
    ],
  },
  {
    id: "home",
    slug: "home",
    label: "생활 소품",
    description:
      "담요·쿠션·코스터 등 집 안에서 사용하는 무료 뜨개 도안을 찾아보세요. 쓰임새에 맞는 크기와 세탁 방법을 함께 살펴보세요.",
    tips: [
      "담요나 쿠션은 원하는 크기와 도안의 완성 치수를 먼저 비교하세요.",
      "자주 세탁할 소품은 권장 실의 관리 방법과 수축 가능성을 확인하세요.",
    ],
  },
  {
    id: "socks",
    slug: "socks",
    label: "양말",
    description:
      "발끝부터 또는 발목부터 뜨는 무료 양말 도안을 모았어요. 사이즈·뒤꿈치 구성·필요한 바늘을 확인해 보세요.",
    tips: [
      "발 길이뿐 아니라 발둘레와 도안의 게이지도 확인하세요.",
      "뒤꿈치 뜨는 방법과 줄바늘·장갑바늘 등 필요한 바늘 종류를 원문에서 확인하세요.",
    ],
  },
  {
    id: "hands",
    slug: "gloves",
    label: "장갑",
    description:
      "손가락장갑·벙어리장갑·핸드워머 무료 도안을 찾아보세요. 손둘레와 길이, 엄지 부분의 구성에 따라 작품을 골라보세요.",
    tips: [
      "손둘레와 손목 길이를 확인하고 착용할 사람에게 맞는 사이즈를 고르세요.",
      "엄지와 손가락을 나누어 뜨는 방법, 필요한 바늘과 실 소요량을 확인하세요.",
    ],
  },
] as const;

export function freeCategory(idOrSlug: string) {
  return FREE_CATEGORIES.find((item) => item.id === idOrSlug || item.slug === idOrSlug);
}

export function freePatternUrl(
  craft: string,
  collection: string,
  category: string,
  sort: string,
  page = 1,
) {
  const selected = freeCategory(category);
  const path = `/free-patterns${selected ? `/${selected.slug}` : ""}`;
  const params = new URLSearchParams();
  if (craft === "knitting") params.set("craft", craft);
  if (["korean", "chart", "easy"].includes(collection)) params.set("collection", collection);
  if (["favorites", "recently-popular", "date"].includes(sort)) params.set("sort", sort);
  if (Number.isFinite(page) && page > 1)
    params.set("page", String(Math.min(1000, Math.floor(page))));
  return `${path}${params.size ? `?${params}` : ""}`;
}
