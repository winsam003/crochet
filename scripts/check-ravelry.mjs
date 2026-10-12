// Optional, read-only live API smoke test. Requires .env.local; never logs credentials.
import assert from "node:assert/strict";
process.loadEnvFile(".env.local");
const headers = {
  Authorization: `Basic ${Buffer.from(`${process.env.RAVELRY_USER_ID}:${process.env.RAVELRY_API_KEY}`).toString("base64")}`,
};
async function get(path) {
  const response = await fetch(`https://api.ravelry.com/${path}`, {
    headers,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Ravelry HTTP ${response.status}`);
  return response.json();
}
for (const [name, filter, check] of [
  ["Korean language", "language=kr", (p) => p.languages?.some((l) => l.code === "kr")],
  ["Charts", "pa=chart", (p) => p.pattern_attributes?.some((a) => a.permalink === "chart")],
  [
    "Easy difficulty",
    "difficulties=1%7C2",
    (p) => p.difficulty_average > 0 && p.difficulty_average <= 2.5,
  ],
  ["Free availability", "availability=free", (p) => p.free === true],
]) {
  const data = await get(`patterns/search.json?craft=crochet&page_size=3&sort=projects&${filter}`);
  assert.ok(data.patterns.length, `${name}: empty result`);
  const ids = data.patterns.map((p) => p.id);
  const details = await get(`patterns.json?${new URLSearchParams({ ids: ids.join(" ") })}`);
  for (const id of ids) assert.ok(check(details.patterns[id]), `${name}: incorrect result ${id}`);
  console.log(`${name}: ${ids.length} verified patterns (${data.paginator.results} results)`);
}
