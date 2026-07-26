/* ======================================================
   CHUA RESPONSIVE SCENE CONFIG

   One website, two video compositions:
   - desktop: public/web-16_9.mp4
   - mobile:  public/9_16.mp4

   Both videos use the same timeline, but each video has
   a different composition and overlay position.
   ====================================================== */

/* ======================================================
   DESKTOP 16:9
   คงตำแหน่งเดิมทั้งหมด
   ====================================================== */

const desktopScene = {
  mode: "desktop",

  video: "web-16_9.mp4",

  aspectRatio: "16 / 9",

  /* ------------------------------------------------------
     FRUIT HOTSPOTS
     ------------------------------------------------------ */

  fruitHotspots: {
    mango: {
      left: 17.4,
      top: 52.5,
      width: 18.5,
      height: 44,
    },

    strawberry: {
      left: 29.2,
      top: 51,
      width: 14,
      height: 37,
    },

    longan: {
      left: 41,
      top: 51.5,
      width: 13,
      height: 36,
    },

    coconut: {
      left: 55.3,
      top: 52.5,
      width: 17,
      height: 42,
    },

    pineapple: {
      left: 69.3,
      top: 51.5,
      width: 15,
      height: 39,
    },

    mixed: {
      left: 84.7,
      top: 52,
      width: 18,
      height: 42,
    },
  },

  /* ------------------------------------------------------
     BRAND LABELS
     ------------------------------------------------------ */

  brandLabels: {
    polnapa: {
      left: 32.5,
      top: 39.5,

      enterX: -8,
      enterY: 24,

      followX: 30,
      followY: -18,

      exitX: 8,
      exitY: -10,

      lineStart: 44,
      lineEnd: 16,

      wobble: 0.75,
      scaleBoost: 0.008,
    },

    longanic: {
      left: 68.5,
      top: 14,

      enterX: 0,
      enterY: 18,

      followX: -125,
      followY: -74,

      exitX: 8,
      exitY: -12,

      lineStart: 145,
      lineEnd: 12,

      wobble: 0.8,
      scaleBoost: 0.01,
    },

    matsuri: {
      left: 86.5,
      top: 19,

      enterX: 12,
      enterY: 18,

      followX: -76,
      followY: -60,

      exitX: 10,
      exitY: -10,

      lineStart: 100,
      lineEnd: 12,

      wobble: 0.72,
      scaleBoost: 0.008,
    },
  },

  /* ------------------------------------------------------
     DESKTOP BRAND DETAIL
     ------------------------------------------------------ */

  brandDetails: {
    default: {
      left: "clamp(54px, 6vw, 112px)",

      right: "auto",

      top: "clamp(232px, 31vh, 332px)",

      bottom: "auto",

      width: "min(36vw, 560px)",

      maxHeight: "none",
    },
  },
};

/* ======================================================
   MOBILE 9:16
   ====================================================== */

const mobileScene = {
  mode: "mobile",

  video: "9_16.mp4",

  aspectRatio: "9 / 16",

  /* ------------------------------------------------------
     FRUIT HOTSPOTS
     วัดตามคลิปมือถือ 1080 × 1920
     ------------------------------------------------------ */

  fruitHotspots: {
    mango: {
      left: 36,
      top: 25,
      width: 34,
      height: 24,
    },

    strawberry: {
      left: 63,
      top: 25,
      width: 30,
      height: 22,
    },

    longan: {
      left: 50,
      top: 42,
      width: 38,
      height: 24,
    },

    coconut: {
      left: 29,
      top: 52,
      width: 34,
      height: 24,
    },

    pineapple: {
      left: 62,
      top: 59,
      width: 34,
      height: 24,
    },

    mixed: {
      left: 53,
      top: 75,
      width: 48,
      height: 24,
    },
  },

  /* ------------------------------------------------------
     MOBILE BRAND LABELS

     POLNAPA:
     คงอยู่ใต้หัวข้อ Our House Brands

     LONGANIC และ MATSURI:
     ย้ายลงไปใต้กลุ่มสินค้า
     ไม่เคลื่อนขึ้นไปทับตัวสินค้า
     ------------------------------------------------------ */

  brandLabels: {
    polnapa: {
      left: 50,
      top: 17.2,

      enterX: 0,
      enterY: 18,

      followX: 0,
      followY: 126,

      exitX: 0,
      exitY: -10,

      lineStart: 26,
      lineEnd: 12,

      wobble: 0.12,
      scaleBoost: 0.004,
    },

    longanic: {
      left: 33,
      top: 78.5,

      enterX: 0,
      enterY: 12,

      followX: 0,
      followY: 0,

      exitX: 0,
      exitY: -8,

      lineStart: 0,
      lineEnd: 0,

      wobble: 0,
      scaleBoost: 0.002,
    },

    matsuri: {
      left: 70,
      top: 78.5,

      enterX: 0,
      enterY: 12,

      followX: 0,
      followY: 0,

      exitX: 0,
      exitY: -8,

      lineStart: 0,
      lineEnd: 0,

      wobble: 0,
      scaleBoost: 0.002,
    },
  },

  /* ------------------------------------------------------
     MOBILE BRAND DETAIL

     POLNAPA / LONGANIC / MATSURI
     ใช้ตำแหน่งเดียวกันทั้งหมด

     กล่องอยู่ด้านล่าง เหนือเปอร์เซ็นต์
     และ Progress Bar
     ------------------------------------------------------ */

  brandDetails: {
    default: {
      left: "14px",

      right: "14px",

      top: "auto",

      bottom:
        "max(72px, calc(env(safe-area-inset-bottom) + 62px))",

      width: "auto",

      maxHeight: "none",
    },
  },
};

/* ======================================================
   EXPORT
   ====================================================== */

export const RESPONSIVE_SCENES =
  Object.freeze({
    desktop:
      Object.freeze(
        desktopScene
      ),

    mobile:
      Object.freeze(
        mobileScene
      ),
  });

export const normalizeSceneMode = (
  mode
) =>
  mode === "mobile"
    ? "mobile"
    : "desktop";

export const getResponsiveScene = (
  mode = "desktop"
) =>
  RESPONSIVE_SCENES[
    normalizeSceneMode(
      mode
    )
  ];
