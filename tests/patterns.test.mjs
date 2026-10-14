import { test } from "node:test";
import assert from "node:assert/strict";
import {
  acquisition,
  designerHref,
  interpretSearch,
  meterage,
  safeReturn,
  safeUrl,
  languageLabel,
  difficultyLabel,
} from "../lib/patterns.ts";
test("free blog and paid PDF remain distinct", () => {
  const result = acquisition({
    id: 1,
    name: "Test",
    free: true,
    url: "https://example.com/free-pattern",
    download_location: {
      free: false,
      type: "ravelry",
      url: "http://www.ravelry.com/purchase/test/1",
    },
  });
  assert.equal(result.label, "무료 제공 · 다운로드는 유료");
  assert.equal(result.links[1].label, "도안 구매처로 가기");
  assert.equal(result.links[1].url, "https://www.ravelry.com/purchase/test/1");
  assert.equal(result.links[0].url, "https://example.com/free-pattern");
});
test("missing link remains actionable through canonical source", () => {
  const r = acquisition({ id: 2, name: "Test", free: false, permalink: "example" });
  assert.equal(r.links.length, 0);
  assert.equal(r.original, "https://www.ravelry.com/patterns/library/example");
});
test("unsafe external URLs and return URLs are rejected", () => {
  assert.equal(safeUrl("javascript:alert(1)"), undefined);
  assert.equal(safeReturn("//evil.com"), "/");
  assert.equal(safeReturn("/?category=bag&page=3"), "/?category=bag&page=3");
  assert.equal(
    safeReturn("/free-patterns?craft=knitting&collection=chart&page=2"),
    "/free-patterns?craft=knitting&collection=chart&page=2",
  );
  assert.equal(safeReturn("/free-patterns"), "/free-patterns");
  assert.equal(safeReturn("/free-patterns/../../evil"), "/");
  assert.equal(safeReturn("/free-patterns.evil.com"), "/");
});
test("Korean intent becomes structured search filters", () => {
  const s = interpretSearch({ query: "초보 코바늘 가방", page: "-3" });
  assert.equal(s.query, "");
  assert.equal(s.craft, "crochet");
  assert.equal(s.category, "bag");
  assert.equal(s.difficulty, "easy");
  assert.equal(s.page, 1);
  const next = interpretSearch({ query: "무료 대바늘 토끼", format: "chart", language: "kr" });
  assert.equal(next.query, "rabbit");
  assert.equal(next.availability, "free");
  assert.equal(next.craft, "knitting");
  assert.equal(next.language, "kr");
});
test("invalid query filter values are not forwarded", () => {
  const s = interpretSearch({
    craft: "bad",
    sort: "bad",
    page: "Infinity",
    format: "bad",
    language: "ko",
  });
  assert.equal(s.sort, "projects");
  assert.equal(s.craft, "crochet");
  assert.equal(s.format, "");
  assert.equal(s.page, 1000);
  assert.equal(s.language, "");
});
test("length converts yards to meters and missing ratings are not easy", () => {
  assert.equal(meterage({ id: 1, name: "x", yardage: 100, yardage_max: 200 }), "91–183 m");
  assert.equal(difficultyLabel({ id: 1, name: "x", difficulty_average: 0 }), "난이도 평가 없음");
});
test("Ravelry uses kr, Korean language is shown first", () => {
  assert.equal(
    languageLabel({
      id: 1,
      name: "x",
      languages: [
        { code: "en", name: "English" },
        { code: "kr", name: "Korean" },
      ],
    }),
    "한국어 · 영어",
  );
});

test("designer searches preserve names and search both crafts by default", () => {
  const s = interpretSearch({
    designer: "  무료 꽃 Studio  ",
    craft: "auto",
    query: "가방",
    page: "2",
  });
  assert.equal(s.designer, "무료 꽃 Studio");
  assert.equal(s.query, "");
  assert.equal(s.category, "bag");
  assert.equal(s.availability, "");
  assert.equal(s.craft, "");
  assert.equal(s.page, 2);
  assert.equal(interpretSearch({ designer: "PetiteKnit" }).craft, "");
  assert.equal(interpretSearch({ designer: "PetiteKnit", craft: "knitting" }).craft, "knitting");
  assert.equal(interpretSearch({ designer: "Sarah Zimmerman", craft: "crochet" }).craft, "crochet");
  assert.equal(interpretSearch({ craft: "auto" }).craft, "crochet");
  assert.equal(interpretSearch({ craft: "all" }).craft, "");
  assert.equal(interpretSearch({ designer: " ".repeat(10) }).designer, "");
  assert.equal(interpretSearch({ designer: "a".repeat(200) }).designer.length, 160);
});
test("designer links safely preserve special characters and reset other filters", () => {
  const url = new URL(designerHref("A&B / 꽃 + Studio"), "https://example.com");
  assert.equal(url.searchParams.get("designer"), "A&B / 꽃 + Studio");
  assert.equal(url.searchParams.get("craft"), "all");
  assert.equal(url.searchParams.has("page"), false);
  assert.equal(url.hash, "#results");
});
