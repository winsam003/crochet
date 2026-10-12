import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  acquisition,
  detailHref,
  difficultyLabel,
  formatLabels,
  languageLabel,
  savedPattern,
  type Pattern,
} from "@/lib/patterns";
import { SaveButton } from "./Library";
import PatternImage from "./PatternImage";
export default function PatternCard({
  pattern: p,
  returnTo = "/",
  index = 0,
}: {
  pattern: Pattern;
  returnTo?: string;
  index?: number;
}) {
  const formats = formatLabels(p);
  const href = detailHref(p.id, returnTo);
  return (
    <article className="pattern-card">
      <div className="card-image">
        <Link href={href} aria-label={`${p.name} 상세 보기`}>
          <PatternImage
            src={
              p.first_photo?.medium2_url || p.photos?.[0]?.medium2_url || p.first_photo?.medium_url
            }
            alt={p.name}
            eager={index < 3}
          />
        </Link>
        <span className={`price-tag ${p.free ? "free" : ""}`}>
          {p.free === true ? "무료 제공" : p.free === false ? "유료" : "가격 미확인"}
        </span>
        <SaveButton pattern={savedPattern(p)} compact />
      </div>
      <div className="card-copy">
        <p className="eyebrow">{p.pattern_author?.name || p.designer?.name || "작가 미등록"}</p>
        <h3>
          <Link href={href}>{p.name}</Link>
        </h3>
        <p className="card-languages">
          {languageLabel(p)}
          {formats.length > 0 && ` / ${formats.slice(0, 2).join(" · ")}`}
        </p>
        <div className="card-specs">
          <span>{difficultyLabel(p)}</span>
          <span>
            {p.pattern_needle_sizes?.length
              ? `${[...new Set(p.pattern_needle_sizes.map((n) => n.metric))].join(" / ")} mm`
              : "바늘 미등록"}
          </span>
        </div>
        <Link className="card-bottom" href={href}>
          <span>{acquisition(p).label}</span>
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}
