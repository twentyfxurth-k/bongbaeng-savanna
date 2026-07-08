// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { execFileSync } from 'node:child_process';

function gitInfo() {
  try {
    const sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
    const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim();
    return { sha, branch };
  } catch {
    return { sha: 'unknown', branch: 'unknown' };
  }
}

const { sha, branch } = gitInfo();
const buildTime = new Date().toISOString();

// PAGES_BASE (เช่น "/bongbaeng-savanna") ตั้งตอน build ให้ GitHub Pages เท่านั้น
// CF Workers build (ไม่มี env) = root path เหมือนเดิม ไม่พัง
const pagesBase = process.env.PAGES_BASE;

function prefixRootRelativeUrls(html, base) {
  const cleanBase = base.replace(/\/$/, '');
  if (!cleanBase) return html;
  const attrs = ['href', 'src', 'poster', 'content'];
  for (const attr of attrs) {
    html = html.replace(
      new RegExp(`${attr}=(["'])/(?!${cleanBase.slice(1)}(?:/|$)|/|https?:|#)`, 'g'),
      `${attr}=$1${cleanBase}/`
    );
  }
  html = html.replace(
    new RegExp(`(['"\(])/(?!${cleanBase.slice(1)}(?:/|$)|/|https?:|#)(blog|books|about|connect)(?=[/'"#?\)])`, 'g'),
    `$1${cleanBase}/$2`
  );
  return html;
}

function githubPagesBasePathFix(base) {
  return {
    name: 'github-pages-base-path-fix',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        if (!base) return;
        const { readdir, readFile, writeFile } = await import('node:fs/promises');
        const { join } = await import('node:path');
        async function walk(current) {
          for (const entry of await readdir(current, { withFileTypes: true })) {
            const full = join(current, entry.name);
            if (entry.isDirectory()) {
              await walk(full);
            } else if (entry.isFile() && /\.(html|js|json|xml|txt)$/.test(entry.name)) {
              const before = await readFile(full, 'utf8');
              const after = prefixRootRelativeUrls(before, base);
              if (after !== before) await writeFile(full, after);
            }
          }
        }
        await walk(dir.pathname);
      },
    },
  };
}


export default defineConfig({
  site: pagesBase ? 'https://twentyfxurth-k.github.io' : 'https://bongbaeng.buildwithoracle.com',
  base: pagesBase || undefined,
  output: 'static',
  build: {
    format: 'directory',
  },
  trailingSlash: 'ignore',
  integrations: [
    react(),
    mdx(),
    sitemap(),
    githubPagesBasePathFix(pagesBase),
  ],
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.PUBLIC_BUILD_SHA': JSON.stringify(sha),
      'import.meta.env.PUBLIC_BUILD_BRANCH': JSON.stringify(branch),
      'import.meta.env.PUBLIC_BUILD_TIME': JSON.stringify(buildTime),
    },
  },
});
