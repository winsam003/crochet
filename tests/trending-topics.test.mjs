import { test } from "node:test";
import assert from "node:assert/strict";
import { rankTopics, searchCount } from "../lib/trending-topics.ts";

const row = (relKeyword, pc, mobile = 0) => ({
  relKeyword,
  monthlyPcQcCnt: pc,
  monthlyMobileQcCnt: mobile,
});

test("rank distinct subjects by largest keyword, without adding overlapping variants", () => {
  const topics = rankTopics([
    row("코바늘가방도안", 70, 30),
    row("뜨개가방", 90),
    row("목도리뜨기", 110),
    row("수세미뜨기", 50),
    row("코바늘가방도안", 70, 30),
    row("뜨개실", 10000),
    row("코바늘가방키트", 20000),
    row("코바늘학원", 30000),
    row("니트모자", 40000),
    row("코바늘가방실", 50000),
  ]);
  assert.deepEqual(
    topics.map((t) => [t.id, t.monthlySearches]),
    [
      ["scarf", 110],
      ["bag", 100],
      ["scrubbie", 50],
    ],
  );
});

test("preserve explicit craft and avoid inventing craft for broad keywords", () => {
  assert.equal(rankTopics([row("대바늘조끼도안", 100)])[0].params.craft, "knitting");
  assert.equal(rankTopics([row("코바늘가방뜨기", 100)])[0].params.craft, "crochet");
  assert.equal(rankTopics([row("목도리뜨개질", 100)])[0].params.craft, "all");
});

test("handle suppressed counts conservatively and reject corrupt data", () => {
  assert.equal(searchCount("< 10"), 0);
  assert.equal(rankTopics([row("수세미도안", "< 10", 20)])[0].monthlySearches, 20);
  assert.throws(() => searchCount("unknown"));
  assert.throws(() => searchCount(-10));
});
