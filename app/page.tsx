import { Metadata } from "next";
import Header from "@/components/Header";
import PhilosophySection from "@/components/PhilosophySection";
import FeaturedCollection from "@/components/FeaturedCollection";
import { sanityFetch } from "@/sanity/lib/live";
import { homePageQuery, heroSectionQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "BODHIQ SHUNYA I — Imperfect. Almost. | Luxury Timepiece",
  description:
    "Discover BODHIQ SHUNYA I — a minimalist luxury watch inspired by imperfection. Hand-finished dial, Kintsugi detailing, limited first drop.",
  keywords: [
    "BODHIQ",
    "SHUNYA I",
    "luxury watch",
    "minimalist watch",
    "Kintsugi watch",
    "Indian luxury brand",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BODHIQ SHUNYA I — Imperfect. Almost.",
    description:
      "A minimalist luxury watch inspired by imperfection. Limited first drop.",
    images: ["/watches/shunya-1/hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BODHIQ SHUNYA I — Imperfect. Almost.",
    description:
      "A minimalist luxury watch inspired by imperfection. Limited first drop from BODHIQ.",
    images: ["/watches/shunya-1/hero.jpg"],
  },
};

export default async function Home() {
  const { data: homePage } = await sanityFetch({ query: homePageQuery });
  const { data: heroSection } = await sanityFetch({ query: heroSectionQuery });

  return (
    <main>
      <Header data={heroSection || homePage?.hero} />
      <PhilosophySection data={homePage?.philosophy} />
      <FeaturedCollection />
    </main>
  );
}
