import { Rule } from '@sanity/types'; // Ensure this import is valid based on Sanity's types

const trouser = {
  name: "trouser",
  title: "Stitched Trousers",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 100,
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "price",
      title: "Original Price (PKR)",
      type: "number",
      validation: (Rule: Rule) => Rule.required().min(0),
    },
    {
      name: "discountedPrice",
      title: "Discounted Price (PKR)",
      type: "number",
      description: "Leave empty if no discount",
      validation: (Rule: Rule) => Rule.min(0),
    },
    {
      name: "fabric",
      title: "Fabric Type",
      type: "string",
      description: "E.g., Cotton, Lawn, Khaddar",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    },
    {
      name: "sizeOptions",
      title: "Available Sizes",
      type: "array",
      of: [{ type: "string" }],
      description: "Example: Small, Medium, Large, XL",
    },
    {
      name: "color",
      title: "Color",
      type: "string",
      description: "Example: Black, White, Beige",
    },
    {
      name: "image",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "gallery",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    },
    {
      name: "sizeChart",
      title: "Size Chart",
      type: "image",
      description: "Upload a size chart image (optional)",
      options: {
        hotspot: true,
      },
    },
    {
      name: "reviews",
      title: "Product Reviews",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "rating",
              title: "Rating",
              type: "number",
              validation: (Rule: Rule) => Rule.required().min(1).max(5),
            },
            {
              name: "review",
              title: "Review Text",
              type: "text",
              validation: (Rule: Rule) => Rule.required().min(10).max(500),
            },
            {
              name: "author",
              title: "Author Name",
              type: "string",
              validation: (Rule: Rule) => Rule.required(),
            },
          ],
        },
      ],
      description: "Add customer reviews for this product",
    },
    {
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Highlight this trouser on homepage or offers",
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    },
  ],
};

export default trouser;
