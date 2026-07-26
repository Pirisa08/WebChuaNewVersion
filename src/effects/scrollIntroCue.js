import "../styles/scrollIntroCue.css";

import {
  clamp,
  smoothstep,
} from "../utils/animation.js";

/* ======================================================
   SCROLL INTRO CUE SETTINGS
   ====================================================== */

/*
 * เริ่มค่อย ๆ หายเมื่อเลื่อนผ่าน 1.2%
 */
const CUE_HIDE_START_PROGRESS = 0.012;

/*
 * หายทั้งหมดเมื่อเลื่อนถึง 7%
 */
const CUE_HIDE_END_PROGRESS = 0.07;

/*
 * เมื่อกด Scroll Cue
 * ให้เลื่อนไปยังตำแหน่ง 8.5% ของเว็บไซต์
 */
const CLICK_TARGET_PROGRESS = 0.085;

/*
 * ID ของ Element
 */
const CUE_ID = "scrollIntroCue";

/* ======================================================
   STATE
   ====================================================== */

const state = {
  initialized: false,

  stage: null,
  stickyFrame: null,

  cue: null,
  button: null,

  animationFrame: null,

  stageTop: 0,
  stageScrollable: 1,
};

/* ======================================================
   HELPERS
   ====================================================== */

/**
 * อ่าน Scroll Progress ของหน้า Experience
 * คืนค่า 0–1
 */
const getScrollProgress = () => {
  if (!state.stage) {
    return 0;
  }

  if (state.stageScrollable <= 0) {
    return 0;
  }

  return clamp(
    (
      window.scrollY -
      state.stageTop
    ) /
      state.stageScrollable,
    0,
    1
  );
};

const measureStage = () => {
  if (!state.stage) {
    state.stageTop = 0;
    state.stageScrollable = 1;

    return;
  }

  const rect =
    state.stage.getBoundingClientRect();

  state.stageTop =
    window.scrollY +
    rect.top;

  state.stageScrollable =
    Math.max(
      state.stage.offsetHeight -
        window.innerHeight,
      1
    );
};

/**
 * ตรวจสอบว่าผู้ใช้เปิด Reduced Motion หรือไม่
 */
const prefersReducedMotion = () =>
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

/* ======================================================
   CREATE CUE
   ====================================================== */

const createScrollCue = () => {
  if (
    !state.stickyFrame ||
    document.getElementById(CUE_ID)
  ) {
    return;
  }

  const cue =
    document.createElement("div");

  cue.id = CUE_ID;
  cue.className = "scroll-intro-cue";

  cue.setAttribute(
    "aria-hidden",
    "false"
  );

  cue.innerHTML = `
    <button
      class="scroll-intro-cue__button"
      type="button"
      aria-label="Scroll to explore Thai dried fruit, OEM, private label, and global export services"
    >
      <span
        class="scroll-intro-cue__signal"
        aria-hidden="true"
      >
        <span class="scroll-intro-cue__signal-core"></span>
        <span class="scroll-intro-cue__signal-ring"></span>
      </span>

      <span class="scroll-intro-cue__content">
        <span class="scroll-intro-cue__eyebrow">
          Scroll to explore
        </span>

        <strong class="scroll-intro-cue__title">
          Thai Dried Fruit
        </strong>

        <span class="scroll-intro-cue__meta">
          OEM
          <span aria-hidden="true">·</span>
          Private Label
          <span aria-hidden="true">·</span>
          Global Export
        </span>
      </span>

      <span
        class="scroll-intro-cue__motion"
        aria-hidden="true"
      >
        <span class="scroll-intro-cue__mouse">
          <span class="scroll-intro-cue__wheel"></span>
        </span>

        <span class="scroll-intro-cue__arrows">
          <span></span>
          <span></span>
        </span>
      </span>
    </button>
  `;

  state.stickyFrame.appendChild(cue);

  state.cue = cue;

  state.button =
    cue.querySelector(
      ".scroll-intro-cue__button"
    );

  state.button?.addEventListener(
    "click",
    scrollToExperience
  );
};

