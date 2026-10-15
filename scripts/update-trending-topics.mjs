import { createHmac } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { rankTopics, TREND_SEEDS } from "../lib/trending-topics.ts";

const root = new URL("../", import.meta.url);
const env = new URL(".env.local", root);
if (existsSync(env)) process.loadEnvFile(fileURLToPath(env));

async function json(url, headers) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${new URL(url).hostname}: HTTP ${response.status}`);
  return response.json();
}

async function update() {
  for (const key of [
    "NAVER_AD_ACCESS_LICENSE",
    "NAVER_AD_SECRET_KEY",
    "NAVER_AD_CUSTOMER_ID",
    "RAVELRY_USER_ID",
    "RAVELRY_API_KEY",
  ]) {
    if (!process.env[key]) throw new Error(`Missing environment variable: ${key}`);
  }
  const path = "/keywordstool";
  const timestamp = String(Date.now());
  const headers = {
    "X-Timestamp": timestamp,
    "X-API-KEY": process.env.NAVER_AD_ACCESS_LICENSE,
    "X-Customer": process.env.NAVER_AD_CUSTOMER_ID,
    "X-Signature": createHmac("sha256", process.env.NAVER_AD_SECRET_KEY)
      .update(`${timestamp}.GET.${path}`)
      .digest("base64"),
  };
  // Reuse an already collected response when reviewing the first snapshot.
  const inputIndex = process.argv.indexOf("--input");
  const data =
    inputIndex >= 0
      ? JSON.parse(await readFile(process.argv[inputIndex + 1], "utf8"))
      : await json(
          `https://api.searchad.naver.com${path}?${new URLSearchParams({ hintKeywords: TREND_SEEDS.join(","), showDetail: "1" })}`,
          headers,
        );
  if (!Array.isArray(data.keywordList) || !data.keywordList.length)
    throw new Error("Empty Naver keyword response");
  const topics = [];
  for (const candidate of rankTopics(data.keywordList)) {
    const params = new URLSearchParams({
      query: candidate.params.query,
      pc: candidate.params.category,
      photo: "yes",
      page_size: "6",
      sort: "recently-popular",
    });
    if (candidate.params.craft !== "all") params.set("craft", candidate.params.craft);
    const result = await json(`https://api.ravelry.com/patterns/search.json?${params}`, {
      Authorization: `Basic ${Buffer.from(`${process.env.RAVELRY_USER_ID}:${process.env.RAVELRY_API_KEY}`).toString("base64")}`,
    });
    if (!Array.isArray(result.patterns)) throw new Error("Invalid Ravelry response");
    if (!result.patterns.length) continue;
    topics.push({ ...candidate, rank: topics.length + 1 });
    if (topics.length === 3) break;
  }
  if (topics.length !== 3)
    throw new Error("Fewer than three verified topics; existing snapshot preserved");
  const snapshot = {
    source: "naver-searchad",
    updatedAt: new Date().toISOString(),
    seeds: TREND_SEEDS,
    methodology:
      "연관 키워드 중 도안 주제로 연결 가능한 검색어를 선별. 주제별 최대 검색량의 대표 검색어 기준, PC·모바일 합계. 10 미만은 0으로 계산. Ravelry 도안 검색 결과가 있는 주제만 선정.",
    topics,
  };
  await mkdir(new URL("data/", root), { recursive: true });
  const output = new URL("data/trending-topics.json", root);
  const temporary = new URL("data/trending-topics.json.tmp", root);
  await writeFile(temporary, JSON.stringify(snapshot, null, 2) + "\n");
  await rename(temporary, output);
  console.log(
    topics
      .map(
        (topic) =>
          `${topic.rank}. ${topic.title}: ${topic.keyword} (${topic.monthlySearches.toLocaleString("ko-KR")})`,
      )
      .join("\n"),
  );
  console.log(
    "Saved data/trending-topics.json. Daily workflow publishes it to the trend-data branch.",
  );
}

update().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
