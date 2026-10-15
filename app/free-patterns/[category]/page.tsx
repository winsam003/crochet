import { notFound } from "next/navigation";
import FreePatternsContent, {
  freePatternsMetadata,
  type FreeSearchParams,
} from "@/components/FreePatternsContent";
import { FREE_CATEGORIES } from "@/lib/free-patterns";

export const dynamicParams = false;
export function generateStaticParams() {
  return FREE_CATEGORIES.map(({ slug }) => ({ category: slug }));
}

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<FreeSearchParams>;
};
async function topicFromParams(params: Props["params"]) {
  const { category } = await params;
  const topic = FREE_CATEGORIES.find((item) => item.slug === category);
  if (!topic) notFound();
  return topic;
}
export async function generateMetadata({ params, searchParams }: Props) {
  const topic = await topicFromParams(params);
  return freePatternsMetadata(await searchParams, topic.id);
}
export default async function FreeCategoryPage({ params, searchParams }: Props) {
  const topic = await topicFromParams(params);
  return <FreePatternsContent category={topic.id} searchParams={searchParams} />;
}
