import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts are visible only in `astro dev`. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function readingTime(body: string | undefined): string {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

/** Shapes the cover image is cropped to. `width` is the largest size generated. */
export const CROPS = {
  banner: { ratio: 1440 / 460, width: 1440 }, // top of the post
  thumb: { ratio: 8 / 5, width: 384 }, // post lists, matches the 8rem × 5rem box
  social: { ratio: 1200 / 630, width: 1200 }, // og:image
} as const;

/** Largest size of the given crop that fits inside the image without upscaling it. */
export function cropSize(image: { width: number; height: number }, crop: { ratio: number; width: number }) {
  const width = Math.min(crop.width, image.width, Math.floor(image.height * crop.ratio));
  return { width, height: Math.round(width / crop.ratio) };
}

export function slugifyTag(tag: string): string {
  return tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
