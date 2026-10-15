import { NextResponse, type NextRequest } from "next/server";
import { FREE_CATEGORIES } from "@/lib/free-patterns";

// Redirect before streaming starts so crawlers receive an actual HTTP 308.
export function proxy(request: NextRequest) {
  const category = FREE_CATEGORIES.find(
    (item) => item.id === request.nextUrl.searchParams.get("category"),
  );
  if (!category) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/free-patterns/${category.slug}`;
  url.searchParams.delete("category");
  return NextResponse.redirect(url, 308);
}

export const config = { matcher: "/free-patterns" };
