import { Rule } from 'sanity';

const review = {
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    {
      name: 'product',
      type: 'reference',
      title: 'Product',
      to: [{ type: 'product' }],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'rating',
      type: 'number',
      title: 'Rating',
      validation: (Rule: Rule) => Rule.required().min(1).max(5),
    },
    {
      name: 'review',
      type: 'text',
      title: 'Review Text',
      validation: (Rule: Rule) => Rule.required().min(1).max(500),
    },
    {
      name: 'author',
      type: 'string',
      title: 'Author Name',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'createdAt',
      type: 'datetime',
      title: 'Created At',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    },
  ],

  // ✅ This tells Sanity how to preview each review
  preview: {
    select: {
      title: 'review',
      subtitle: 'author',
      productTitle: 'product.name', // assuming product schema has 'name'
    },
    prepare({ title, subtitle, productTitle }: { title?: string; subtitle?: string; productTitle?: string }) {
      return {
        title: productTitle || 'Untitled Product',
        subtitle: `${subtitle} - ${title?.slice(0, 50) ?? ''}`,
      };
    },
  },
};

export default review;
