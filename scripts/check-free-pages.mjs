import assert from "node:assert/strict";
import { FREE_CATEGORIES } from "../lib/free-patterns.ts";

const origin = "http://localhost:3000";
async function read(path) {
  const response = await fetch(`${origin}${path}`, {
    redirect: "manual",
    headers: { "User-Agent": "Googlebot" },
  });
  return { response, html: await response.text() };
}
function canonical(html) {
  return html.match(/<link rel="canonical" href="([^"]+)"/)?.[1].replaceAll("&amp;", "&");
}
for (const category of FREE_CATEGORIES) {
  const path = `/free-patterns/${category.slug}`;
  const { response, html } = await read(path);
  assert.equal(response.status, 200, path);
  assert.ok(html.includes(`코바늘 ${category.label} 무료 도안 모음`), path);
  assert.equal(canonical(html), `https://crochet.winsam.xyz${path}`);
  assert.ok(html.includes(category.tips[0]));
  assert.ok(html.includes(`from=${encodeURIComponent(path)}`), `${path}: detail return link`);
  console.log(`PASS ${path}: title, canonical, guide, detail return link`);
}
const filtered = "/free-patterns/bags?craft=knitting&collection=chart&sort=favorites&page=2";
const { html: filteredHtml } = await read(filtered);
assert.equal(canonical(filteredHtml), `https://crochet.winsam.xyz${filtered}`);
assert.ok(filteredHtml.includes("대바늘 가방·파우치 무료 도안 모음"));
assert.ok(
  filteredHtml.includes(
    "craft=knitting&amp;collection=chart&amp;sort=favorites&amp;page=3#results",
  ),
);
console.log("PASS filtered category: craft, format, sort, pagination");
assert.ok(
  filteredHtml.includes('href="/free-patterns?craft=knitting&amp;collection=chart&amp;sort=favorites"'),
  "breadcrumb preserves selected filters",
);
const overflow = await read("/free-patterns/bags?collection=korean&page=1000");
// Next.js may stream headers before the API responds; redirects then use a refresh tag.
const overflowLocation =
  overflow.response.headers.get("location") ||
  overflow.html.match(/<meta[^>]+http-equiv="refresh"[^>]+content="[^\"]*url=([^\"]+)"/)?.[1];
assert.ok(
  overflowLocation?.startsWith("/free-patterns/bags?collection=korean"),
  "out-of-range page redirects to a valid page",
);
assert.ok(!overflowLocation.includes("page=1000"));
console.log("PASS breadcrumb filters and out-of-range page redirect");
const legacy = await read(
  "/free-patterns?category=bag&craft=knitting&collection=chart&sort=favorites&page=2",
);
assert.equal(legacy.response.status, 308);
assert.equal(legacy.response.headers.get("location"), filtered);
console.log("PASS legacy category: permanent redirect preserves filters");
const unknown = await read("/free-patterns/not-a-category");
assert.equal(unknown.response.status, 404);
const { html: sitemap } = await read("/sitemap.xml");
for (const category of FREE_CATEGORIES)
  assert.ok(sitemap.includes(`/free-patterns/${category.slug}`));
console.log("PASS unknown category 404 and sitemap");
const { html: main } = await read("/free-patterns");
for (const category of FREE_CATEGORIES)
  assert.ok(main.includes(`href="/free-patterns/${category.slug}"`));
console.log("PASS free pattern directory links");
