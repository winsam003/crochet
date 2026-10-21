type Designer = { name: string; permalink: string };

// Ravelry's `designer` filter searches words; `designer-link` selects one author.
export async function designerFilter(
  name: string,
  lookup: (slug: string) => Promise<Designer | null>,
) {
  const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();
  const slug = normalize(name)
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
  const author = slug ? await lookup(slug) : null;
  return author && normalize(author.name) === normalize(name) && author.permalink
    ? { key: "designer-link", value: author.permalink }
    : { key: "designer", value: name };
}
