# CHUA Group Website

เว็บไซต์ static สำหรับนำเสนอสินค้าและบริการของ CHUA Group สร้างด้วย Vite, JavaScript และ CSS แบบแยกไฟล์ โปรเจกต์นี้เน้นประสบการณ์แบบ scroll-driven video พร้อม asset รูปสินค้า วิดีโอ ใบรับรอง และ section ต่าง ๆ สำหรับหน้าเว็บบริษัท

เว็บไซต์ตัวอย่างที่ deploy แล้ว:

```text
https://fruitpopchua.vercel.app
```

## สารบัญ

- [สิ่งที่ต้องมีในเครื่อง](#สิ่งที่ต้องมีในเครื่อง)
- [วิธีติดตั้งโปรเจกต์](#วิธีติดตั้งโปรเจกต์)
- [วิธีรันเว็บในเครื่อง](#วิธีรันเว็บในเครื่อง)
- [วิธี build สำหรับใช้งานจริง](#วิธี-build-สำหรับใช้งานจริง)
- [วิธี preview ไฟล์หลัง build](#วิธี-preview-ไฟล์หลัง-build)
- [โครงสร้างไฟล์สำคัญ](#โครงสร้างไฟล์สำคัญ)
- [ขั้นตอนการแก้ไขงานทั่วไป](#ขั้นตอนการแก้ไขงานทั่วไป)
- [การ deploy](#การ-deploy)
- [Troubleshooting](#troubleshooting)

## สิ่งที่ต้องมีในเครื่อง

ก่อนเริ่มติดตั้ง โปรดตรวจสอบว่ามีโปรแกรมเหล่านี้แล้ว:

1. Node.js เวอร์ชัน 18 ขึ้นไป
2. npm ซึ่งจะติดมากับ Node.js
3. Git สำหรับ clone, commit และ push งาน

ตรวจสอบเวอร์ชันด้วยคำสั่ง:

```bash
node -v
npm -v
git --version
```

ถ้ายังไม่มี Node.js ให้ดาวน์โหลดและติดตั้งจากเว็บไซต์ทางการ:

```text
https://nodejs.org/
```

แนะนำให้เลือกเวอร์ชัน LTS เพราะเสถียรกว่าสำหรับงาน production

## วิธีติดตั้งโปรเจกต์

### 1. Clone โปรเจกต์

ถ้ายังไม่มีโฟลเดอร์โปรเจกต์ในเครื่อง ให้ clone จาก GitHub ก่อน:

```bash
git clone <repository-url>
```

จากนั้นเข้าไปที่โฟลเดอร์โปรเจกต์:

```bash
cd web_chua_pop-retimed
```

ถ้ามีโฟลเดอร์โปรเจกต์อยู่แล้ว ให้เข้าไปที่โฟลเดอร์นั้นโดยตรง เช่น:

```bash
cd "D:\Chua Group\web_chua_pop-retimed"
```

### 2. ติดตั้ง dependencies

รันคำสั่งนี้ที่ root ของโปรเจกต์ ซึ่งเป็นตำแหน่งเดียวกับไฟล์ `package.json`:

```bash
npm install
```

คำสั่งนี้จะติดตั้งแพ็กเกจที่โปรเจกต์ต้องใช้ เช่น:

- `vite` สำหรับรัน dev server และ build เว็บ
- `vite-plugin-singlefile` สำหรับรวมไฟล์ build ให้นำไป deploy ง่ายขึ้น

หลังติดตั้งสำเร็จ จะมีโฟลเดอร์ `node_modules/` เพิ่มขึ้นมาในเครื่อง

### 3. ตรวจสอบว่าติดตั้งสำเร็จ

ลองดูรายการ script ที่โปรเจกต์มี:

```bash
npm run
```

ควรเห็น script หลักประมาณนี้:

```text
dev
build
preview
```

## วิธีรันเว็บในเครื่อง

ใช้คำสั่ง:

```bash
npm run dev
```

Vite จะเปิด dev server ที่เครื่องเรา โดยโปรเจกต์นี้ตั้งค่า host ไว้ที่ `127.0.0.1`

โดยปกติ URL จะเป็น:

```text
http://127.0.0.1:5173/
```

เปิด URL นี้ใน browser เพื่อดูเว็บไซต์ระหว่างพัฒนา

ถ้า port `5173` ถูกใช้งานอยู่แล้ว Vite อาจเลือก port อื่นให้โดยอัตโนมัติ ให้ดู URL จริงจากข้อความใน terminal

## วิธี build สำหรับใช้งานจริง

เมื่อต้องการสร้างไฟล์สำหรับ production ให้รัน:

```bash
npm run build
```

ผลลัพธ์จะถูกสร้างไว้ในโฟลเดอร์:

```text
dist/
```

โปรเจกต์นี้ใช้ `vite-plugin-singlefile` และตั้งค่าใน `vite.config.js` เพื่อช่วยรวม asset หลักเข้าไปในไฟล์ build ทำให้ deploy ง่ายขึ้น

หลัง build สำเร็จ ควรตรวจสอบเว็บด้วย `npm run preview` ก่อนนำไป deploy จริง

## วิธี preview ไฟล์หลัง build

หลังจากรัน `npm run build` แล้ว ให้รัน:

```bash
npm run preview
```

จากนั้นเปิด URL ที่ Vite แสดงใน terminal เช่น:

```text
http://127.0.0.1:4173/
```

ขั้นตอนนี้ใช้ตรวจสอบไฟล์ production build ว่า asset, animation, วิดีโอ และ layout แสดงผลถูกต้องก่อน deploy

## โครงสร้างไฟล์สำคัญ

```text
index.html                         ไฟล์ HTML หลักของเว็บไซต์
package.json                       รายการ script และ dependencies ของโปรเจกต์
package-lock.json                  lock file สำหรับควบคุมเวอร์ชัน dependencies
vite.config.js                     ตั้งค่า Vite และ vite-plugin-singlefile

src/main.js                        entry point หลักของ JavaScript
src/config/timing.js               ค่าจังหวะและ timeline ของ scroll animation
src/config/responsiveScenes.js     ตั้งค่าวิดีโอ desktop/mobile
src/effects/                       logic ของ animation และ interactive effects
src/styles/                        CSS แยกตาม section หรือ feature
src/assets/                        asset ที่ import ผ่าน source code

public/web-16_9.mp4                วิดีโอหลักสำหรับ desktop
public/9_16.mp4                    วิดีโอหลักสำหรับ mobile
public/Dried FRUIT/                รูปสินค้า dried fruit
public/certificate/                รูปใบรับรอง
public/project/                    รูปโปรเจกต์หรือแบรนด์

dist/                              โฟลเดอร์ผลลัพธ์หลัง build
node_modules/                      dependencies ที่ติดตั้งในเครื่อง
```

หมายเหตุ: `dist/` และ `node_modules/` ไม่ควร commit ขึ้น Git เพราะสร้างใหม่ได้จากคำสั่ง `npm install` และ `npm run build`

## ขั้นตอนการแก้ไขงานทั่วไป

Workflow แนะนำสำหรับแก้ไขเว็บ:

1. ดึงโค้ดล่าสุดก่อนเริ่มงาน

```bash
git pull
```

2. ติดตั้ง dependencies ถ้ายังไม่เคยติดตั้ง หรือมีการเปลี่ยน `package.json`

```bash
npm install
```

3. เปิด dev server

```bash
npm run dev
```

4. แก้ไขไฟล์ที่เกี่ยวข้อง

- แก้โครงสร้างหน้าเว็บที่ `index.html`
- แก้ style ที่ `src/styles/`
- แก้ animation หรือ behavior ที่ `src/effects/`
- แก้จังหวะ scroll/video ที่ `src/config/timing.js`
- แก้การเลือกวิดีโอตามหน้าจอที่ `src/config/responsiveScenes.js`
- เพิ่มหรือเปลี่ยนรูปและวิดีโอใน `public/`

5. ตรวจสอบบน browser ระหว่างแก้ไข

เปิด:

```text
http://127.0.0.1:5173/
```

6. Build เพื่อตรวจสอบ production

```bash
npm run build
```

7. Preview production build

```bash
npm run preview
```

8. ตรวจสอบสถานะไฟล์ก่อน commit

```bash
git status
```

9. Commit งาน

```bash
git add .
git commit -m "Update website"
```

10. Push ขึ้น repository

```bash
git push
```

## การ deploy

โปรเจกต์นี้สามารถ deploy กับ static hosting ได้ เช่น Vercel, Netlify หรือ hosting ที่รองรับไฟล์ static

### Deploy ผ่าน Vercel

ตั้งค่าหลักโดยทั่วไป:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

ขั้นตอนโดยรวม:

1. Push โค้ดล่าสุดขึ้น GitHub
2. เปิด Vercel และ import repository
3. ตั้งค่า build ตามด้านบน
4. Deploy
5. ตรวจสอบหน้า production ว่าวิดีโอ รูปภาพ และ animation แสดงผลถูกต้อง

ก่อน deploy จริง ควรตรวจสอบค่า domain, meta tag, canonical URL และ structured data ใน `index.html` ให้ตรงกับ domain production

## รายละเอียดเกี่ยวกับวิดีโอและ scroll timeline

เว็บไซต์นี้ใช้วิดีโอเป็นแกนหลักของประสบการณ์หน้าเว็บ:

- Desktop ใช้ `public/web-16_9.mp4`
- Mobile ใช้ `public/9_16.mp4`
- การเลือกวิดีโอตามขนาดหน้าจออยู่ที่ `src/config/responsiveScenes.js`
- จังหวะ scroll และ keyframe หลักอยู่ที่ `src/config/timing.js`

ถ้าเปลี่ยนวิดีโอใหม่ ควรตรวจสอบ:

1. ชื่อไฟล์วิดีโอตรงกับค่าที่อ้างอิงใน code
2. ไฟล์อยู่ในโฟลเดอร์ `public/`
3. ความยาววิดีโอสัมพันธ์กับ timeline ใน `src/config/timing.js`
4. ทดสอบทั้ง desktop และ mobile
5. รัน `npm run build` และ `npm run preview` ก่อน deploy

## Troubleshooting

### รัน `npm install` ไม่ผ่าน

ลองตรวจสอบ Node.js ก่อน:

```bash
node -v
npm -v
```

ถ้า Node.js ต่ำกว่าเวอร์ชัน 18 แนะนำให้อัปเดตเป็นเวอร์ชัน LTS ล่าสุด แล้วรันใหม่:

```bash
npm install
```

### เปิดเว็บแล้ว port 5173 ใช้ไม่ได้

ดู URL ที่ Vite แสดงใน terminal เพราะ Vite อาจเปลี่ยนไปใช้ port อื่น เช่น `5174`

หรือหยุด process เดิมด้วย `Ctrl + C` แล้วรันใหม่:

```bash
npm run dev
```

### แก้ไฟล์แล้ว browser ไม่เปลี่ยน

ให้ลอง refresh browser ก่อน ถ้ายังไม่เปลี่ยนให้หยุด dev server ด้วย `Ctrl + C` แล้วรันใหม่:

```bash
npm run dev
```

### Build แล้วไฟล์ใน `dist/` เก่า

ให้ build ใหม่:

```bash
npm run build
```

จากนั้น preview อีกครั้ง:

```bash
npm run preview
```

### รูปหรือวิดีโอไม่ขึ้น

ตรวจสอบสิ่งเหล่านี้:

- path ของไฟล์ถูกต้อง
- ชื่อไฟล์ตรงตัวพิมพ์เล็ก/ใหญ่
- ไฟล์อยู่ใน `public/` ถ้าอ้างอิงผ่าน path แบบ public
- ไฟล์ไม่ได้ถูกลบหรือเปลี่ยนชื่อ
- หลังเปลี่ยน asset ให้รัน `npm run build` ใหม่ก่อน deploy

### GitHub แจ้งเตือนเรื่องไฟล์ใหญ่

ไฟล์วิดีโอใน `public/` มีขนาดค่อนข้างใหญ่ GitHub อาจแสดง warning หากไฟล์เกิน 50 MB แต่ยัง push ได้ถ้าไม่เกิน limit สูงสุดของ GitHub

ถ้าไฟล์ใหญ่มากหรือมีหลายเวอร์ชัน ควรพิจารณาบีบอัดวิดีโอ หรือนำไฟล์วิดีโอไปเก็บผ่านระบบ asset hosting แยกต่างหาก
