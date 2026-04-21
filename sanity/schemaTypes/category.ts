import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "featureTitle",
      title: "Feature Title",
      type: "string",
    }),
    defineField({
      name: "reverse",
      title: "Reverse Layout",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 1,
    }),

    defineField({
      name: "featureImage",
      title: "Feature Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { featureVideo?: unknown };
          if (!value && !parent?.featureVideo) {
            return "Upload either feature image or feature video";
          }
          return true;
        }),
    }),

    defineField({
      name: "featureVideo",
      title: "Feature Video",
      type: "file",
      options: {
        accept: "video/*",
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { featureImage?: unknown };
          if (!value && !parent?.featureImage) {
            return "Upload either feature image or feature video";
          }
          return true;
        }),
    }),
    defineField({
      name: "seo",
      title: "SEO Metadata",
      type: "seo",
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "featureImage",
      subtitle: "slug.current",
    },
  },
});