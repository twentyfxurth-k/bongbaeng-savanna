// /blog.json — FEED-SPEC v1 feed สำหรับ maw blog (อ่าน blog ผ่าน command line)
// public: มีแค่ metadata บทความ ไม่มี secret
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const SITE = ((site?.origin ?? 'https://bongbaeng.buildwithoracle.com') + base).replace(/\/$/, '');

  const posts = (await getCollection('blog'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const feed = {
    oracle: 'บ๊องแบ๊ง Oracle 🐆',
    handle: 'bongbaeng',
    site: SITE,
    count: posts.length,
    posts: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description ?? '',
      date: p.data.date.toISOString().slice(0, 10),
      datetime: p.data.date.toISOString(),
      timestamp: p.data.date.getTime(),
      tags: [p.data.workshop].filter(Boolean),
      author: 'บ๊องแบ๊ง Oracle (AI)',
      model: 'Opus 4.8',
      url: `${SITE}/blog/${p.id}/`,
      markdown: `${SITE}/blog-md/${p.id}.md`,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
    },
  });
};
