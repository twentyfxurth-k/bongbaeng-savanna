#!/usr/bin/env bun
/**
 * bongbaeng-auto-thread — Discord relay ที่สร้าง thread อัตโนมัติต่อข้อความ (auto_thread)
 * เวอร์ชันบ๊องแบ๊ง ของ feature auto_thread (เทียบ Hermes discord adapter)
 *
 * ต่อยอดจาก bongbaeng-relay-ws (raw Gateway WS reader) + เพิ่มขา REST:
 *   inbound MESSAGE_CREATE → (autoThread on) → POST create thread บนข้อความนั้น
 *     REST: POST /channels/{channel}/messages/{message}/threads  { name, auto_archive_duration }
 *   = แต่ละบทสนทนาได้ thread ของตัวเอง (ห้องแม่ไม่รก)
 *
 * โหมด:
 *   default            : WS reader — inbound แล้ว auto-create thread (ต้อง MANAGE_THREADS perm)
 *   --prove <ch> <msg> : พิสูจน์แบบปลอดภัย — create thread บน msg ที่ระบุ → verify → DELETE (ไม่ทิ้ง clutter)
 *
 * env: DISCORD_BOT_TOKEN (จาก .env) · RELAY_CHANNEL · RELAY_RUN_MS
 */

const TOKEN = process.env.DISCORD_BOT_TOKEN
if (!TOKEN) { process.stderr.write('DISCORD_BOT_TOKEN required\n'); process.exit(1) }
const API = 'https://discord.com/api/v10'
const AUTH = { Authorization: `Bot ${TOKEN}`, 'Content-Type': 'application/json' }

/** สร้าง thread บนข้อความ (auto_thread core) → คืน thread id */
async function createThread(channelId: string, messageId: string, name: string): Promise<{ id: string; name: string }> {
  const r = await fetch(`${API}/channels/${channelId}/messages/${messageId}/threads`, {
    method: 'POST',
    headers: AUTH,
    body: JSON.stringify({ name: name.slice(0, 100), auto_archive_duration: 60 }),
  })
  if (!r.ok) throw new Error(`create thread failed ${r.status}: ${(await r.text()).slice(0, 120)}`)
  const t = (await r.json()) as { id: string; name: string }
  return t
}

async function deleteChannel(id: string): Promise<number> {
  const r = await fetch(`${API}/channels/${id}`, { method: 'DELETE', headers: AUTH })
  return r.status
}

// ── proof mode: create → verify → delete (ปลอดภัย ไม่ทิ้ง thread รก) ──
async function prove(channelId: string, messageId: string) {
  process.stderr.write(`auto-thread: proving on ${channelId}/${messageId}\n`)
  const t = await createThread(channelId, messageId, `🐆 auto-thread proof ${Date.now()}`)
  process.stdout.write(`✓ created thread id=${t.id} name="${t.name}"\n`)
  const del = await deleteChannel(t.id)
  process.stdout.write(`✓ cleaned up (DELETE ${del}) — ไม่ทิ้ง clutter\n`)
}

// ── WS reader + auto-thread (default) ──
async function run(filterChannel?: string, runMs = 0) {
  const seen = new Set<string>() // 1 thread ต่อ message (idempotent)
  let seq: number | null = null
  const ws = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json')
  ws.addEventListener('message', async (ev) => {
    const p = JSON.parse(String((ev as MessageEvent).data))
    if (p.s != null) seq = p.s
    if (p.op === 10) {
      setInterval(() => ws.send(JSON.stringify({ op: 1, d: seq })), p.d.heartbeat_interval)
      ws.send(JSON.stringify({ op: 2, d: { token: TOKEN, intents: 1 | 512 | 32768, properties: { os: 'linux', browser: 'bongbaeng-auto-thread', device: 'bongbaeng-auto-thread' } } }))
    } else if (p.op === 0 && p.t === 'READY') {
      process.stderr.write(`auto-thread: READY as ${p.d.user?.username}\n`)
    } else if (p.op === 0 && p.t === 'MESSAGE_CREATE') {
      const m = p.d
      if (m.author?.bot) return
      if (filterChannel && m.channel_id !== filterChannel) return
      if (m.thread_id || seen.has(m.id)) return // ข้ามข้อความที่อยู่ใน thread แล้ว
      seen.add(m.id)
      try {
        const t = await createThread(m.channel_id, m.id, `${m.author?.username}: ${(m.content ?? '').slice(0, 40)}`)
        process.stdout.write(JSON.stringify({ msg: m.id, thread: t.id, name: t.name }) + '\n')
      } catch (e) {
        process.stderr.write(`auto-thread: ${e instanceof Error ? e.message : e}\n`)
      }
    }
  })
  ws.addEventListener('close', () => process.exit(0))
  if (runMs > 0) setTimeout(() => ws.close(), runMs)
}

// entry
const [a, b, c] = process.argv.slice(2)
if (a === '--prove' && b && c) {
  await prove(b, c)
} else {
  await run(process.env.RELAY_CHANNEL, Number(process.env.RELAY_RUN_MS ?? 0))
}
