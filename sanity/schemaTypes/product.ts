import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
    }),

    defineField({
      name: "price",
      title: "Selling Price",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "originalPrice",
      title: "Original Price",
      type: "number",
    }),

    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      initialValue: 10,
    }),

    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "allowNotify",
      title: "Allow Notify Me",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      description: "This image will appear on collection and product cards",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "images",
      title: "Gallery Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      validation: (Rule) => Rule.min(1).max(5),
    }),

    defineField({
      name: "productVideo",
      title: "Product Video",
      type: "file",
      options: {
        accept: "video/*",
      },
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "caseSize",
      title: "Case Size",
      type: "string",
    }),

    defineField({
      name: "dialColor",
      title: "Dial Color",
      type: "string",
    }),

    defineField({
      name: "strapMaterial",
      title: "Strap Material",
      type: "string",
    }),

    defineField({
      name: "caseMaterial",
      title: "Case Material",
      type: "string",
    }),

    defineField({
      name: "movement",
      title: "Movement",
      type: "string",
    }),

    defineField({
      name: "waterResistance",
      title: "Water Resistance",
      type: "string",
    }),

    defineField({
      name: "glassType",
      title: "Glass Type",
      type: "string",
    }),
    defineField({
      name: "seo",
      title: "SEO Metadata",
      type: "seo",
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "mainImage",
      subtitle: "price",
    },
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle: subtitle ? `$${subtitle}` : "No price",
      };
    },
  },
});