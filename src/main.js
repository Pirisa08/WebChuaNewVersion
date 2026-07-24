import "./styles/index.css";
import "./styles/fruitHotspots.css";

import logoUrl from "./assets/Logo Chua.png";

import { clamp } from "./utils/animation.js";
import { VIDEO_SCROLL_KEYFRAMES } from "./config/timing.js";

import { updateAmbientBackground } from "./effects/ambientBackground.js";
import { updateIntroLogo } from "./effects/introLogo.js";
import { updateAboutText } from "./effects/aboutText.js";
import { updateFruitHotspots } from "./effects/fruitHotspots.js";
import { updateLineupHeader } from "./effects/lineupHeader.js";
import { updateBrandShowcase } from "./effects/brandShowcase.js";
import { updateBrandNameCue } from "./effects/brandNameCue.js";
import { updateProductBrandLabels } from "./effects/productBrandLabels.js";
import { updateCertificateCue } from "./effects/certificate.js";
import { updateOemContactCue } from "./effects/oemContactCue.js";
import { updateContactCue } from "./effects/contactCue.js";

// ======================================================
// MAIN ELEMENTS
// ======================================================

const stage = document.querySelector(".scrub-stage");
const stickyFrame = document.querySelector(".sticky-frame");
const video = document.querySelector(".hero-video");

const progressBar = document.querySelector("#progressBar");
const scrollPercent = document.querySelector("#scrollPercent");

// ======================================================
// OVERLAY ELEMENTS
// ======================================================

const introLogo = document.querySelector("#introLogo");
const introLogoGroup = document.querySelector("#introLogoGroup");
const introAboutText = document.querySelector("#introAboutText");

const fruitHotspots = document.querySelector("#fruitHotspots");

const lineupHeader = document.querySelector("#lineupHeader");
const brandShowcase = document.querySelector("#brandShowcase");
const brandNameCue = document.querySelector("#brandNameCue");
const productBrandLabels = document.querySelector("#productBrandLabels");

const certificateCue = document.querySelector("#certificateCue");
const oemContactCue = document.querySelector("#oemContactCue");
const contactCue = document.querySelector("#contactCue");

// ======================================================
// VIDEO
// ======================================================

const videoUrl =
  `${import.meta.env.BASE_URL}web 16_9.mp4`;

const initialVideoFrame = 0.04;

// ======================================================
// SCROLL / VIDEO STATE
// ======================================================

let duration = 1;

let targetTime = 0;
let displayedTime = 0;

let hasMetadata = false;
let scrollProgress = 0;
let renderQueued = false;

// ======================================================
// FRUIT DETAIL FREEZE STATE
// ======================================================

let isFruitDetailOpen = false;

let frozenFruitVideoTime = 0;
let frozenFruitScrollProgress = 0;

// ======================================================
// VIDEO SETUP
// ======================================================

if (video) {
  video.src = videoUrl;
  video.muted = true;
  video.playsInline = true;
  video.defaultMuted = true;
  video.preload = "auto";

  video.load();
}

// ======================================================
// UPDATE OVERLAYS
// ======================================================

const updateOverlayState = () => {
  // Background Motion Layer
  updateAmbientBackground({
    element: stickyFrame,
    progress: scrollProgress,
  });

  // Intro logo
  updateIntroLogo({
    element: introLogoGroup,
    progress: scrollProgress,
  });

  // Striving / Curated
  updateAboutText({
    element: introAboutText,
    time: displayedTime,
    progress: scrollProgress,
  });

  // Fruit hotspots ช่วงประมาณ 43%
  updateFruitHotspots({
    element: fruitHotspots,
    progress: scrollProgress,
  });

  // Our House Brands
  updateLineupHeader({
    element: lineupHeader,
    time: displayedTime,
    progress: scrollProgress,
  });

  // Product brand labels
  updateProductBrandLabels({
    element: productBrandLabels,
    progress: scrollProgress,
  });

  // Brand name cue เดิม
  updateBrandNameCue({
    element: brandNameCue,
    progress: scrollProgress,
  });

  // Brand detail card
  updateBrandShowcase({
    element: brandShowcase,
    time: displayedTime,
    progress: scrollProgress,
  });

  // Certificate
  updateCertificateCue({
    element: certificateCue,
    progress: scrollProgress,
  });

  // OEM
  updateOemContactCue({
    element: oemContactCue,
    progress: scrollProgress,
  });

  // Contact
  updateContactCue({
    element: contactCue,
    progress: scrollProgress,
  });
};

