import logoUrl from "../assets/chua-logo.avif";

import {
  clamp,
  smoothstep,
} from "../utils/animation.js";

/* ======================================================
   NAV TIMING

   23%:
   เริ่มค่อย ๆ ปรากฏ

   27%:
   ชัดเต็ม

   29%:
   เริ่มเอากรอบออก

   34%:
   กรอบหาย เหลือ Logo + Text
   ====================================================== */

const NAV_IN_START = 0.23;
const NAV_IN_FULL = 0.27;

/* ======================================================
   NAV TARGETS
   ตำแหน่งที่จะ Scroll ไปเมื่อกดเมนู
   ====================================================== */

const NAV_TARGETS = {
  top: 0,

  brand: 0.61,

  oem: 0.952,

  contact: 0.985,
};

/* ======================================================
   HELPERS
   ====================================================== */

const lerp = (
  start,
  end,
  amount
) =>
  start +
  (
    end -
    start
  ) *
    amount;

/* ======================================================
   ACTIVE SECTION
   ====================================================== */

const getActiveSection = (
  progress
) => {
  if (
    progress >= 0.975
  ) {
    return "contact";
  }

  if (
    progress >= 0.94
  ) {
    return "oem";
  }

  if (
    progress >= 0.505
  ) {
    return "brand";
  }

  return "";
};

/* ======================================================
   CONTENT OPACITY

   ให้ Navbar ลดความเด่นตามเนื้อหาหลัก
   แต่ยังคงอ่านชัดกว่าเดิม
   ====================================================== */

const getContentOpacity = (
  progress
) => {
  /*
   * ความชัดพื้นฐานของ Navbar
   */
  let opacity = 0.94;

  /* ------------------------------------------------------
     FRUIT HOTSPOTS
     39.5–52%
     ------------------------------------------------------ */

  const fruitIn =
    smoothstep(
      0.395,
      0.42,
      progress
    );

  const fruitOut =
    smoothstep(
      0.495,
      0.52,
      progress
    );

  const fruitWeight =
    fruitIn *
    (
      1 -
      fruitOut
    );

  opacity =
    lerp(
      opacity,
      0.68,
      fruitWeight
    );

  /* ------------------------------------------------------
     PRODUCT LABELS + BRAND DETAILS
     57.5–89.5%
     ------------------------------------------------------ */

  const brandIn =
    smoothstep(
      0.575,
      0.605,
      progress
    );

  const brandOut =
    smoothstep(
      0.87,
      0.895,
      progress
    );

  const brandWeight =
    brandIn *
    (
      1 -
      brandOut
    );

  opacity =
    lerp(
      opacity,
      0.72,
      brandWeight
    );

  /* ------------------------------------------------------
     CERTIFICATE
     88.5–94.5%
     ------------------------------------------------------ */

  const certificateIn =
    smoothstep(
      0.885,
      0.9,
      progress
    );

  const certificateOut =
    smoothstep(
      0.93,
      0.945,
      progress
    );

  const certificateWeight =
    certificateIn *
    (
      1 -
      certificateOut
    );

  opacity =
    lerp(
      opacity,
      0.66,
      certificateWeight
    );

  /* ------------------------------------------------------
     OEM + CONTACT
     ให้ Navbar กลับมาชัดเต็ม
     ------------------------------------------------------ */

  const closingIn =
    smoothstep(
      0.94,
      0.965,
      progress
    );

  opacity =
    lerp(
      opacity,
      1,
      closingIn
    );

  /*
   * ป้องกัน Navbar จางเกินไป
   */
  return clamp(
    opacity,
    0.62,
    1
  );
};

/* ======================================================
   CONTENT-HEAVY CLASS
   ====================================================== */

const isContentHeavyProgress = (
  progress
) =>
  (
    progress >= 0.395 &&
    progress <= 0.52
  ) ||
  (
    progress >= 0.575 &&
    progress <= 0.895
  ) ||
  (
    progress >= 0.885 &&
    progress <= 0.945
  );

/* ======================================================
   STAGE PROGRESS
   ====================================================== */

const getStageProgress = (
  metrics
) => {
  if (!metrics) {
    return 0;
  }

  if (
    metrics.scrollable <= 0
  ) {
    return 0;
  }

  return clamp(
    (
      window.scrollY -
      metrics.top
    ) /
      metrics.scrollable,
    0,
    1
  );
};

/* ======================================================
   SCROLL TO SECTION
   ====================================================== */

const scrollToStageProgress = (
  stage,
  progress
) => {
  if (!stage) {
    return;
  }

  const rect =
    stage.getBoundingClientRect();

  const stageTop =
    window.scrollY +
    rect.top;

  const scrollable =
    Math.max(
      stage.offsetHeight -
        window.innerHeight,
      0
    );

  const normalizedProgress =
    clamp(
      progress,
      0,
      1
    );

  const targetScrollY =
    stageTop +
    scrollable *
      normalizedProgress;

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  window.scrollTo({
    top:
      targetScrollY,

    behavior:
      prefersReducedMotion
        ? "auto"
        : "smooth",
  });
};

