import { Rule } from 'sanity';

const product = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().min(3).max(100),
    },
     {
      name: "piecesIncluded",
      title: "Pieces Included",
      type: "array",
      of: [{ type: "string" }],
      description: "List of pieces included in this product",
    },
    
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule: Rule) => Rule.required().min(10),
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: Rule) => Rule.required().min(0),
    },
    {
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
  name: "category",
  title: "Category",
  type: "string",
  options: {
    list: [
      { title: "Stitched", value: "stitch" },
      { title: "Unstitched", value: "unstitch" },
      { title: "Trouser", value: "trouser" },
    ],
  },
},
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    },
    {
      name: 'fabric',
      title: 'Fabric',
      type: 'string',
      options: {
        list: [
          { title: 'Cotton', value: 'cotton' },
          { title: 'Lawn', value: 'lawn' },
          { title: 'Linen', value: 'linen' },
          { title: 'Soft Cotton', value: 'soft cotton' },
          // Add more as needed
        ],
      },
    }
    
  ],

  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
};

export default product;
