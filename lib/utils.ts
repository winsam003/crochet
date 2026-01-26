import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/utils.ts (혹은 별도 파일)
export function translateYarnWeight(weightDescription: string) {
  if (!weightDescription) return "정보 없음";

  const lowerWeight = weightDescription.toLowerCase();

  if (lowerWeight.includes("thread")) return "레이스용 (실)";
  if (lowerWeight.includes("cobweb")) return "아주 가는 실 (1겹)";
  if (lowerWeight.includes("lace")) return "가는 실 (레이스)";
  if (lowerWeight.includes("fingering")) return "보통 가는 실 (4합)";
  if (lowerWeight.includes("sport")) return "중간 가는 실 (5합)";
  if (lowerWeight.includes("dk")) return "중간 실 (6~8합)";
  if (lowerWeight.includes("worsted")) return "약간 굵은 실 (10합)";
  if (lowerWeight.includes("aran")) return "굵은 실 (10~12합)";
  if (lowerWeight.includes("bulky")) return "매우 굵은 실 (소품용)";
  if (lowerWeight.includes("super bulky")) return "초특대 굵은 실";
  if (lowerWeight.includes("jumbo")) return "자이언트 얀";

  return weightDescription; // 매칭되는 게 없으면 원문 표시
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
