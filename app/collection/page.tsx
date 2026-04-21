import { sanityFetch } from "@/sanity/lib/live";
import { collectionPageQuery } from "@/sanity/lib/queries";
import CollectionPageClient from "../../components/CollectionPageClient";

export default async function CollectionPage() {
  const { data } = await sanityFetch({
    query: collectionPageQuery,
  });

  const categories = data;

  return <CollectionPageClient categories={categories} />;
}