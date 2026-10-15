import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { selectTrendingSnapshot, validTrendingSnapshot } from "../lib/trending-topics-fallback.ts";

const saved = JSON.parse(readFileSync(new URL("../data/trending-topics.json", import.meta.url)));

test("valid remote data wins; saved data is used when remote is unavailable", () => {
  const remote = { ...saved, updatedAt: "2026-10-16T00:00:00Z" };
  assert.equal(selectTrendingSnapshot(remote, saved), remote);
  assert.equal(selectTrendingSnapshot(undefined, saved), saved);
});

test("missing, empty, malformed snapshots fall back to three unranked discovery topics", () => {
  for (const invalid of [
    undefined,
    null,
    {},
    [],
    "invalid",
    { ...saved, topics: [] },
    { ...saved, topics: [null, null, null] },
    { ...saved, updatedAt: "bad-date" },
  ]) {
    assert.equal(validTrendingSnapshot(invalid), false);
    const result = selectTrendingSnapshot(invalid, invalid);
    assert.equal(result.source, "default");
    assert.equal(result.updatedAt, null);
    assert.equal(result.topics.length, 3);
    assert.ok(
      result.topics.every(
        (topic) => topic.rank === undefined && topic.monthlySearches === undefined,
      ),
    );
    assert.deepEqual(
      result.topics.map((topic) => topic.params.category),
      ["bag", "softies", "home"],
    );
  }
});

test("duplicate subjects and missing search conditions are invalid", () => {
  assert.equal(
    validTrendingSnapshot({
      ...saved,
      topics: saved.topics.map((topic) => ({ ...topic, id: "same" })),
    }),
    false,
  );
  assert.equal(
    validTrendingSnapshot({
      ...saved,
      topics: saved.topics.map((topic) => ({ ...topic, params: null })),
    }),
    false,
  );
});
