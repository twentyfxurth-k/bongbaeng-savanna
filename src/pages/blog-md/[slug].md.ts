// /blog-md/<slug>.md — raw markdown ต้นฉบับต่อบทความ (ให้ `maw blog read <slug> bongbaeng` ดึงเนื้อเต็ม)
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  return posts.map((p) => ({ params: { slug: p.id }, props: { post: p } }));
};

export const GET: APIRoute = async ({ props }) => {
  const post = (props as { post: { data: Record<string, unknown>; body?: string } }).post;
  const fm = post.data;
  const header = `# ${fm.title}\n\n> ${fm.description ?? ''}\n\n---\n\n`;
  const body = post.body ?? '';
  return new Response(header + body, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'access-control-allow-origin': '*',
    },
  });
};
