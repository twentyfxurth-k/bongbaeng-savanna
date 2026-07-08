import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function getStaticPaths() {
  const posts = (await getCollection('blog')).filter((entry) => !entry.data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { id: post.id },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const id = String(props.id);
  const base = join(process.cwd(), 'src', 'content', 'blog');
  const candidates = [join(base, `${id}.md`), join(base, `${id}.mdx`)];
  const sourcePath = candidates.find((path) => existsSync(path));

  if (!sourcePath) return new Response('Not found', { status: 404 });

  const markdown = await readFile(sourcePath, 'utf8');
  return new Response(markdown, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
};
