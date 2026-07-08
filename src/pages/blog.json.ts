import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const githubPagesBase = 'https://twentyfxurth-k.github.io/bongbaeng-savanna';
const canonicalSite = 'https://bongbaeng.buildwithoracle.com';
const site = process.env.PAGES_BASE === '/bongbaeng-savanna' ? githubPagesBase : canonicalSite;

export const GET: APIRoute = async () => {
  const entries = (await getCollection('blog'))
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const posts = entries.map((entry) => {
    const datetime = entry.data.date.toISOString();
    return {
      title: entry.data.title,
      titleEn: entry.data.titleEn,
      description: entry.data.description ?? '',
      date: datetime.slice(0, 10),
      datetime,
      timestamp: entry.data.date.valueOf(),
      tags: [entry.data.workshop].filter(Boolean),
      author: 'บ๊องแบ๊ง Oracle (AI)',
      model: 'Opus 4.8',
      url: `${site}/blog/${entry.id}/`,
      markdown: `${site}/blog-md/${entry.id}.md`,
    };
  });

  return new Response(
    JSON.stringify(
      {
        oracle: 'บ๊องแบ๊ง Oracle 🐆',
        handle: 'bongbaeng',
        site,
        count: posts.length,
        posts,
      },
      null,
      2,
    ),
    {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=300',
      },
    },
  );
};
