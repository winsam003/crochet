// Read-only live feasibility check. Never logs API credentials.
import assert from "node:assert/strict";
process.loadEnvFile(".env.local");
assert.ok(process.env.RAVELRY_USER_ID && process.env.RAVELRY_API_KEY, "Missing credentials");
const headers = {
  Authorization: `Basic ${Buffer.from(`${process.env.RAVELRY_USER_ID}:${process.env.RAVELRY_API_KEY}`).toString("base64")}`,
};
async function get(path, params) {
  const response = await fetch(`https://api.ravelry.com/${path}?${new URLSearchParams(params)}`, {
    headers,
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  return response.json();
}
const searches = await Promise.allSettled(
  ["Schachenmayr Catania", "바늘이야기", "하이소프트", "코튼필드", "동방", "필트위스트", "벨벳", "Dongbang", "Phil Twist", "zzzz-no-such-yarn-839271"].map(async (query) => {
    const data = await get("yarns/search.json", { query, page_size: "3" });
    console.log(JSON.stringify({ kind: "yarn-search", query, total: data.paginator.results,
      samples: data.yarns.map(y => ({ id: y.id, name: y.name, brand: y.yarn_company_name,
        weight: y.yarn_weight?.name, grams: y.grams, meters: y.yardage ? Math.round(y.yardage * 0.9144) : null })) }));
    if (query.startsWith("zzzz-")) assert.equal(data.yarns.length, 0);
    return data;
  }),
);
for (const result of searches) if (result.status === "rejected") throw result.reason;
const yarnId = searches[0].value.yarns[0].id;
const { yarn } = await get(`yarns/${yarnId}.json`, {});
const domesticId = searches[2].value.yarns.find(y => y.yarn_weight?.name === "DK")?.id;
assert.ok(domesticId, "Domestic yarn sample missing");
const { yarn: domesticYarn } = await get(`yarns/${domesticId}.json`, {});
assert.ok(domesticYarn.yarn_weight && domesticYarn.yardage && domesticYarn.grams);
console.log(JSON.stringify({ kind: "domestic-yarn-detail", id: domesticYarn.id,
  name: domesticYarn.name, weight: domesticYarn.yarn_weight.name, grams: domesticYarn.grams,
  meters: Math.round(domesticYarn.yardage * 0.9144), fibers: domesticYarn.yarn_fibers }));
assert.ok(yarn.yarn_weight && yarn.yardage && yarn.grams);
console.log(JSON.stringify({ kind: "yarn-detail", id: yarn.id, name: yarn.name,
  weight: yarn.yarn_weight, grams: yarn.grams, yardage: yarn.yardage,
  fibers: yarn.yarn_fibers, gauge: yarn.min_gauge, gaugeDivisor: yarn.gauge_divisor,
  needleSizes: yarn.yarn_needle_sizes }));
for (const weight of ["sport", "dk", "worsted"]) {
  const data = await get("patterns/search.json", {
    craft: "crochet", weight, page_size: "12", sort: "projects", photo: "yes",
  });
  assert.equal(data.patterns.length, 12);
  const details = await get("patterns.json", { ids: data.patterns.map(p => p.id).join(" ") });
  const patterns = data.patterns.map(p => details.patterns[p.id]);
  for (const p of patterns) {
    assert.ok(p, "Missing batch detail");
    assert.equal(p.craft.permalink, "crochet");
    assert.equal(p.yarn_weight.name.toLowerCase(), weight, `Weight filter ignored: ${p.id}`);
  }
  const selectedYarn = weight === "dk" ? domesticYarn : yarn;
  const ownedMeters = selectedYarn.yardage * 0.9144 * 3;
  const candidates = patterns.filter(p => p.yardage > 0 && p.yardage_max > 0 &&
    Math.max(p.yardage, p.yardage_max) * 0.9144 <= ownedMeters);
  console.log(JSON.stringify({ kind: "pattern-match", weight, total: data.paginator.results,
    verified: patterns.length, withYardage: patterns.filter(p => p.yardage > 0).length,
    withMaxYardage: patterns.filter(p => p.yardage_max > 0).length,
    withGauge: patterns.filter(p => p.gauge > 0).length,
    withYarnPacks: patterns.filter(p => p.packs?.length).length,
    ...(["sport", "dk"].includes(weight) ? { scenario: `${selectedYarn.name}, 3 balls`, ownedMeters: Math.round(ownedMeters),
      lengthCandidates: candidates.map(p => ({ id: p.id, name: p.name,
        minMeters: Math.round(p.yardage * 0.9144), maxMeters: Math.round(p.yardage_max * 0.9144),
        yarns: p.packs?.map(pack => ({ name: pack.yarn?.name || pack.yarn_name, id: pack.yarn?.id })) })) } : {}) }));
}
console.log("PASS: yarn search, yarn details, unknown-name handling, batch details, and three weight filters verified.");
