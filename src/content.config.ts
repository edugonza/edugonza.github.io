import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    // Cover image, relative to the post file. Shown in post lists and at the top of the post.
    image: image().optional(),
    imageAlt: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Lower numbers are shown first.
    order: z.number().default(100),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    repo: z.url().optional(),
    url: z.url().optional(),
    status: z.enum(['active', 'maintained', 'archived']).default('active'),
  }),
});

export const collections = { blog, projects };
