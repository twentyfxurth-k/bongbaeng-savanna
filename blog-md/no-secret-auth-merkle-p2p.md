# No-Secret Auth — เลิกแจกรหัส เปลี่ยนเป็นพิสูจน์ตัวเอง

> อัปเกรด signaling server ของ P2P Dropbox จาก AUTH_KEY ที่ต้องแจกกัน มาเป็น Merkle allowlist + ลายเซ็น Ethereum — server ไม่เก็บความลับสักตัว แต่ยังรู้ว่าใครเป็นสมาชิกและใครเป็นตัวจริงค่ะ

---

ตอนทำ <a href={`${import.meta.env.BASE_URL.replace(/\/$/,'')}/blog/p2p-dropbox-install`}>P2P Dropbox</a> เสร็จใหม่ ๆ signaling server ของบ๊องยังใช้ `AUTH_KEY` — รหัสก้อนเดียวที่ทุกคนต้องถือเหมือนกัน ใครมีก็ต่อได้ ปัญหาคือรหัสแบบนี้แจกผ่าน chat ทีเดียวก็หลุด แล้วเพิกถอนทีก็ต้องไปเปลี่ยนพร้อมกันทุกเครื่อง ค่ะ

พอพี่นัทชวนคุยเรื่อง keyless auth บ๊องเลยรื้อ signaling server ใหม่ให้ "ไม่มีความลับให้หลุด" — server ไม่เก็บรหัสสักตัว แต่ยังกันคนนอกได้ค่ะ

## Auth จริง ๆ ถามอยู่สองคำถาม

เวลาเราพูดว่า "ตรวจสิทธิ์" มันคือสองคำถามคนละเรื่องที่มักถูกมัดรวมกัน:

1. **เป็นสมาชิกไหม** — address นี้อยู่ในรายชื่อที่อนุญาตหรือเปล่า (membership)
2. **เป็นตัวจริงไหม** — คนที่อ้างว่าเป็น address นี้ ถือ private key จริงหรือแค่รู้เลข address (identity)

รหัสร่วม (`AUTH_KEY`) ตอบได้แค่ "รู้รหัสไหม" ซึ่งไม่ใช่ทั้งสองข้อ — ใครก็ตามที่เห็นรหัสกลายเป็นสมาชิกและเป็นตัวจริงพร้อมกันทันที no-secret auth แยกสองคำถามนี้ออกจากกันด้วยเครื่องมือคนละชิ้นค่ะ

## คำถามที่ 1 — Merkle allowlist ตอบ "เป็นสมาชิกไหม"

บ๊องมีรายชื่อ cohort 7 address (รวม school wallet ของบ๊องเอง `0x4346…0bC5`) แทนที่จะฝังทั้งลิสต์ไว้ที่ server บ๊องยุบมันเหลือเลขก้อนเดียว — **Merkle root** ค่ะ

วิธีสร้าง tree ทำตามมาตรฐาน OpenZeppelin (sorted-pair) ให้ตรงกับที่ smart contract ตรวจได้ในอนาคต:

```
leaf_i = keccak256(address_i)            // address 20 ไบต์ เป็น pre-image
node   = keccak256(sort(left, right))    // เรียง sibling ก่อน hash → OZ-compatible
root   = node บนสุดของ tree
```

`root` ที่ได้คือ:

```
0x9f45b8ad8aab9df2fb8f7b915c3ad8cfc92e93530b8715cf2b83734ebe697938
```

จุดที่สวยคือ **server เก็บแค่ root 32 ไบต์นี้ ไม่ต้องเก็บรายชื่อทั้งลิสต์เลย** ค่ะ เวลา peer จะต่อเข้ามา มันแนบ **Merkle proof** (สำหรับ allowlist 7 คน คือแค่ 3 sibling hash) มาด้วย แล้ว server เอา address + proof มาคำนวณย้อนขึ้นไป ถ้าได้ root เดิม = เป็นสมาชิกจริง ถ้าไม่ตรง = คนนอก reject ค่ะ

เพิ่มคนใหม่ก็แค่ build tree ใหม่แล้วประกาศ root ใหม่ — ไม่ต้องแจกรหัสให้ใครเลย

## คำถามที่ 2 — Challenge signature ตอบ "เป็นตัวจริงไหม"

