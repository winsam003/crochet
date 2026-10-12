import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/utils.ts (혹은 별도 파일)
export function translateYarnWeight(description?: string | null) {
  if (!description) return "실 굵기 미등록";
  const labels: [string, string][] = [
    ["super bulky", "아주 굵은 실"],
    ["jumbo", "초극태사"],
    ["bulky", "굵은 실"],
    ["aran", "도톰한 실"],
    ["worsted", "중간보다 굵은 실"],
    ["dk", "중간 굵기"],
    ["sport", "조금 가는 실"],
    ["fingering", "가는 실"],
    ["cobweb", "아주 가는 실"],
    ["lace", "레이스 굵기"],
    ["thread", "레이스용 실"],
  ];
  const label = labels.find(([key]) => description.toLowerCase().includes(key));
  return label ? `${description} · ${label[1]}` : description;
}

// lib/utils.ts

export function translateNeedleSize(mm: number, craft: string) {
  if (!mm) return "";

  if (craft === "crochet") {
    // 코바늘 호수 변환 (모사용 기준)
    const crochetSizes: { [key: number]: string } = {
      2.0: "2/0호",
      2.3: "3/0호",
      2.5: "4/0호",
      3.0: "5/0호",
      3.5: "6/0호",
      4.0: "7/0호",
      5.0: "8/0호",
      6.0: "10/0호",
    };
    return crochetSizes[mm] ? `(${crochetSizes[mm]})` : "";
  } else {
    // 대바늘 호수 변환 (한국/일본식)
    const knittingSizes: { [key: number]: string } = {
      2.1: "0호",
      2.4: "1호",
      2.7: "2호",
      3.0: "3호",
      3.3: "4호",
      3.6: "5호",
      3.9: "6호",
      4.2: "7호",
      4.5: "8호",
      4.8: "9호",
      5.1: "10호",
      5.4: "11호",
      5.7: "12호",
      6.0: "13호",
    };
    return knittingSizes[mm] ? `(${knittingSizes[mm]})` : "";
  }
}
