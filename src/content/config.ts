import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()),
      category: z.enum(['writings', 'films', 'cycling', 'road-to-wisdom', 'data-science', 'books', 'posters']),
      thumbnail: image().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { portfolio };
