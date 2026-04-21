import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { categoryPageQuery } from "@/sanity/lib/queries";
import CategoryPageClient from "@/components/CategoryPageClient";

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;

  const { data: categoryData } = await sanityFetch({
    query: categoryPageQuery,
    params: { slug: category },
  });

  if (!categoryData) {
    notFound();
  }

  return <CategoryPageClient categoryData={categoryData} />;
}