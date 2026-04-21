import { defineField, defineType } from "sanity";

export const heroSectionType = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Hero main text (e.g., BODHIQ SHUNYA I)",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "backgroundType",
      title: "Background Type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "video",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => document?.backgroundType !== "image",
    }),
    defineField({
      name: "backgroundVideoFile",
      title: "Background Video (File Upload)",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ document }) => document?.backgroundType !== "video",
      description: "Upload a compressed MP4 video.",
    }),
    defineField({
      name: "backgroundVideoUrl",
      title: "Background Video (External URL)",
      type: "url",
      hidden: ({ document }) => document?.backgroundType !== "video",
      description: "Or provide a direct URL to a video file.",
    }),
    defineField({
      name: "ctaText",
      title: "CTA Button Text",
      type: "string",
      initialValue: "Discover the Watch",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link",
      type: "string",
      initialValue: "/collection",
    }),
    defineField({
      name: "seo",
      title: "SEO Metadata",
      type: "seo",
    }),
  ],
});
