import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.preprocess((val) => val ?? [], z.array(z.string())),
    updated: z.date().optional(),
    share: z.union([z.boolean(), z.string()]).optional(),
  }),
});

export const collections = { blog };
