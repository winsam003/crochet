import { test } from "node:test";
import assert from "node:assert/strict";
import { FREE_CATEGORIES, freeCategory, freePatternUrl } from "../lib/free-patterns.ts";
import { safeReturn } from "../lib/patterns.ts";

test("each free category has a distinct path and preserves the API category", () => {
  const urls = FREE_CATEGORIES.map((category) =>
    freePatternUrl("crochet", "all", category.id, "projects"),
  );
  assert.equal(new Set(urls).size, 8);
  for (const category of FREE_CATEGORIES) {
    assert.equal(freeCategory(category.slug)?.id, category.id);
    assert.equal(
      freePatternUrl("crochet", "all", category.id, "projects"),
      `/free-patterns/${category.slug}`,
    );
  }
});

test("category pagination preserves craft, language collection, and sort", () => {
  const url = freePatternUrl("knitting", "korean", "bag", "favorites", 3);
  assert.equal(url, "/free-patterns/bags?craft=knitting&collection=korean&sort=favorites&page=3");
  assert.equal(safeReturn(url), url);
  assert.equal(
    freePatternUrl("knitting", "chart", "softies", "date"),
    "/free-patterns/dolls?craft=knitting&collection=chart&sort=date",
  );
  assert.equal(freePatternUrl("crochet", "all", "", "projects"), "/free-patterns");
});

test("category return links reject unknown paths and traversal", () => {
  for (const value of [
    "/free-patterns/bags/../../evil",
    "/free-patterns/bags\\evil",
    "/free-patterns/bags-evil",
    "/free-patterns/%2e%2e",
    "//evil.test/free-patterns/bags",
  ]) {
    assert.equal(safeReturn(value), "/");
  }
  for (const category of FREE_CATEGORIES) {
    assert.equal(safeReturn(`/free-patterns/${category.slug}`), `/free-patterns/${category.slug}`);
  }
});