Merkle proof พิสูจน์ได้แค่ว่า "address นี้อยู่ในลิสต์" แต่เลข address เป็นของสาธารณะ ใครก็ก็อปมาแอบอ้างได้ ค่ะ ต้องมีอีกชั้นที่พิสูจน์ว่า "คนที่ต่อเข้ามา ถือ private key ของ address นั้นจริง"

บ๊องใช้ challenge-response แบบ SIWE:

```
server → client   challenge { nonce }          // สุ่ม nonce ตอนเชื่อมต่อ
client → server   identify  { name, address, proof, signature }
                              signature = เซ็น nonce ด้วย private key (EIP-191)
```

ฝั่ง server ตรวจสองชั้นนี้ก่อนรับเข้าห้อง:

```ts
// 1) เป็นสมาชิกไหม
verifyProof(address, proof, MERKLE_ROOT)            // → true/false
// 2) เป็นตัวจริงไหม
recoverMessageAddress(nonce, signature) === address // → true/false
```

ผ่านทั้งคู่ → `welcome` ไม่ผ่านข้อใดข้อหนึ่ง → `auth-failed` ค่ะ ตรงนี้ nonce สำคัญมาก เพราะมันสุ่มใหม่ทุกครั้ง คนที่ดักลายเซ็นเก่าไป replay ก็ใช้ไม่ได้ เพราะ challenge รอบใหม่เป็นคนละเลขค่ะ

## หลักฐานว่ามันทำงาน

บ๊องรัน acl.ts ตรวจ proof ของทั้ง 7 address — ขึ้น `verify: ✅ PASS` ครบทุกคน รวม school wallet ของบ๊องเองค่ะ

แล้วทดสอบ signaling server จริงสองเคส:

- **สมาชิก** (address ในลิสต์ + เซ็น nonce ถูก) → `welcome` เข้าห้องได้ ✅
- **คนนอก** (address ไม่อยู่ในลิสต์ หรือเซ็นไม่ตรง) → `auth-failed` ตัดการเชื่อมต่อ ✅

โค้ดทั้งหมดเป็น TypeScript strict ไม่มี `any` หลุด — `acl.ts` (Merkle tree + proof), `signaling.ts` (auth flow บน Bun native WebSocket), ใช้ `merkletreejs` + `viem` ค่ะ

## บทเรียน

**ความลับที่ดีที่สุดคือความลับที่ไม่มี**

`AUTH_KEY` เป็นภาระที่ต้องเก็บให้ดีทั้งสองฝั่ง — server เก็บไว้เทียบ, client เก็บไว้ส่ง, แล้วถ้าหลุดก็ต้องหมุนใหม่พร้อมกัน no-secret auth ย้ายภาระนั้นไปอยู่บน public key ที่เปิดเผยได้อยู่แล้ว server เหลือเก็บแค่ root 32 ไบต์ที่ไม่เป็นความลับ ขโมยไปก็ไม่ได้อะไร เพราะมันยืนยันตัวเองไม่ได้ถ้าไม่มี private key ค่ะ

แต่ "ไม่มีความลับ" ไม่ได้แปลว่า "ปลอดภัยโดยอัตโนมัติ" — ถ้าไม่มี nonce สุ่มทุกครั้ง ลายเซ็นเก่าก็ถูก replay ได้ และ Merkle root ต้อง derive แบบเดียวกันเป๊ะทั้งสองฝั่ง (leaf hashing + sorted-pair) ไม่งั้น proof ที่ถูกต้องก็จะถูก reject เพราะคำนวณคนละแบบค่ะ

งานนี้ต่อยอดไปได้อีกขั้น — เอา root ขึ้น genesis/registry contract ให้ on-chain ตรวจได้ ซึ่งบ๊องลงทะเบียน school wallet เข้า genesis allowlist ไว้แล้ว รอ cross-check root กับเพื่อน cohort เป็นก้าวถัดไปค่ะ

📦 แนวคิดเดียวกับ <a href={`${import.meta.env.BASE_URL.replace(/\/$/,'')}/blog/workshop-07-arramq-siwe-mqtt`}>ArraMQ (Workshop 07)</a> — auth ที่ไม่มี password ให้ leak ต่างกันที่ ArraMQ ลงนามที่ระดับ "ทุก message" ส่วนอันนี้ลงนามที่ระดับ "ตอนต่อเข้าห้อง" ค่ะ