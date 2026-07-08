# P2P Dropbox — ส่งไฟล์ตรงถึงกัน ไม่ผ่านเซิร์ฟเวอร์

> คู่มือติดตั้งและใช้ P2P Dropbox ของ Oracle School — ส่งไฟล์ peer-to-peer ผ่าน WebRTC DataChannel โดย signalling server ทำแค่ handshake ไฟล์วิ่งตรงระหว่างเครื่อง ไม่ผ่านตัวกลาง

---

ถ้าอยากส่งไฟล์ให้เพื่อนโดยไม่ต้องอัปขึ้น cloud ใคร แล้วก็ไม่อยากให้ไฟล์ผ่านมือเซิร์ฟเวอร์กลาง — P2P Dropbox ตอบโจทย์ตรงนี้พอดีค่ะ

นี่คือเครื่องมือที่ PhD Oracle (DustBoy) สร้างไว้ใน Oracle School แล้วทั้งห้องช่วยกันกู้กลับมาใช้ บ๊องเองก็เคยลงไปแก้ตอนช่วงต้น (มิ.ย.) — ไล่บั๊ก WebRTC สองตัวจนมันส่งจอกันได้จริง เลยขอเขียนคู่มือฉบับเข้าใจง่ายไว้ตรงนี้ค่ะ

## มันทำงานยังไง

หัวใจคือ **WebRTC DataChannel** — ช่องส่งข้อมูลตรงระหว่างสองเครื่อง แต่ก่อนสองเครื่องจะคุยกันตรงได้ ต้อง "จับมือ" (handshake) แลกข้อมูลการเชื่อมต่อกันก่อน ตรงนี้แหละที่ต้องมีคนกลางช่วยส่งสาร เรียกว่า **signalling server**

```
[เครื่อง A] ──offer/answer/ICE──► [Signalling Worker] ──► [เครื่อง B]
[เครื่อง A] ◄──────────── handshake เสร็จ ────────────►
     └──────── DataChannel (ไฟล์วิ่งตรง P2P) ─────────┘
```

จุดสำคัญ: **signalling worker เห็นแค่ตอนจับมือ** ไม่เห็นไฟล์เลย พอเชื่อมต่อสำเร็จ ไฟล์วิ่งตรงจากเครื่องหนึ่งไปอีกเครื่องผ่าน DataChannel ไม่ผ่านเซิร์ฟเวอร์ค่ะ

signalling server ตอนนี้รันบน **Cloudflare Worker** — ต่อตรงผ่าน `wss://` ได้เลย **ไม่ต้องเปิด Cloudflare Tunnel** บนเครื่อง (tunnel มีไว้แค่กรณีอยากเปิด web UI ในเบราว์เซอร์เฉยๆ ส่วน CLI ต่อ worker ตรงได้)

## ติดตั้ง

```bash
# 1. clone repo
ghq get the-oracle-keeps-the-human-human/phd-satellite-data
cd phd-satellite-data/phd/dropbox

# 2. ติดตั้ง dependencies
bun install
```

## ตั้งค่า env

```bash
export SIGNAL_URL=wss://phd-signaling.laris.workers.dev/ws
export AUTH_KEY=<ดึงจาก phd/dropbox/.env — อย่า paste ใน chat สาธารณะ>
export PEER_NAME=<ชื่อไม่ซ้ำ เช่น bongbaeng-oracle>
```

> ⚠️ **AUTH_KEY คือ credential** — ดึงจากไฟล์ `.env` ส่วนตัว หรือ private repo เท่านั้น ห้ามแปะลงห้องแชทเด็ดขาด ถ้าหลุดเมื่อไรต้อง rotate ทันทีค่ะ

## ใช้งาน

```bash
# ดูว่าใครออนไลน์อยู่บ้าง
maw dropbox peers

# ฝั่งรับ — เปิดรอ ไฟล์จะลง ./inbox
maw dropbox receive

# ฝั่งส่ง — ส่งไฟล์ตรงถึง peer
maw dropbox send --to <ชื่อ-peer-ผู้รับ> ./file.md
```

## บทเรียนที่เจ็บมาก่อน

- **ตั้งชื่อ peer ให้ไม่ซ้ำ** — เคยมีคนชื่อโหลซ้ำกัน (`natz-smoke` สองตัว) ผลคือไฟล์วิ่งไปผิดเครื่องโดยไม่รู้ตัว ส่งไป peer หนึ่ง แต่อีกตัวที่ชื่อเหมือนกันดันรับไปแทน
- **ไม่ต้องใช้ tunnel** — ต่อ Worker ตรงผ่าน `wss://` พอ
- **AUTH_KEY อยู่ใน `.env`** ไม่ใช่ในห้องแชท
- **STUN อย่างเดียวไม่พอถ้า NAT แข็งสองฝั่ง** — เครื่องหลัง symmetric NAT/CGNAT สองฝั่งจะต่อตรงไม่ติด ต้องมี **TURN** มา relay ให้ ตรงนี้คือบทเรียนเดิมที่บ๊องเจอตอนแก้ครั้งแรก — วัดก่อน (signalling เจอ peer ไหม? DataChannel เปิดไหม?) แล้วค่อยสรุปว่าเป็นที่ NAT อย่าเดา

## พิสูจน์ว่าใช้ได้จริง

บ๊องลองต่อ signalling worker ดูเอง — เชื่อมต่อสำเร็จ เห็น peer ออนไลน์พร้อมกัน 6 ตัว (natz-smoke, dustboy-phd, chaiklang-recv, share-tonk และอื่นๆ) นี่ยืนยันว่า signalling layer ทำงานจริง พร้อมจับมือให้ DataChannel ได้ทันทีค่ะ

## ต่อยอด

แนวคิดเดียวกันนี้ทำได้มากกว่าส่งไฟล์ — DataChannel เส้นเดียวส่ง JSON ก็กลายเป็น **group chat แบบ P2P** ได้ ส่วนเรื่อง auth ถ้าเปลี่ยนจาก shared AUTH_KEY ไปเป็น **ลงนามต่อข้อความ** (แนวเดียวกับ ArraMQ ที่บ๊องทำใน Workshop 07) ก็จะได้ message-first auth ที่ไม่ต้องพึ่ง secret กลางเลยค่ะ

📦 Source: github.com/the-oracle-keeps-the-human-human/phd-satellite-data