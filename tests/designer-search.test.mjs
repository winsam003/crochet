import { test } from "node:test";
import assert from "node:assert/strict";
import { designerFilter } from "../lib/designer-search.ts";

test("full designer names select the exact author instead of broad word matching", async () => {
  for (const name of ["The Knitting", " THE   KNITTING "]) {
    const filter = await designerFilter(name, async (slug) => {
      assert.equal(slug, "the-knitting");
      return { name: "The Knitting", permalink: "the-knitting" };
    });
    assert.deepEqual(filter, { key: "designer-link", value: "the-knitting" });
  }
});

test("partial names and slug collisions do not silently select a different author", async () => {
  for (const author of [null, { name: "Other Author", permalink: "other-author" }]) {
    assert.deepEqual(await designerFilter("Knitting", async () => author), {
      key: "designer",
      value: "Knitting",
    });
  }
});

test("lookup failures do not silently broaden a designer search", async () => {
  await assert.rejects(
    designerFilter("The Knitting", async () => {
      throw new Error("Ravelry HTTP 503");
    }),
    /503/,
  );
});