// ======================================================
// RENDER QUEUE
// ======================================================

const scheduleRender = () => {
  if (renderQueued) return;

  renderQueued = true;

  requestAnimationFrame(render);
};

// ======================================================
// LOGO SOURCE
// ======================================================

if (introLogo) {
  introLogo.src = logoUrl;
}

// ======================================================
// SCROLL RESTORATION
// ======================================================

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// ======================================================
// GET SCROLL PROGRESS
// ======================================================

const getScrollProgress = () => {
  if (!stage) return 0;

  const rect = stage.getBoundingClientRect();

  const scrollable =
    rect.height - window.innerHeight;

  if (scrollable <= 0) {
    return 0;
  }

  return clamp(
    -rect.top / scrollable,
    0,
    1
  );
};

// ======================================================
// PERCENT DISPLAY
// ======================================================

const updatePercent = (progress) => {
  const percent =
    Math.round(progress * 100);

  if (scrollPercent) {
    scrollPercent.textContent =
      `${percent}%`;
  }
};

// ======================================================
// SCROLL PROGRESS → VIDEO PROGRESS
// ======================================================

const getVideoProgress = (progress) => {
  const normalizedProgress =
    clamp(progress, 0, 1);

  for (
    let index = 1;
    index < VIDEO_SCROLL_KEYFRAMES.length;
    index += 1
  ) {
    const [
      previousScroll,
      previousVideo,
    ] =
      VIDEO_SCROLL_KEYFRAMES[
        index - 1
      ];

    const [
      nextScroll,
      nextVideo,
    ] =
      VIDEO_SCROLL_KEYFRAMES[
        index
      ];

    if (
      normalizedProgress <= nextScroll
    ) {
      const segmentLength =
        nextScroll - previousScroll;

      const localProgress =
        segmentLength > 0
          ? (
              normalizedProgress -
              previousScroll
            ) /
            segmentLength
          : 0;

      return (
        previousVideo +
        (
          nextVideo -
          previousVideo
        ) *
          localProgress
      );
    }
  }

  return VIDEO_SCROLL_KEYFRAMES.at(-1)[1];
};

// ======================================================
// FRUIT DETAIL EVENTS
// ======================================================

window.addEventListener(
  "fruit-detail:open",
  () => {
    if (isFruitDetailOpen) return;

    isFruitDetailOpen = true;

    // เก็บเฟรมที่กำลังแสดงจริง
    frozenFruitVideoTime =
      displayedTime;

    // เก็บเปอร์เซ็นต์ก่อนเปิด Modal
    frozenFruitScrollProgress =
      scrollProgress;

    targetTime =
      frozenFruitVideoTime;

    displayedTime =
      frozenFruitVideoTime;

    if (
      video &&
      hasMetadata
    ) {
      video.pause();

      video.currentTime =
        frozenFruitVideoTime;
    }
  }
);

window.addEventListener(
  "fruit-detail:close",
  () => {
    isFruitDetailOpen = false;

    // คืน Scroll Progress เดิม
    scrollProgress =
      frozenFruitScrollProgress;

    /*
     * displayedTime เริ่มต่อจากเฟรมที่หยุดไว้
     * ส่วน targetTime ใช้ตำแหน่ง Scroll จริง
     * เพื่อให้วิดีโอค่อย ๆ กลับเข้าสู่ Timeline
     */
    displayedTime =
      frozenFruitVideoTime;

    targetTime =
      getVideoProgress(
        frozenFruitScrollProgress
      ) * duration;

    if (
      video &&
      hasMetadata
    ) {
      video.currentTime =
        frozenFruitVideoTime;
    }

    if (progressBar) {
      progressBar.style.transform =
        `scaleX(${scrollProgress})`;
    }

    updatePercent(scrollProgress);
    updateOverlayState();
    scheduleRender();
  }
);

