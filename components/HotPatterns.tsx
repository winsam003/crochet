import Link from "next/link";
import { getHotPatterns } from "@/lib/ravelry";
import PatternImage from "./PatternImage";
export default async function HotPatterns({ craft = "crochet" }: { craft?: string }) {
  const patterns = await getHotPatterns("", craft);
  if (!patterns.length) return null;
  return (
    <section className="trending">
      <div className="section-heading">
        <div>
          <p className="eyebrow">ON THE NEEDLES, LATELY</p>
          <h2>요즘 눈길이 가는 도안</h2>
        </div>
        <Link className="text-link" href={`/?craft=${craft}&sort=recently-popular`}>
          더 살펴보기 ↗
        </Link>
      </div>
      <div className="mini-grid">
        {patterns.map((p, i) => (
          <Link href={`/pattern/${p.id}`} className="mini-card" key={p.id}>
            <div className="mini-photo">
              <PatternImage src={p.first_photo?.medium_url} alt={p.name} />
            </div>
            <span className="mini-index">0{i + 1}</span>
            <div>
              <h3>{p.name}</h3>
              <p className="mini-designer">
                <span className="designer-label">작가</span>{" "}
                {p.pattern_author?.name || p.designer?.name || "미등록"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
