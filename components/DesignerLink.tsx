import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { designerHref, type Pattern } from "@/lib/patterns";

export default function DesignerLink({ pattern }: { pattern: Pattern }) {
  const name = pattern.pattern_author?.name || pattern.designer?.name;
  return name ? (
    <Link
      className="designer-link"
      href={designerHref(name)}
      aria-label={`${name} 작가의 도안 보기`}
    >
      <span className="designer-label">작가</span>
      <span className="designer-name">{name}</span>
      <ArrowUpRight size={15} aria-hidden="true" />
    </Link>
  ) : (
    <span className="designer-missing">작가 미등록</span>
  );
}
