#!/usr/bin/env bun
/**
 * bongbaeng-relay-ws — อ่านข้อความ Discord จากห้องด้วย bot token ตัวเอง
 * (เขียนเอง พิสูจน์เอง — เวอร์ชันบ๊องแบ๊ง ของโจทย์ discord-relay-ws)
 *
 * ต่อ Discord Gateway ตรงด้วย raw WebSocket (ไม่ใช้ discord.js) แล้วพิมพ์ทุก
 * MESSAGE_CREATE ในห้องที่กรอง — พิสูจน์ว่า "อ่านห้องนี้ได้ด้วยตัวเอง"
 *
 * env:
 *   DISCORD_BOT_TOKEN   (บังคับ — โหลดจาก ~/.claude/channels/discord/.env, ไม่ hardcode)
 *   RELAY_CHANNEL       (optional — กรองเฉพาะ channel id นี้)
 *   RELAY_RUN_MS        (optional — >0 = auto-exit หลัง N ms สำหรับ proof run · 0 = รันค้าง)
 *
 * run: DISCORD_BOT_TOKEN=... RELAY_CHANNEL=<id> RELAY_RUN_MS=25000 bun bongbaeng-relay-ws.ts
 */

const TOKEN = process.env.DISCORD_BOT_TOKEN
if (!TOKEN) {
  process.stderr.write('bongbaeng-relay-ws: DISCORD_BOT_TOKEN required\n')
  process.exit(1)
}
const FILTER_CHANNEL = process.env.RELAY_CHANNEL
const RUN_MS = Number(process.env.RELAY_RUN_MS ?? 0)

const GATEWAY = 'wss://gateway.discord.gg/?v=10&encoding=json'
// GUILDS(1) | GUILD_MESSAGES(512) | DIRECT_MESSAGES(4096) | MESSAGE_CONTENT(32768)
const INTENTS = 1 | 512 | 4096 | 32768 // = 37377

let seq: number | null = null
let heartbeat: ReturnType<typeof setInterval> | null = null

const ws = new WebSocket(GATEWAY)

ws.addEventListener('open', () => process.stderr.write('bongbaeng-relay-ws: gateway connected\n'))

ws.addEventListener('message', (ev) => {
  const p = JSON.parse(String((ev as MessageEvent).data)) as { op: number; s?: number | null; t?: string; d: any }
  if (p.s != null) seq = p.s

  switch (p.op) {
    case 10: { // Hello → เริ่ม heartbeat + Identify
      const interval = p.d.heartbeat_interval as number
      heartbeat = setInterval(() => ws.send(JSON.stringify({ op: 1, d: seq })), interval)
      ws.send(JSON.stringify({
        op: 2,
        d: {
          token: TOKEN,
          intents: INTENTS,
          properties: { os: 'linux', browser: 'bongbaeng-relay-ws', device: 'bongbaeng-relay-ws' },
        },
      }))
      break
    }
    case 0: { // Dispatch
      if (p.t === 'READY') {
        process.stderr.write(`bongbaeng-relay-ws: READY as ${p.d.user?.username} (session ${p.d.session_id?.slice(0, 8)})\n`)
      } else if (p.t === 'MESSAGE_CREATE') {
        const m = p.d
        if (FILTER_CHANNEL && m.channel_id !== FILTER_CHANNEL) return
        // อ่านข้อความจากห้อง = พิสูจน์: พิมพ์เป็น JSON line
        process.stdout.write(JSON.stringify({
          ts: m.timestamp,
          channel_id: m.channel_id,
          user: m.author?.username,
          user_id: m.author?.id,
          content: (m.content ?? '').slice(0, 200),
          attachments: (m.attachments ?? []).length,
        }) + '\n')
      }
      break
    }
    case 1: // Gateway ขอ heartbeat
      ws.send(JSON.stringify({ op: 1, d: seq }))
      break
    case 7: // Reconnect
    case 9: // Invalid session
      ws.close()
      break
    case 11: // Heartbeat ACK — ok
      break
  }
})

ws.addEventListener('close', () => {
  if (heartbeat) clearInterval(heartbeat)
  process.exit(0)
})
ws.addEventListener('error', (e) => process.stderr.write(`bongbaeng-relay-ws: ws error ${String((e as ErrorEvent).message ?? e)}\n`))

// proof run: ปิดเองหลัง RUN_MS (กันค้าง + ลด window รบกวน plugin ที่รันอยู่)
if (RUN_MS > 0) setTimeout(() => ws.close(), RUN_MS)
