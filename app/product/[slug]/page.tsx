import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { productPageQuery } from "@/sanity/lib/queries";
import ProductPageClient from "@/components/ProductPageClient";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await client.fetch(productPageQuery, { slug });

  if (!product) {
    return { title: "Product Not Found | BODHIQ" };
  }

  // Fallbacks if CMS doesn't have explicit SEO config configured locally
  const seoTitle = product.seo?.metaTitle || `${product.name} | BODHIQ`;
  const seoDescription = product.seo?.metaDescription || product.description?.slice(0, 150) || "Minimalist luxury from BODHIQ.";
  const seoKeywords = product.seo?.keywords || ["BODHIQ", product.name, "luxury watch"];
  const seoImage = product.seo?.ogImage?.asset?.url || product.mainImage?.asset?.url || "/watches/shunya-1/hero.jpg";
  const canonicalUrl = product.seo?.canonicalUrl || `https://bodhiq.in/product/${product.slug}`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await client.fetch(productPageQuery, { slug });

  if (!product) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.mainImage?.asset?.url,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://bodhiq.in/product/${product.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Collection",
        "item": "https://bodhiq.in/collection"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.name,
        "item": `https://bodhiq.in/product/${product.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}