/* ======================================================
   CLICK TO SCROLL
   ====================================================== */

const scrollToExperience = () => {
  if (!state.stage) {
    return;
  }

  const stageRect =
    state.stage.getBoundingClientRect();

  const stageTop =
    window.scrollY +
    stageRect.top;

  const scrollable =
    Math.max(
      state.stage.offsetHeight -
        window.innerHeight,
      0
    );

  const targetScroll =
    stageTop +
    scrollable *
      CLICK_TARGET_PROGRESS;

  window.scrollTo({
    top: targetScroll,

    behavior: prefersReducedMotion()
      ? "auto"
      : "smooth",
  });
};

/* ======================================================
   UPDATE CUE
   ====================================================== */

const updateScrollCue = () => {
  state.animationFrame = null;

  if (!state.cue) {
    return;
  }

  const progress =
    getScrollProgress();

  /*
   * Fade out ตาม Scroll
   */
  const cueExit =
    smoothstep(
      CUE_HIDE_START_PROGRESS,
      CUE_HIDE_END_PROGRESS,
      progress
    );

  const opacity =
    1 -
    cueExit;

  /*
   * ค่อย ๆ เลื่อนลงและย่อเล็กน้อยตอนหาย
   */
  const translateY =
    cueExit *
    18;

  const scale =
    1 -
    cueExit *
    0.035;

  const blur =
    cueExit *
    5;

  const isVisible =
    opacity >
    0.01;

  state.cue.style.setProperty(
    "--scroll-cue-opacity",
    opacity.toFixed(3)
  );

  state.cue.style.setProperty(
    "--scroll-cue-y",
    `${translateY.toFixed(2)}px`
  );

  state.cue.style.setProperty(
    "--scroll-cue-scale",
    scale.toFixed(4)
  );

  state.cue.style.setProperty(
    "--scroll-cue-blur",
    `${blur.toFixed(2)}px`
  );

  state.cue.style.setProperty(
    "--scroll-cue-progress",
    progress.toFixed(4)
  );

  state.cue.style.visibility =
    isVisible
      ? "visible"
      : "hidden";

  state.cue.setAttribute(
    "aria-hidden",
    isVisible
      ? "false"
      : "true"
  );

  /*
   * ตอนซ่อนแล้วไม่ให้ Tab มาเจอปุ่ม
   */
  if (state.button) {
    state.button.tabIndex =
      isVisible
        ? 0
        : -1;

    state.button.disabled =
      !isVisible;
  }
};

/* ======================================================
   RENDER QUEUE
   ====================================================== */

const scheduleUpdate = () => {
  if (state.animationFrame) {
    return;
  }

  state.animationFrame =
    requestAnimationFrame(
      updateScrollCue
    );
};

/* ======================================================
   INITIALIZE
   ====================================================== */

const initializeScrollCue = () => {
  if (state.initialized) {
    return;
  }

  state.stage =
    document.querySelector(
      ".scrub-stage"
    );

  state.stickyFrame =
    document.querySelector(
      ".sticky-frame"
    );

  if (
    !state.stage ||
    !state.stickyFrame
  ) {
    console.warn(
      "[CHUA] Scroll intro cue could not find .scrub-stage or .sticky-frame"
    );

    return;
  }

  state.initialized = true;

  createScrollCue();
  measureStage();
  updateScrollCue();

  window.addEventListener(
    "scroll",
    scheduleUpdate,
    {
      passive: true,
    }
  );

  window.addEventListener(
    "resize",
    () => {
      measureStage();
      scheduleUpdate();
    }
  );

  window.addEventListener(
    "pageshow",
    scheduleUpdate
  );

  document.documentElement.dataset.scrollCue =
    "ready";

  console.info(
    "[CHUA] Scroll intro cue loaded"
  );
};

/* ======================================================
   START
   ====================================================== */

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeScrollCue,
    {
      once: true,
    }
  );
} else {
  initializeScrollCue();
}
