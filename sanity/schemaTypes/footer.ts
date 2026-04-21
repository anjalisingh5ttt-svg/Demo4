import { defineField, defineType } from "sanity";

export const footerType = defineType({
  name: "footer",
  title: "Footer Settings",
  type: "document",
  fields: [
    // Newsletter Section
    defineField({
      name: "newsletterText",
      title: "Newsletter Text",
      type: "string",
      initialValue: "Be the first to know about new collections, exclusive releases, and the philosophy behind each piece.",
    }),
    defineField({
      name: "newsletterPlaceholder",
      title: "Newsletter Placeholder",
      type: "string",
      initialValue: "Your email address",
    }),
    defineField({
      name: "newsletterButtonText",
      title: "Newsletter Button Text",
      type: "string",
      initialValue: "Subscribe",
    }),

    // Left Section
    defineField({
      name: "companyLinks",
      title: "Company Overview Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "href", type: "string", title: "URL / Route" },
          ],
        },
      ],
    }),

    // Middle Section
    defineField({
      name: "quickLinks",
      title: "Quick Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "href", type: "string", title: "URL / Route" },
          ],
        },
      ],
    }),

    // Right Section
    defineField({
      name: "contactEmailPrimary",
      title: "Primary Contact Email",
      type: "string",
    }),
    defineField({
      name: "contactEmailSecondary",
      title: "Secondary Contact Email",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { 
              name: "platform", 
              type: "string", 
              title: "Platform Name",
              description: "e.g., Instagram, Facebook, YouTube, Email"
            },
            { name: "url", type: "string", title: "URL" },
          ],
        },
      ],
    }),

    // Bottom Section
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      description: "e.g., © [Year] BODHIQ. All rights reserved. Do not include year to auto-generate.",
    }),
    defineField({
      name: "bottomTagline",
      title: "Bottom Tagline",
      type: "string",
      initialValue: "Timeless Craftsmanship",
    }),
  ],
});