// ======================================================
// UPDATE TARGET
// ======================================================

const updateTarget = () => {
  /*
   * Modal เปิดอยู่:
   * ไม่อ่านค่า Scroll ใหม่
   * ไม่อัปเดตเฟรมวิดีโอ
   */
  if (isFruitDetailOpen) {
    targetTime =
      frozenFruitVideoTime;

    displayedTime =
      frozenFruitVideoTime;

    if (
      video &&
      hasMetadata &&
      Math.abs(
        video.currentTime -
        frozenFruitVideoTime
      ) > 0.01
    ) {
      video.currentTime =
        frozenFruitVideoTime;
    }

    return;
  }

  scrollProgress =
    getScrollProgress();

  targetTime =
    getVideoProgress(
      scrollProgress
    ) * duration;

  if (progressBar) {
    progressBar.style.transform =
      `scaleX(${scrollProgress})`;
  }

  updatePercent(scrollProgress);
  updateOverlayState();
  scheduleRender();
};

// ======================================================
// DEBUG LABEL
// ======================================================

console.info(
  "[CHUA] 16:9 timeline + fruit hotspots + modal freeze loaded"
);

document.documentElement.dataset.chuaPatch =
  "new-video-fruit-hotspots-modal-freeze";

// ======================================================
// VIDEO RENDER
// ======================================================

const render = () => {
  renderQueued = false;

  /*
   * Modal เปิด:
   * ค้างวิดีโอไว้ที่เฟรมเดิมตลอด
   */
  if (isFruitDetailOpen) {
    displayedTime =
      frozenFruitVideoTime;

    targetTime =
      frozenFruitVideoTime;

    if (
      video &&
      hasMetadata &&
      Math.abs(
        video.currentTime -
        frozenFruitVideoTime
      ) > 0.01
    ) {
      video.currentTime =
        frozenFruitVideoTime;
    }

    return;
  }

  /*
   * ทำให้วิดีโอค่อย ๆ วิ่งตาม Scroll
   * ลด 0.1 ลง = นุ่มและช้าขึ้น
   * เพิ่ม 0.1 ขึ้น = ตอบสนองไวขึ้น
   */
  displayedTime +=
    (
      targetTime -
      displayedTime
    ) * 0.1;

  if (
    video &&
    hasMetadata &&
    Number.isFinite(displayedTime) &&
    Math.abs(
      video.currentTime -
      displayedTime
    ) > 0.025
  ) {
    video.currentTime =
      displayedTime;
  }

  if (
    Math.abs(
      targetTime -
      displayedTime
    ) > 0.025
  ) {
    scheduleRender();
  }
};

// ======================================================
// RESET
// ======================================================

const resetToTop = () => {
  window.scrollTo(0, 0);

  targetTime = 0;
  displayedTime = 0;
  scrollProgress = 0;

  isFruitDetailOpen = false;
  frozenFruitVideoTime = 0;
  frozenFruitScrollProgress = 0;

  document.documentElement.classList.remove(
    "is-fruit-modal-open"
  );

  if (
    video &&
    hasMetadata
  ) {
    video.currentTime =
      initialVideoFrame;
  }

  updateTarget();
};

// ======================================================
// VIDEO EVENTS
// ======================================================

if (video) {
  video.addEventListener(
    "loadedmetadata",
    () => {
      duration =
        video.duration || 1;

      hasMetadata = true;

      if (
        video.duration >
        initialVideoFrame
      ) {
        video.currentTime =
          initialVideoFrame;
      }

      resetToTop();
    }
  );

  video.addEventListener(
    "canplay",
    () => {
      video.pause();
    }
  );
}

// ======================================================
// WINDOW EVENTS
// ======================================================

window.addEventListener(
  "scroll",
  updateTarget,
  {
    passive: true,
  }
);

window.addEventListener(
  "resize",
  () => {
    updateTarget();
  }
);

window.addEventListener(
  "pageshow",
  () => {
    requestAnimationFrame(
      resetToTop
    );
  }
);

// ======================================================
// INITIAL LOAD
// ======================================================

updateTarget();

requestAnimationFrame(() => {
  document.documentElement.classList.add(
    "is-ready"
  );

  scheduleRender();
});