/* ======================================================
   INITIALIZE
   ====================================================== */

const initializeTopNav = () => {
  const stage =
    document.querySelector(
      ".scrub-stage"
    );

  const nav =
    document.querySelector(
      "#topNav"
    );

  const logo =
    document.querySelector(
      "#topNavLogo"
    );

  const brandLink =
    document.querySelector(
      ".top-nav-brand"
    );

  const navLinks =
    Array.from(
      document.querySelectorAll(
        ".top-nav-link"
      )
    );

  if (
    !stage ||
    !nav
  ) {
    return;
  }

  /* ====================================================
     LOGO
     ==================================================== */

  if (logo) {
    logo.src =
      logoUrl;
  }

  let updateFrame = 0;

  const stageMetrics = {
    top: 0,
    scrollable: 1,
  };

  const measureStage = () => {
    const rect =
      stage.getBoundingClientRect();

    stageMetrics.top =
      window.scrollY +
      rect.top;

    stageMetrics.scrollable =
      Math.max(
        stage.offsetHeight -
          window.innerHeight,
        1
      );
  };

  /* ====================================================
     UPDATE STATE
     ==================================================== */

  const updateNavState = () => {
    updateFrame = 0;

    const progress =
      getStageProgress(
        stageMetrics
      );

    /*
     * 23–27%
     * Navbar ค่อย ๆ เข้ามา
     */
    const visibility =
      smoothstep(
        NAV_IN_START,
        NAV_IN_FULL,
        progress
      );

    /*
     * 29–34%
     * กรอบ Glass ค่อย ๆ หาย
     */
    const frameAmount =
      1;

    /*
     * ความชัดของ Navbar
     * เปลี่ยนตามเนื้อหาแต่ไม่จางเกินไป
     */
    const contentOpacity =
      getContentOpacity(
        progress
      );

    const activeSection =
      getActiveSection(
        progress
      );

    const contentHeavy =
      isContentHeavyProgress(
        progress
      );

    nav.style.setProperty(
      "--nav-visibility",
      visibility.toFixed(3)
    );

    nav.style.setProperty(
      "--nav-frame",
      frameAmount.toFixed(3)
    );

    nav.style.setProperty(
      "--nav-content-opacity",
      contentOpacity.toFixed(3)
    );

    nav.classList.toggle(
      "is-visible",
      visibility > 0.01
    );

    nav.classList.toggle(
      "is-frameless",
      false
    );

    nav.classList.toggle(
      "is-content-heavy",
      contentHeavy
    );

    nav.dataset.progress =
      progress.toFixed(3);

    nav.dataset.frame =
      frameAmount.toFixed(3);

    /*
     * ป้องกันการกดตอน Navbar ยังไม่ชัด
     */
    nav.style.pointerEvents =
      visibility > 0.72
        ? "auto"
        : "none";

    /* ==================================================
       ACTIVE STATE
       ================================================== */

    navLinks.forEach(
      (link) => {
        const target =
          link.dataset.navTarget;

        const isActive =
          target ===
          activeSection;

        link.classList.toggle(
          "is-active",
          isActive
        );

        if (isActive) {
          link.setAttribute(
            "aria-current",
            "page"
          );
        } else {
          link.removeAttribute(
            "aria-current"
          );
        }
      }
    );
  };

  /* ====================================================
     RENDER SCHEDULER
     ==================================================== */

  const scheduleNavUpdate = () => {
    if (updateFrame) {
      return;
    }

    updateFrame =
      window.requestAnimationFrame(
        updateNavState
      );
  };

  /* ====================================================
     MENU CLICK
     ==================================================== */

  navLinks.forEach(
    (link) => {
      link.addEventListener(
        "click",
        (event) => {
          event.preventDefault();

          const targetName =
            link.dataset.navTarget;

          const targetProgress =
            NAV_TARGETS[
              targetName
            ];

          if (
            typeof targetProgress !==
            "number"
          ) {
            return;
          }

          scrollToStageProgress(
            stage,
            targetProgress
          );
        }
      );
    }
  );

  /* ====================================================
     LOGO CLICK
     กลับไปหน้า Intro
     ==================================================== */

  if (brandLink) {
    brandLink.addEventListener(
      "click",
      (event) => {
        event.preventDefault();

        scrollToStageProgress(
          stage,
          NAV_TARGETS.top
        );
      }
    );
  }

  /* ====================================================
     EVENTS
     ==================================================== */

  window.addEventListener(
    "scroll",
    scheduleNavUpdate,
    {
      passive: true,
    }
  );

  window.addEventListener(
    "resize",
    () => {
      measureStage();
      scheduleNavUpdate();
    }
  );

  window.addEventListener(
    "pageshow",
    scheduleNavUpdate
  );

  window.addEventListener(
    "fruit-detail:open",
    scheduleNavUpdate
  );

  window.addEventListener(
    "fruit-detail:close",
    scheduleNavUpdate
  );

  measureStage();
  scheduleNavUpdate();
};

/* ======================================================
   SAFE START
   ====================================================== */

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeTopNav,
    {
      once: true,
    }
  );
} else {
  initializeTopNav();
}
