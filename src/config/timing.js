// Master scroll timeline for public/web-16_9.mp4
// Reference clip: 42.3 seconds, 1920x1080, 60 fps.
//
// ค่าในไฟล์นี้เป็น Scroll Progress:
// 0.00 = 0%
// 0.30 = 30%
// 0.43 = 43%
// 0.50 = 50%
// 0.61 = 61%
// 0.85 = 85%
// 1.00 = 100%

// ======================================================
// VIDEO SPEED CURVE
// ======================================================

export const VIDEO_SCROLL_KEYFRAMES = [
  [0.0, 0.0],
  [0.2, 0.2],
  [0.49, 0.49],
  [0.61, 0.61],
  [0.73, 0.73],
  [0.87, 0.87],
  [0.91, 0.93],
  [1.0, 0.998],
];

// ======================================================
// INTRO LOGO
// ======================================================

export const LOGO_APPEAR_START_PROGRESS = 0.035;
export const LOGO_VISIBLE_PROGRESS = 0.065;

export const LOGO_GROW_START_PROGRESS = 0.065;
export const LOGO_GROW_END_PROGRESS = 0.105;

export const LOGO_HOLD_MOTION_START_PROGRESS = 0.125;
export const LOGO_HOLD_MOTION_END_PROGRESS = 0.175;

export const TAGLINE_IN_START_PROGRESS = 0.105;
export const TAGLINE_IN_END_PROGRESS = 0.135;

export const SUBTAGLINE_IN_START_PROGRESS = 0.125;
export const SUBTAGLINE_IN_END_PROGRESS = 0.155;

export const ORBIT_IN_START_PROGRESS = 0.13;
export const ORBIT_IN_END_PROGRESS = 0.16;

export const ORBIT_OUT_START_PROGRESS = 0.18;
export const ORBIT_OUT_END_PROGRESS = 0.205;

export const LOGO_SPIN_EXIT_START_PROGRESS = 0.18;
export const LOGO_SPIN_EXIT_END_PROGRESS = 0.215;

// ======================================================
// STRIVING MESSAGE
// ======================================================

export const STORY_START_PROGRESS = 0.215;
export const STORY_FULL_PROGRESS = 0.235;

export const STORY_EXIT_START_PROGRESS = 0.27;
export const STORY_EXIT_END_PROGRESS = 0.295;

export const STORY_LINE_START_PROGRESS = 0.222;
export const STORY_LINE_STAGGER = 0.006;
export const STORY_LINE_REVEAL_DURATION = 0.018;

// ======================================================
// CURATED FRUITS MESSAGE
// 30% เข้า / 35% เริ่มออก / 37% หายหมด
// ======================================================

export const INGREDIENT_START_PROGRESS = 0.3;
export const INGREDIENT_FULL_PROGRESS = 0.32;

export const INGREDIENT_EXIT_START_PROGRESS = 0.35;
export const INGREDIENT_EXIT_END_PROGRESS = 0.37;

export const INGREDIENT_ITEM_START_PROGRESS = 0.3;
export const INGREDIENT_ITEM_STAGGER = 0.004;
export const INGREDIENT_ITEM_REVEAL_DURATION = 0.02;

// ======================================================
// FRUIT HOTSPOTS
// หมุดกดดูรายละเอียดผลไม้ในวิดีโอ
//
// 40.5% เริ่มแสดง
// 43% ชัดเต็มที่
// แสดงเต็มจนถึง 50%
// 50–51% ค่อย ๆ Fade ออก
// ======================================================

export const FRUIT_HOTSPOT_IN_START = 0.405;

export const FRUIT_HOTSPOT_IN_FULL = 0.43;

// คงปุ่มและข้อความไว้เต็มที่จนถึง 50%
export const FRUIT_HOTSPOT_OUT_START = 0.5;

// เริ่มจาก 50% และหายสนิทตอน 51%
export const FRUIT_HOTSPOT_OUT_END = 0.51;

// ======================================================
// OUR HOUSE BRANDS HEADLINE
// อยู่จนถึง 85% แล้วค่อย Fade ออก
// ======================================================

export const LINEUP_BRIDGE_IN_START = 0.505;
export const LINEUP_BRIDGE_IN_FULL = 0.545;

// แสดงค้างยาวจนถึง 85%
export const LINEUP_BRIDGE_EXIT_START = 0.85;

// หายพร้อมช่วงผลิตภัณฑ์สุดท้าย
export const LINEUP_BRIDGE_EXIT_END = 0.87;

// ======================================================
// PRODUCT BRAND LABELS
// POLNAPA / LONGANIC / MATSURI
// ======================================================

// เริ่มแสดงชื่อแบรนด์
export const LABEL_WRAP_IN_START = 0.595;

// ชื่อชัดเต็มที่ตอนประมาณ 61%
export const LABEL_WRAP_IN_END = 0.61;

// ขยับตามสินค้า
export const LABEL_FOLLOW_PRODUCT_START = 0.665;
export const LABEL_FOLLOW_PRODUCT_END = 0.718;

// เริ่มหาย
export const LABEL_OUT_START = 0.723;
export const LABEL_OUT_END = 0.742;

// ======================================================
// BRAND DETAIL
// POLNAPA / LONGANIC / MATSURI
// ======================================================

export const BRAND_DETAIL_IN_START = 0.735;
export const BRAND_DETAIL_IN_FULL = 0.755;

// กล่อง Matsuri เริ่มกลืนหายไปกับวิดีโอ
export const BRAND_DETAIL_EXIT_START = 0.852;

// หายสนิทก่อนเข้า Certificate
export const BRAND_DETAIL_EXIT_END = 0.878;

export const BRAND_RANGES = [
  [0.735, 0.78], // POLNAPA
  [0.78, 0.825], // LONGANIC
  [0.825, 0.865], // MATSURI
];

// ======================================================
// CERTIFICATE
// ======================================================

export const CERTIFICATE_START_PROGRESS = 0.89;
export const CERTIFICATE_FULL_PROGRESS = 0.905;

export const CERTIFICATE_EXIT_START_PROGRESS = 0.928;
export const CERTIFICATE_EXIT_END_PROGRESS = 0.94;

// ======================================================
// OEM
// ======================================================

export const OEM_CONTACT_START_PROGRESS = 0.94;
export const OEM_CONTACT_FULL_PROGRESS = 0.952;

export const OEM_CONTACT_EXIT_START_PROGRESS = 0.965;
export const OEM_CONTACT_EXIT_END_PROGRESS = 0.975;

// ======================================================
// CONTACT
// ======================================================

export const CONTACT_IN_START = 0.975;
export const CONTACT_IN_FULL = 0.985;

// ======================================================
// AMBIENT BACKGROUND
// ======================================================

export const AMBIENT_START = 0.015;
export const AMBIENT_FULL = 0.08;
