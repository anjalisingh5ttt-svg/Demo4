import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "logoText",
      title: "Logo Text",
      type: "string",
      description: "Text for the brand logo in the Header.",
    }),
    defineField({
      name: "navLinks",
      title: "Navigation Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "href", type: "string", title: "URL (relative path)" },
            {
              name: "dropdown",
              title: "Dropdown Items",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "label", type: "string", title: "Label" },
                    { name: "href", type: "string", title: "URL" },
                  ],
                },
              ],
            },
          ],
        },
      ],
      description: "Links displayed in the Header navigation.",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      description: "Email shown in the Footer.",
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "string",
      description: "Short text describing the brand in the Footer.",
    }),
    defineField({
      name: "seoTitle",
      title: "Global SEO Title",
      type: "string",
      description: "Default title to be used globally via SEO (e.g., BODHIQ | Luxury Timepiece).",
    }),
    defineField({
      name: "seoDescription",
      title: "Global SEO Description",
      type: "text",
      description: "Default meta description used generally across the site.",
    }),
    defineField({
      name: "seoKeywords",
      title: "Global SEO Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Keywords appended to global metadata.",
    }),
  ],
});
