import type { APIRoute } from 'astro';
import { pageCard } from '../../og';
import { formatDate, getPosts, readingTime, type Post } from '../../utils';

// One social preview card per post, built to /og/<post id>.jpg.
export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute<{ post: Post }> = ({ props: { post } }) =>
  pageCard({
    title: post.data.title,
    meta: `${formatDate(post.data.pubDate)} · ${readingTime(post.body)}`,
    image: post.data.image,
    imagePosition: post.data.imagePosition,
  });
