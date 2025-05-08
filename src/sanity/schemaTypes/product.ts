import { Rule } from 'sanity';

const product = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().min(3).max(100),
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
      name: 'category',
      title: 'Category',
      type: 'string',
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
