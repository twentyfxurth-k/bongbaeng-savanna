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
