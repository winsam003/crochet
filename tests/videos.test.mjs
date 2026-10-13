import { test } from "node:test";
import assert from "node:assert/strict";
import { videoSearchContext, selectRelatedVideos } from "../lib/video-matching.ts";

const pattern = {
  id: 134792,
  name: "Neat Ripple",
  designer: { name: "Lucy of Attic24" },
  craft: { permalink: "crochet" },
  pattern_categories: [{ permalink: "throw" }],
};
const video = (id, title, extra = {}) => ({
  id,
  title,
  description: "crochet tutorial",
  channel: "Maker",
  ...extra,
});
test("queries are derived from each pattern, with a Korean fallback", () => {
  const context = videoSearchContext(pattern);
  assert.equal(context.primary, "Attic24 물결 담요");
  assert.equal(context.fallback, "코바늘 물결 담요 뜨기");
  const other = videoSearchContext({
    id: 1,
    name: "Sunday Sweater",
    designer: { name: "PetiteKnit" },
    craft: { permalink: "knitting" },
  });
  assert.equal(other.primary, "PetiteKnit Sunday Sweater");
  assert.equal(other.fallback, "Sunday Sweater 대바늘");
  assert.equal(videoSearchContext({ id: 2, name: "Mystery" }).primary, "Mystery 뜨개");
});
test("Korean matches rank first; unrelated Korean videos and wrong crafts are removed", () => {
  const results = selectRelatedVideos(pattern, [
    video("abcdefghij1", "Neat Ripple crochet tutorial"),
    video("abcdefghij2", "코바늘 물결 담요 뜨기", { audioLanguage: "ko" }),
    video("abcdefghij3", "코바늘 꽃다발 담요"),
    video("abcdefghij4", "대바늘 물결 담요"),
    video("abcdefghij5", "Attic24 crochet interview"),
    video("abcdefghij6", "코바늘 물결 담요", { available: false }),
  ]);
  assert.deepEqual(
    results.map((v) => v.id),
    ["abcdefghij2", "abcdefghij1"],
  );
  assert.equal(results[0].matchLabel, "비슷한 작품·기법");
  assert.equal(results[0].languageLabel, "한국어 음성");
  assert.equal(results[1].matchLabel, "도안명 언급");
});
test("deduplicates, caps at five, and never pads empty or sparse results", () => {
  const candidate = video("abcdefghij1", "Neat Ripple crochet");
  assert.equal(selectRelatedVideos(pattern, [candidate, candidate]).length, 1);
  assert.equal(selectRelatedVideos(pattern, []).length, 0);
  assert.equal(
    selectRelatedVideos(
      pattern,
      Array.from({ length: 8 }, (_, i) => video(`abcdefghij${i}`, "코바늘 물결 담요")),
    ).length,
    5,
  );
  assert.equal(selectRelatedVideos(pattern, [video("bad/id", "Neat Ripple crochet")]).length, 0);
});

test("keeps clear Korean feature matches while excluding brief promotional clips", () => {
  const results = selectRelatedVideos(pattern, [
    video("abcdefghij1", "배색하며 만들기 좋은, 물결 블랭킷", {
      description: "",
      audioLanguage: "ko",
      duration: "PT17M21S",
    }),
    video("abcdefghij2", "코바늘 물결 담요", { duration: "PT14S" }),
  ]);
  assert.deepEqual(
    results.map((v) => v.id),
    ["abcdefghij1"],
  );
});
test("Korean titles do not claim Korean audio, and generic pattern names do not match everything", () => {
  const results = selectRelatedVideos(pattern, [
    video("abcdefghij1", "코바늘 물결 담요", { audioLanguage: "en" }),
  ]);
  assert.equal(results[0].languageLabel, "한국어 제목·설명");
  assert.equal(
    selectRelatedVideos({ id: 1, name: "Hat" }, [video("abcdefghij2", "What I crochet")]).length,
    0,
  );
});
