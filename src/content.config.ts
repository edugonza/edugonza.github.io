import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    // Cover image, relative to the post file: the full original photo. The build crops it into the
    // banner at the top of the post and the thumbnail in post lists.
    image: image().optional(),
    imageAlt: z.string().optional(),
    // Which part of the image those crops keep: a side, or 'attention' / 'entropy' to let the
    // image library pick the most interesting region.
    imagePosition: z.enum(['center', 'top', 'bottom', 'left', 'right', 'attention', 'entropy']).default('center'),
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
