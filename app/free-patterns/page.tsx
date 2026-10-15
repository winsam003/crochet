import FreePatternsContent, {
  freePatternsMetadata,
  freeSelection,
  type FreeSearchParams,
} from "@/components/FreePatternsContent";

type Props = { searchParams: Promise<FreeSearchParams> };
export async function generateMetadata({ searchParams }: Props) {
  const raw = await searchParams;
  return freePatternsMetadata(raw, freeSelection(raw).category);
}
export default async function FreePatternsPage({ searchParams }: Props) {
  const raw = await searchParams;
  return <FreePatternsContent searchParams={Promise.resolve(raw)} />;
}
