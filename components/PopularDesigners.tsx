import { getPopularDesigners } from "@/lib/ravelry";
import DesignerRecommendations from "./DesignerRecommendations";

export default async function PopularDesigners() {
  const [crochet, knitting] = await Promise.all([
    getPopularDesigners("crochet"),
    getPopularDesigners("knitting"),
  ]);
  if (!crochet.length && !knitting.length) return null;

  return (
    <section className="popular-designers" aria-labelledby="popular-designers-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">MEET THE MAKERS</p>
          <h2 id="popular-designers-title">요즘 눈길이 가는 인기 작가</h2>
        </div>
      </div>
      <DesignerRecommendations crochet={crochet} knitting={knitting} />
    </section>
  );
}
