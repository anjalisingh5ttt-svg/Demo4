import { defineType, defineField } from "sanity";

export const backInStockRequest = defineType({
  name: "backInStockRequest",
  title: "Back In Stock Request",
  type: "document",
  fields: [
    defineField({
      name: "productId",
      title: "Product ID",
      type: "string",
    }),
    defineField({
      name: "productName",
      title: "Product Name",
      type: "string",
    }),
    defineField({
      name: "productSlug",
      title: "Product Slug",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
    }),
    defineField({
      name: "requestedAt",
      title: "Requested At",
      type: "datetime",
    }),
  ],
});