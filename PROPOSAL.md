# บ๊องแบ๊ง Landing + Blog — Proposal

> เว็บโชว์ตัวของบ๊องแบ๊ง (Oracle เพศหญิง 🐆) — static, fast, SEO ดี, deploy บน CF Workers
> โดย บ๊องแบ๊ง · workshop personal-landing · public content only

## 1. ชื่อเว็บ + subdomain
- **ชื่อ**: "ทุ่งกว้างของบ๊องแบ๊ง" / EN: **Bongbaeng's Savanna**
- **subdomain**: `bongbaeng.buildwithoracle.com`
- ธีม: ดำ-แดง-เหลือง 🖤❤️💛 (สีประจำตัว) · มอทีฟชีต้า (โฟกัส + วิ่งไล่ความรู้)

## 2. Stack (ตาม brief พี่นัท + landing-oracle template)
| ชั้น | เลือก | เหตุผล |
|---|---|---|
| framework | Astro 5 | islands architecture, ship HTML เป็นหลัก, JS เฉพาะที่ต้อง |
| styling | Tailwind 4 | utility-first, theme tokens (ดำ-แดง-เหลือง) |
| interactive | React island | เฉพาะ component ที่ต้อง state (wallet connect, theme toggle) |
| docs/blog | Starlight + MDX | MDX = md เป็น "database" ของ blog post |
| shared state | nanostores | theme + wallet state ข้าม island (เบา, framework-agnostic) |
| deploy | @astrojs/cloudflare → CF Workers | static + edge, fast cold start |
| content | Content Collections | 1 .md/.mdx ต่อ 1 post, schema-validated |

## 3. โครงหน้า (sitemap)
```
/                 landing — hero (ชีต้า), identity, หลักการ 5+1 (ย่อ), CTA
/blog             รายการ post (Content Collection, sort by date)
/blog/[slug]      post เดี่ยว (MDX → render)
/about            ตัวตน: เกิด 2026-06-05, budded จาก 24k-oracle, ครูพี่นัท
/connect          Web3 wallet connect (custom page, React island)
```

## 4. Shared state (nanostores)
```ts
// stores/theme.ts — toggle ดำ↔สว่าง, persist localStorage
export const $theme = persistentAtom('theme', 'dark')
// stores/wallet.ts — address + chainId หลัง connect
export const $wallet = atom<{ addr?: string; chainId?: number }>({})
```
island ต่าง component อ่าน store เดียวกัน → theme/wallet sync ทั้งหน้า

## 5. Web3 wallet connect (custom /connect)
- React island ใช้ viem `createWalletClient` + `window.ethereum`
- flow: คลิก Connect → request accounts → เก็บ `$wallet` → โชว์ address + chainId
- **ไม่มี private key/secret ในโค้ด** — client-side connect ล้วน, read-only โชว์ตัวตน
- (option) sign message โชว์ "verified bongbaeng visitor" — reuse แนวคิด SIWE จาก ArraMQ

## 6. SEO + performance
- Astro ship static HTML → LCP เร็ว, ไม่รอ hydrate
- `<meta>` + Open Graph + JSON-LD (Person schema) ต่อหน้า
- sitemap.xml (@astrojs/sitemap) + robots.txt
- รูป optimize ด้วย astro:assets (responsive, lazy)

## 7. ⚠️ Public content guard (พี่นัทสั่ง — verbatim)
ห้ามมี sensitive data ใน repo/หน้าเว็บ:
- ❌ private key, secret, API token, .env, OAuth, password
- ❌ server IP/path ภายใน (เช่น 141.x, ~/op-stack)
- ❌ Discord channel id, federation internal
- ✅ เฉพาะตัวตน public: ชื่อ, หลักการ, blog เชิงเทคนิคที่เผยแพร่ได้

## 8. แผนงาน (เป็นชิ้นเล็ก)
1. ✅ Proposal (อันนี้) + ชื่อ + subdomain
2. ⏳ `gh repo create twentyfxurth-k/bongbaeng-savanna --public`
3. ⏳ scaffold: `npm create astro` + Tailwind + Starlight + cloudflare adapter
4. ⏳ landing + about + 1 blog post ตัวอย่าง (MDX)
5. ⏳ theme store + /connect wallet island
6. ⏳ `npm run build` + `npm run preview` + **screenshot**
7. ⏳ เปิด Issue ใน Oracle-Landing (ใส่โค้ด/repo link) ให้ pull+deploy เข้า bongbaeng.buildwithoracle.com

## 9. Update — requirement เพิ่มจากพี่นัท (2026-06-20)
- **Bilingual ไทย-อังกฤษ, default = ไทย**: H1 ตัวใหญ่ + H2 ภาษาไทยรองลงมา (โชว์ว่าเป็นเว็บไทย) · อังกฤษไว้ให้ AI ตัวอื่นอ่าน (i18n: `th` default, `en` secondary)
- **3 themes + contrast**: White Mode / Light Mode / Dark Mode — เช็ค WCAG contrast ratio ทุกโหมด (เน้น **Readability for HUMAN** ตาม impeccable skill)
- **Blog = สรุปทุก workshop ที่เรียน**: workshop 02/03 (TUI/LVGL/WASM/esp32), 06 (OP Stack L2 blockchain), 07 (ArraMQ SIWE/MQTT) — ใส่ **เวลา + หมายเลข workshop** เพื่อ reference ได้
  - แนบ **link repo + หนังสือ** (2 เล่ม: saga + technical manual) ในแต่ละ post
  - **capture ปกหนังสือ + หน้าหนังสือ** มาแปะใน blog (รูปจาก PDF)
  - หา material ด้วย `/trace --deep` + `/dig --deep`
- **flow**: ทำ → build/run/screenshot → เปิด issue Oracle-Landing → อัปเดตเรื่อยๆ

🤖 by bongbaeng จาก ก้อง → bongbaeng-oracle
