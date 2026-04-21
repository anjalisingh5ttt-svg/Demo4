import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

const BASE_URL = "https://bodhiq.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    "",
    "/collection",
    "/about",
    "/values",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/corporate",
    "/media",
    "/distributor",
    "/grievance",
    "/knowledge",
    "/faqs",
    "/shipping-policy",
    "/return-policy",
    "/payment-policy",
    "/track-order",
    "/download-app",
    "/craftsmanship",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : route === "/collection" ? 0.9 : 0.7,
  }));

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products: { slug: string }[] = await client.fetch(
      groq`*[_type == "product"]{ "slug": slug.current }`
    );
    productPages = products
      .filter((p) => p.slug)
      .map((product) => ({
        url: `${BASE_URL}/product/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch {
    // Silently handle Sanity errors during build
  }

  // Dynamic category pages
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories: { slug: string }[] = await client.fetch(
      groq`*[_type == "category"]{ "slug": slug.current }`
    );
    categoryPages = categories
      .filter((c) => c.slug)
      .map((category) => ({
        url: `${BASE_URL}/collection/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch {
    // Silently handle Sanity errors during build
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
