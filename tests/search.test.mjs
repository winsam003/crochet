import { test } from "node:test";
import assert from "node:assert/strict";
import { interpretSearch, searchLink } from "../lib/patterns.ts";
import { keywordCount } from "../lib/search-keywords.ts";

test("character names survive general keyword matching and compact input", () => {
  for (const [query, expected] of [
    ["미니언", "minion"],
    ["미니 마우스", "minnie mouse"],
    ["곰돌이 푸", "winnie the pooh"],
    ["헬로 키티", "hello kitty"],
    ["피카츄인형", "pikachu"],
    ["시나몬롤", "cinnamoroll"],
    ["스폰지밥 뚱이", "patrick star"],
    ["산리오 쿠로미", "kuromi"],
    ["포켓몬 잠만보", "snorlax"],
    ["해바라기", "sunflower"],
    ["달팽이", "snail"],
  ])
    assert.equal(interpretSearch({ query }).query, expected, query);
  assert.ok(keywordCount >= 200);
});

test("ambiguous names use context regardless of word order", () => {
  for (const query of ["스폰지밥 진주", "진주 스폰지밥"]) {
    const s = interpretSearch({ query });
    assert.equal(s.query, "pearl krabs");
    assert.equal(s.choices.length, 0);
  }
  assert.equal(interpretSearch({ query: "진주 목도리" }).query, "pearl scarf");
  assert.ok(interpretSearch({ query: "진주" }).choices.some((c) => c.query === "pearl krabs"));
  assert.equal(interpretSearch({ query: "팝콘 스티치" }).query, "popcorn stitch");
  assert.equal(interpretSearch({ query: "디즈니 스티치" }).query, "lilo stitch");
  assert.equal(interpretSearch({ query: "스티치" }).choices.length, 2);
  assert.equal(interpretSearch({ query: "데이지 꽃" }).query, "daisy");
  assert.equal(interpretSearch({ query: "디즈니 데이지" }).query, "daisy duck");
  assert.equal(interpretSearch({ query: "무" }).query, "무");
});

test("unknown words and unrelated English names are preserved", () => {
  for (const query of ["미니멀리즘", "곰작가", "이름모를캐릭터", "뮤지컬", "Patrick Star"]) {
    assert.equal(interpretSearch({ query }).query, query);
  }
  assert.equal(interpretSearch({ query: "새캐릭터 무료 인형" }).query, "새캐릭터");
  assert.equal(interpretSearch({ query: "무료 Pikachu 피카츄 인형" }).query, "Pikachu");
});

test("explicit filters including all override keyword inference", () => {
  const s = interpretSearch({
    query: "무료 코바늘 초보 피카츄 인형",
    craft: "knitting",
    free: "online",
    difficulty: "",
    category: "hat",
  });
  assert.equal(s.craft, "knitting");
  assert.equal(s.availability, "online");
  assert.equal(s.difficulty, "");
  assert.equal(s.category, "hat");
  const all = interpretSearch({
    query: "무료 대바늘 초보 인형",
    craft: "all",
    category: "",
    free: "",
    difficulty: "",
  });
  assert.equal(all.craft, "");
  assert.equal(all.category, "");
  assert.equal(all.availability, "");
  assert.equal(all.difficulty, "");
  const auto = interpretSearch({
    query: "무료 대바늘 초보 인형",
    craft: "auto",
    category: "auto",
    free: "auto",
    difficulty: "auto",
  });
  assert.equal(auto.craft, "knitting");
  assert.equal(auto.category, "softies");
  assert.equal(auto.availability, "free");
  assert.equal(auto.difficulty, "easy");
});

test("characters do not imply toys or a Korean language constraint", () => {
  const s = interpretSearch({ query: "피카츄" });
  assert.equal(s.category, "");
  assert.equal(s.language, "");
  assert.equal(interpretSearch({ query: "피카츄 인형" }).query, "pikachu");
  assert.equal(interpretSearch({ query: "피카츄 모자 가방" }).category, "");
});

test("raw mode preserves text and does not infer filters", () => {
  const s = interpretSearch({ query: "무료 대바늘 피카츄 인형", mode: "raw" });
  assert.equal(s.query, "무료 대바늘 피카츄 인형");
  assert.equal(s.availability, "");
  assert.equal(s.category, "");
  assert.equal(s.choices.length, 0);
});

test("recovery links retain other effective filters, clear page and do not re-infer removed filters", () => {
  const input = { query: "무료 초보 피카츄 인형", language: "kr", page: "8" };
  const url = new URL(searchLink(input, { difficulty: "" }), "https://example.com");
  const next = interpretSearch(Object.fromEntries(url.searchParams));
  assert.equal(next.difficulty, "");
  assert.equal(next.availability, "free");
  assert.equal(next.category, "softies");
  assert.equal(next.language, "kr");
  assert.equal(next.page, 1);
  assert.equal(next.query, "pikachu");
  const rawUrl = new URL(searchLink(input, { mode: "raw" }), "https://example.com");
  const raw = interpretSearch(Object.fromEntries(rawUrl.searchParams));
  assert.equal(raw.query, input.query);
  assert.equal(raw.category, "softies");
  assert.equal(raw.availability, "free");
});

test("grammatical suffixes are stripped only from recognized words", () => {
  assert.equal(interpretSearch({ query: "피카츄의 인형 도안 추천" }).query, "pikachu");
  assert.equal(interpretSearch({ query: "처음본이름의 인형" }).query, "처음본이름의");
  assert.equal(interpretSearch({ query: "귀여운토끼" }).query, "cute rabbit");
});

test("adjectives translate with spaced and compact subjects", () => {
  for (const query of ["귀여운 피카츄", "귀여운피카츄", "깜찍한 피카추"]) {
    const s = interpretSearch({ query });
    assert.equal(s.query, "cute pikachu");
    assert.equal(s.broaderSearch.query, "pikachu");
  }
  assert.equal(interpretSearch({ query: "아주 큰 피카츄" }).query, "giant pikachu");
  assert.equal(interpretSearch({ query: "작은 폭신한 토끼" }).broaderSearch.query, "rabbit");
  assert.equal(interpretSearch({ query: "귀여운" }).broaderSearch, null);
  assert.equal(interpretSearch({ query: "피카츄" }).broaderSearch, null);
  assert.equal(interpretSearch({ query: "귀여운 피카츄", mode: "raw" }).broaderSearch, null);
  assert.equal(interpretSearch({ query: "귀여운 새이름" }).broaderSearch.query, "새이름");
});

test("broader search retains filters and resets pagination, including category-only subjects", () => {
  for (const subject of ["피카츄 인형", "가방"]) {
    const input = { query: `무료 쉬운 귀여운 ${subject}`, language: "kr", page: "8" };
    const s = interpretSearch(input);
    const url = new URL(
      searchLink(input, { query: s.broaderSearch.query, mode: "raw" }),
      "https://example.com",
    );
    const next = interpretSearch(Object.fromEntries(url.searchParams));
    assert.equal(next.query, subject === "가방" ? "" : "pikachu");
    assert.equal(next.category, s.category);
    assert.equal(next.availability, "free");
    assert.equal(next.difficulty, "easy");
    assert.equal(next.language, "kr");
    assert.equal(next.page, 1);
    assert.equal(next.broaderSearch, null);
  }
});
