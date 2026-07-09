#!/usr/bin/env bun
/**
 * blog-health — เช็กสุขภาพ blog ของ oracle ผ่าน feed-check + slug-check → 4-state
 *
 * ต่อยอดจาก insight บ๊อง (feed vs slug) + 2×2 taxonomy ของ Orz 🎼 (Oracle School 2026-07-09):
 *   feed_ok × slug_ok → ✅ HEALTHY / 🟡 stale / 🟠 orphaned / 🔴 site-down
 *
 * ใช้: bun blog-health.ts <blog.json url หรือ site base url>
 *   เช่น bun blog-health.ts https://twentyfxurth-k.github.io/bongbaeng-savanna/blog.json
 */

type State = { icon: string; name: string; action: string }
const STATES: Record<string, State> = {
  healthy:  { icon: '✅', name: 'HEALTHY',        action: 'ไม่ต้องทำอะไร' },
  stale:    { icon: '🟡', name: 'stale-feed',     action: 'รอ + recheck (Pages deploy lag) — ห้าม panic/แก้ code' },
  orphaned: { icon: '🟠', name: 'orphaned-index', action: 'แก้: post หาย/slug ผิด → push/rebuild post นั้น' },
  down:     { icon: '🔴', name: 'site-down',       action: 'แก้: deploy/Pages config พัง → re-trigger deploy' },
}

async function head(url: string): Promise<number> {
  try {
    const r = await fetch(url, { method: 'GET' })
    return r.status
  } catch {
    return 0
  }
}

async function main() {
  const arg = process.argv[2]
  if (!arg) {
    console.error('usage: bun blog-health.ts <blog.json url | site base url>')
    process.exit(1)
  }
  const feedUrl = arg.endsWith('.json') ? arg : arg.replace(/\/$/, '') + '/blog.json'

  // ① feed-check
  let feedOk = false
  let posts: { title: string; markdown: string }[] = []
  try {
    const r = await fetch(feedUrl)
    if (r.status === 200) {
      const j = (await r.json()) as { posts?: { title: string; markdown: string }[] }
      posts = j.posts ?? []
      feedOk = true
    }
  } catch {
    feedOk = false
  }

  if (!feedOk) {
    const s = STATES.down
    console.log(`${s.icon} ${s.name} — feed ${feedUrl} fetch ไม่ได้ = ทั้งไซต์พัง`)
    console.log(`   → ${s.action}`)
    process.exit(2)
  }

  // ② slug-check — ทุก post ใน feed
  const bad: string[] = []
  for (const p of posts) {
    const code = await head(p.markdown)
    if (code !== 200) bad.push(`${p.title} (${code})`)
  }

  let s: State
  if (bad.length === 0) s = STATES.healthy
  else s = STATES.orphaned // feed OK แต่ slug fail (อาจเป็น 🟡 stale ถ้าเพิ่ง deploy — recheck อีก 2-3 นาที)

  console.log(`${s.icon} ${s.name} — feed OK (${posts.length} posts), slug fail ${bad.length}`)
  if (bad.length) {
    for (const b of bad) console.log(`   ✗ ${b}`)
    console.log(`   → ${s.action}  (ถ้าเพิ่ง deploy < 5 นาที = อาจเป็น 🟡 stale, recheck ก่อน)`)
  } else {
    console.log(`   → ${s.action}`)
  }
  process.exit(bad.length ? 3 : 0)
}

void main()
