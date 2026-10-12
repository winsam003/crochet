import Link from "next/link";
import { getRelatedPatterns } from "@/lib/ravelry";
import PatternImage from "./PatternImage";
export default async function RelatedPatterns({
  category,
  craft,
  id,
}: {
  category: string;
  craft: string;
  id: number;
}) {
  if (!category) return null;
  const patterns = await getRelatedPatterns(category, craft, id);
  if (!patterns.length) return null;
  return (
    <section className="related">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A FEW MORE IDEAS</p>
          <h2>같은 종류의 다른 도안</h2>
        </div>
        <p className="section-note">같은 카테고리 · 완성작 많은 순</p>
      </div>
      <div className="mini-grid">
        {patterns.map((p) => (
          <Link href={`/pattern/${p.id}`} className="mini-card" key={p.id}>
            <div className="mini-photo">
              <PatternImage src={p.first_photo?.medium_url} alt={p.name} />
            </div>
            <div>
              <h3>{p.name}</h3>
              <p>{p.designer?.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
