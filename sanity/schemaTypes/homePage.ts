import { defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        { name: "title", title: "Title", type: "string" },
        { name: "tagline", title: "Tagline", type: "string" },
        { name: "description", title: "Description", type: "text" },
        { name: "ctaText", title: "Primary CTA Text", type: "string" },
      ],
    }),
    defineField({
      name: "philosophy",
      title: "Philosophy Section",
      type: "object",
      fields: [
        { name: "title", title: "Title", type: "string" },
        { name: "subtitle", title: "Subtitle", type: "string" },
        { name: "description1", title: "First Paragraph", type: "text" },
        { name: "description2", title: "Second Paragraph", type: "text" },
        { name: "description3", title: "Third (Italic) Paragraph", type: "string" },
        { name: "signatureTitle", title: "Signature Title", type: "string" },
        { name: "signatureSubtitle", title: "Signature Subtitle", type: "string" },
        { 
          name: "image", 
          title: "Image", 
          type: "image",
          options: { hotspot: true }
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO Metadata",
      type: "seo",
    }),
  ],
});
