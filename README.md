# Fruits / CHUA Group Website

เว็บไซต์ static สำหรับนำเสนอสินค้าและบริการของ CHUA Group สร้างด้วย Vite และ JavaScript/CSS แบบแยกไฟล์
https://fruits-iota-pink.vercel.app/

## สิ่งที่ต้องมี

- Node.js เวอร์ชัน 18 ขึ้นไป
- npm

## ติดตั้งโปรเจกต์

```bash
cd /workspaces/Fruits
npm install
```

ถ้ามีโฟลเดอร์ `node_modules` อยู่แล้ว สามารถข้ามขั้นตอน `npm install` ได้

## วิธีรันสำหรับพัฒนา

```bash
npm run dev
```

จากนั้นเปิด URL ที่ Vite แสดงใน terminal โดยปกติจะเป็น:

```text
http://127.0.0.1:5173/
```

ถ้าใช้งานผ่าน Codespaces ให้เปิดจากแท็บ Ports หรือ Forwarded Ports ของพอร์ต `5173`

## วิธี build ไฟล์สำหรับใช้งานจริง

```bash
npm run build
```

ผลลัพธ์จะถูกสร้างไว้ในโฟลเดอร์:

```text
dist/
```

โปรเจกต์นี้ใช้ `vite-plugin-singlefile` เพื่อรวมไฟล์เว็บให้พร้อมนำไป deploy ได้ง่ายขึ้น

## วิธี preview หลัง build

```bash
npm run preview
```

จากนั้นเปิด URL ที่แสดงใน terminal เพื่อตรวจสอบไฟล์ production build ก่อนนำไปใช้งานจริง

## โครงสร้างไฟล์สำคัญ

```text
index.html              ไฟล์ HTML หลัก
src/main.js             จุดเริ่มต้นของ JavaScript
src/styles/             ไฟล์ CSS แยกตามส่วนของหน้าเว็บ
src/effects/            เอฟเฟกต์และ logic สำหรับ animation
src/config/timing.js    ค่าจังหวะ/เวลาในการแสดงผล
public/                 ไฟล์ static เช่น รูปภาพและวิดีโอ
dist/                   ไฟล์ที่ได้จากการ build
vite.config.js          ตั้งค่า Vite และ plugin build
```

## ขั้นตอนแก้ไขงานทั่วไป

1. แก้ไขไฟล์ใน `index.html`, `src/`, หรือ `public/`
2. รัน `npm run dev` เพื่อตรวจสอบหน้าเว็บระหว่างแก้ไข
3. รัน `npm run build` เพื่อสร้างไฟล์ production
4. รัน `npm run preview` เพื่อตรวจสอบผลลัพธ์หลัง build
5. commit และ push ขึ้น GitHub เมื่อพร้อม

ตัวอย่างคำสั่ง Git:

```bash
git status
git add .
git commit -m "Update website"
git push
```

## หมายเหตุ

- วิดีโอหลักของเว็บคือ `public/web 16_9.mp4` และถูกผูกกับ scroll timeline ใน `src/config/timing.js`
- ไฟล์วิดีโอมีขนาดค่อนข้างใหญ่ GitHub จะแสดง warning ถ้าไฟล์เกิน 50 MB แต่ยังสามารถ push ได้ตราบใดที่ไม่เกิน limit สูงสุดของ GitHub
- ก่อน deploy จริงควรตรวจสอบค่า domain ใน meta tag และ structured data ภายใน `index.html` ให้ตรงกับโดเมน production

## การปรับล่าสุดสำหรับวิดีโอ 16:9

- เปลี่ยนวิดีโอหลักเป็น `public/web 16_9.mp4`
- ถอดเลเยอร์รูปและพื้นหลังของหัวข้อ `OUR FRUITS` ออก เพื่อใช้ภาพจากวิดีโอโดยตรง
- รวมค่าจังหวะการแสดงผลและความเร็วของวิดีโอไว้ที่ `src/config/timing.js`
- ปรับพื้นที่ scroll เป็น `2200vh` สำหรับ desktop และ `1950vh` สำหรับ mobile
- แพ็กเกจซอร์สนี้ไม่รวมโฟลเดอร์ `dist` เก่า เพื่อป้องกันการ deploy ไฟล์ที่ยังอ้าง asset เวอร์ชันเดิม กรุณารัน `npm run build` เพื่อสร้าง `dist` ใหม่
