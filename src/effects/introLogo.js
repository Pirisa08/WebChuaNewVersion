import {
  clamp,
  smoothstep,
} from "../utils/animation.js";

import {
  LOGO_APPEAR_START_PROGRESS,
  LOGO_VISIBLE_PROGRESS,
  LOGO_GROW_START_PROGRESS,
  LOGO_GROW_END_PROGRESS,
  LOGO_HOLD_MOTION_START_PROGRESS,
  LOGO_HOLD_MOTION_END_PROGRESS,
  TAGLINE_IN_START_PROGRESS,
  TAGLINE_IN_END_PROGRESS,
  SUBTAGLINE_IN_START_PROGRESS,
  SUBTAGLINE_IN_END_PROGRESS,
  ORBIT_IN_START_PROGRESS,
  ORBIT_IN_END_PROGRESS,
  ORBIT_OUT_START_PROGRESS,
  ORBIT_OUT_END_PROGRESS,
  LOGO_SPIN_EXIT_START_PROGRESS,
  LOGO_SPIN_EXIT_END_PROGRESS,
} from "../config/timing.js";

/* ======================================================
   INTRO MOTION SETTINGS
   ====================================================== */

/*
 * ทิศทางการหมุนให้สัมพันธ์กับวิดีโอ
 *
 * -1 = หมุนสวนเข็มนาฬิกา
 *  1 = หมุนตามเข็มนาฬิกา
 *
 * ถ้าทิศทางยังสวนกับวิดีโอ ให้เปลี่ยนเป็น 1
 */
const VIDEO_ROTATION_DIRECTION = -1;

/*
 * ขนาด Container หลัก
 */
const GROUP_GROW_SCALE = 0.2;

/*
 * ขยายเฉพาะโลโก้ CHUA
 */
const LOGO_BASE_SCALE = 1.18;
const LOGO_GROW_SCALE = 0.08;
const LOGO_HERO_SCALE = 0.025;
const LOGO_EXIT_SHRINK = 0.16;

/*
 * องศาที่โลโก้เอียงตอนออก
 * ไม่หมุนเต็มวง เพื่อให้อ่านโลโก้ได้ตลอด
 */
const LOGO_EXIT_TILT =
  8 * VIDEO_ROTATION_DIRECTION;

/*
 * องศาการหมุน Orbit
 */
const ORBIT_NORMAL_ROTATION =
  72 * VIDEO_ROTATION_DIRECTION;

const ORBIT_EXIT_ROTATION =
  260 * VIDEO_ROTATION_DIRECTION;

/*
 * องศาการหมุนวงแหวนด้านหลัง
 */
const RING_NORMAL_ROTATION =
  18 * VIDEO_ROTATION_DIRECTION;

const RING_EXIT_ROTATION =
  95 * VIDEO_ROTATION_DIRECTION;

/*
 * ข้อมูลการเคลื่อนของ Fruit chip แต่ละชิ้น
 *
 * depth:
 * 1 = อยู่ด้านหน้า ชัดและใหญ่กว่า
 * 0 = อยู่ด้านหลัง เล็กและเบลอกว่า
 */
const CHIP_MOTION = [
  {
    phase: 0.2,
    depth: 1,
    floatX: 4,
    floatY: 8,
    baseRotation: -18,
    exitX: -115,
    exitY: -60,
    exitRotation: -55,
  },
  {
    phase: 1.1,
    depth: 0.72,
    floatX: 7,
    floatY: 5,
    baseRotation: 10,
    exitX: 115,
    exitY: -48,
    exitRotation: 75,
  },
  {
    phase: 2.2,
    depth: 0.88,
    floatX: 5,
    floatY: 9,
    baseRotation: 12,
    exitX: -96,
    exitY: 82,
    exitRotation: -70,
  },
  {
    phase: 3.15,
    depth: 1,
    floatX: 8,
    floatY: 6,
    baseRotation: 18,
    exitX: 120,
    exitY: 76,
    exitRotation: 85,
  },
  {
    phase: 4.1,
    depth: 0.62,
    floatX: 5,
    floatY: 7,
    baseRotation: -6,
    exitX: 12,
    exitY: -125,
    exitRotation: 110,
  },
  {
    phase: 5.2,
    depth: 0.8,
    floatX: 7,
    floatY: 5,
    baseRotation: -10,
    exitX: 16,
    exitY: 125,
    exitRotation: -95,
  },
];

const refsCache = new WeakMap();

/* ======================================================
   SMALL HELPERS
   ====================================================== */

const easeOutCubic = (value) => {
  const normalized = clamp(value, 0, 1);

  return (
    1 -
    Math.pow(
      1 - normalized,
      3
    )
  );
};

const createWindow = (
  progress,
  inStart,
  inEnd,
  outStart,
  outEnd
) =>
  smoothstep(
    inStart,
    inEnd,
    progress
  ) *
  (
    1 -
    smoothstep(
      outStart,
      outEnd,
      progress
    )
  );

const normalizeProgress = (
  progress,
  start,
  end
) => {
  const duration =
    Math.max(
      end - start,
      0.0001
    );

  return clamp(
    (
      progress -
      start
    ) /
      duration,
    0,
    1
  );
};

/* ======================================================
   REMOVE OLD INTRO TEXT
   ====================================================== */

const removeIntroText = (element) => {
  if (!element) return;

  element
    .querySelectorAll(
      [
        ".reintro",
        ".re-intro",
        "[data-reintro]",
      ].join(",")
    )
    .forEach((textElement) => {
      textElement.remove();
    });

  const walker =
    document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT
    );

  const textNodesToRemove = [];

  while (walker.nextNode()) {
    const textNode =
      walker.currentNode;

    const text =
      textNode.textContent
        ?.trim()
        .toLowerCase();

    if (
      text === "reintro" ||
      text === "re-intro"
    ) {
      textNodesToRemove.push(
        textNode
      );
    }
  }

  textNodesToRemove.forEach(
    (textNode) => {
      textNode.remove();
    }
  );
};

/* ======================================================
   CREATE EXTRA EFFECT ELEMENTS
   ====================================================== */

const ensureIntroLogoEffects = (
  element
) => {
  if (!element) return;

  if (
    element.dataset.introLogoEnhanced ===
    "true"
  ) {
    return;
  }

  removeIntroText(element);

  const logoCard =
    element.querySelector(
      ".intro-logo-card"
    );

  const tagline =
    element.querySelector(
      ".intro-tagline"
    );

  /*
   * เพิ่ม Subtagline
   */
  if (
    tagline &&
    !element.querySelector(
      ".intro-subtagline"
    )
  ) {
    const subtagline =
      document.createElement("p");

    subtagline.className =
      "intro-subtagline";

    subtagline.textContent =
      "From Thai Fruits to Global Markets";

    tagline.insertAdjacentElement(
      "afterend",
      subtagline
    );
  }

  /*
   * เพิ่มวงแหวนหายใจ
   */
  if (
    logoCard &&
    !element.querySelector(
      ".intro-breath-rings"
    )
  ) {
    const ringWrap =
      document.createElement("div");

    ringWrap.className =
      "intro-breath-rings";

    ringWrap.setAttribute(
      "aria-hidden",
      "true"
    );

    ringWrap.innerHTML = `
      <span
        class="
          intro-breath-ring
          intro-breath-ring-1
        "
      ></span>

      <span
        class="
          intro-breath-ring
          intro-breath-ring-2
        "
      ></span>
    `;

    element.insertBefore(
      ringWrap,
      logoCard
    );
  }

  /*
   * เพิ่ม Orbit และ Fruit chips
   */
  if (
    logoCard &&
    !element.querySelector(
      ".intro-orbit"
    )
  ) {
    const orbit =
      document.createElement("div");

    orbit.className =
      "intro-orbit";

    orbit.setAttribute(
      "aria-hidden",
      "true"
    );

    orbit.innerHTML = `
      <span
        class="
          intro-orbit-line
          intro-orbit-line-1
        "
      ></span>

      <span
        class="
          intro-orbit-line
          intro-orbit-line-2
        "
      ></span>

      <span
        class="
          intro-fruit-chip
          intro-fruit-chip-1
        "
      ></span>

      <span
        class="
          intro-fruit-chip
          intro-fruit-chip-2
        "
      ></span>

      <span
        class="
          intro-fruit-chip
          intro-fruit-chip-3
        "
      ></span>

      <span
        class="
          intro-fruit-chip
          intro-fruit-chip-4
        "
      ></span>

      <span
        class="
          intro-fruit-chip
          intro-fruit-chip-5
        "
      ></span>

      <span
        class="
          intro-fruit-chip
          intro-fruit-chip-6
        "
      ></span>
    `;

    element.insertBefore(
      orbit,
      logoCard
    );
  }

  /*
   * วงกระแทกตอนผลไม้กระจายออก
   */
  if (
    logoCard &&
    !element.querySelector(
      ".intro-impact-ring"
    )
  ) {
    const impactRing =
      document.createElement("span");

    impactRing.className =
      "intro-impact-ring";

    impactRing.setAttribute(
      "aria-hidden",
      "true"
    );

    element.insertBefore(
      impactRing,
      logoCard
    );
  }

  element.dataset.introLogoEnhanced =
    "true";
};

/* ======================================================
   GET ELEMENT REFERENCES
   ====================================================== */

const getRefs = (element) => {
  const cached =
    refsCache.get(element);

  if (cached) {
    return cached;
  }

  const refs = {
    logoCard:
      element.querySelector(
        ".intro-logo-card"
      ),

    logo:
      element.querySelector(
        ".intro-logo"
      ),

    tagline:
      element.querySelector(
        ".intro-tagline"
      ),

    subtagline:
      element.querySelector(
        ".intro-subtagline"
      ),

    orbit:
      element.querySelector(
        ".intro-orbit"
      ),

    orbitLines:
      Array.from(
        element.querySelectorAll(
          ".intro-orbit-line"
        )
      ),

    chips:
      Array.from(
        element.querySelectorAll(
          ".intro-fruit-chip"
        )
      ),

    rings:
      element.querySelector(
        ".intro-breath-rings"
      ),

    impactRing:
      element.querySelector(
        ".intro-impact-ring"
      ),

    sparks:
      Array.from(
        element.querySelectorAll(
          ".intro-spark"
        )
      ),
  };

  refsCache.set(
    element,
    refs
  );

  return refs;
};

/* ======================================================
   UPDATE INTRO LOGO
   ====================================================== */

export const updateIntroLogo = ({
  element,
  progress = 0,
}) => {
  if (!element) return;

  ensureIntroLogoEffects(element);

  const refs =
    getRefs(element);

  /* ------------------------------------------------------
     BASE TIMING
     ------------------------------------------------------ */

  const fadeIn = smoothstep(
    LOGO_APPEAR_START_PROGRESS,
    LOGO_VISIBLE_PROGRESS,
    progress
  );

  const grow = smoothstep(
    LOGO_GROW_START_PROGRESS,
    LOGO_GROW_END_PROGRESS,
    progress
  );

  const holdMotion = smoothstep(
    LOGO_HOLD_MOTION_START_PROGRESS,
    LOGO_HOLD_MOTION_END_PROGRESS,
    progress
  );

  const holdLocal =
    normalizeProgress(
      progress,
      LOGO_HOLD_MOTION_START_PROGRESS,
      LOGO_HOLD_MOTION_END_PROGRESS
    );

  const orbitIn = smoothstep(
    ORBIT_IN_START_PROGRESS,
    ORBIT_IN_END_PROGRESS,
    progress
  );

  const orbitOut = smoothstep(
    ORBIT_OUT_START_PROGRESS,
    ORBIT_OUT_END_PROGRESS,
    progress
  );

  const orbitVisibility =
    orbitIn *
    (1 - orbitOut);

  const spinExit = smoothstep(
    LOGO_SPIN_EXIT_START_PROGRESS,
    LOGO_SPIN_EXIT_END_PROGRESS,
    progress
  );

  const exitEase =
    easeOutCubic(spinExit);

  /* ------------------------------------------------------
     HERO HOLD
     ------------------------------------------------------ */

  const heroWindow =
    createWindow(
      progress,
      0.12,
      0.145,
      0.19,
      0.205
    );

  const breathWave =
    Math.sin(
      holdLocal *
      Math.PI *
      2.15
    ) *
    heroWindow;

  /* ------------------------------------------------------
     MAGNET PULL
     ผลไม้ถูกดูดเข้าศูนย์กลาง
     ------------------------------------------------------ */

  const magnetPull =
    createWindow(
      progress,
      0.082,
      0.1,
      0.112,
      0.13
    );

  /*
   * จังหวะที่ผลไม้ถูกปล่อยกลับออก
   */
  const magnetRelease =
    createWindow(
      progress,
      0.108,
      0.127,
      0.145,
      0.165
    );

  const releaseTravel =
    smoothstep(
      0.108,
      0.16,
      progress
    );

  /* ------------------------------------------------------
     TEXT TIMING
     ------------------------------------------------------ */

  const taglineIn = smoothstep(
    TAGLINE_IN_START_PROGRESS,
    TAGLINE_IN_END_PROGRESS,
    progress
  );

  const subtaglineIn = smoothstep(
    SUBTAGLINE_IN_START_PROGRESS,
    SUBTAGLINE_IN_END_PROGRESS,
    progress
  );

  /*
   * ให้ข้อความหายก่อนโลโก้เล็กน้อย
   */
  const textExit = smoothstep(
    LOGO_SPIN_EXIT_START_PROGRESS -
      0.018,
    LOGO_SPIN_EXIT_START_PROGRESS +
      0.01,
    progress
  );

  /* ------------------------------------------------------
     LIGHT SWEEP
     วิ่งผ่านโลโก้เพียงครั้งเดียว
     ------------------------------------------------------ */

  const sweepTravel =
    smoothstep(
      0.125,
      0.174,
      progress
    );

  const sweepVisibility =
    createWindow(
      progress,
      0.121,
      0.137,
      0.163,
      0.18
    ) *
    (1 - spinExit);

  const sweepX =
    -160 +
    sweepTravel * 320;

  /* ------------------------------------------------------
     GROUP OPACITY
     ------------------------------------------------------ */

  const opacity =
    fadeIn *
    (1 - spinExit);

  /* ------------------------------------------------------
     GROUP SCALE
     ------------------------------------------------------ */

  const introScale =
    0.58 +
    fadeIn * 0.28;

  const growScale =
    grow *
    GROUP_GROW_SCALE;

  const breathScale =
    breathWave *
    0.014;

  const magnetScale =
    magnetPull * 0.018 +
    magnetRelease * 0.014;

  const exitScale =
    spinExit * 0.24;

  const groupScale =
    introScale +
    growScale +
    breathScale +
    magnetScale -
    exitScale;

  /* ------------------------------------------------------
     GROUP POSITION
     ------------------------------------------------------ */

  const translateX =
    spinExit * 8;

  const translateY =
    (1 - fadeIn) * 26 -
    holdMotion * 4 -
    spinExit * 28;

  element.style.left =
    "50%";

  element.style.top =
    "50%";

  element.style.opacity =
    opacity.toFixed(3);

  element.style.visibility =
    opacity > 0.01
      ? "visible"
      : "hidden";

  /*
   * ไม่หมุน Group หลัก
   * ทำให้ข้อความและโลโก้ยังอ่านตรง
   */
  element.style.transform = `
    translate3d(
      calc(
        -50% +
        ${translateX.toFixed(2)}px
      ),
      calc(
        -50% +
        ${translateY.toFixed(2)}px
      ),
      0
    )
    scale(${groupScale.toFixed(4)})
  `;

  element.style.background =
    "transparent";

  element.style.border =
    "none";

  element.style.boxShadow =
    "none";

  element.style.filter =
    "none";

  element.style.webkitFilter =
    "none";

  /* ------------------------------------------------------
     CSS VARIABLES
     ------------------------------------------------------ */

  element.style.setProperty(
    "--intro-fade",
    fadeIn.toFixed(3)
  );

  element.style.setProperty(
    "--intro-grow",
    grow.toFixed(3)
  );

  element.style.setProperty(
    "--intro-hold",
    holdMotion.toFixed(3)
  );

  element.style.setProperty(
    "--intro-breath",
    breathWave.toFixed(3)
  );

  element.style.setProperty(
    "--intro-orbit",
    orbitVisibility.toFixed(3)
  );

  element.style.setProperty(
    "--intro-exit",
    spinExit.toFixed(3)
  );

  element.style.setProperty(
    "--intro-opacity",
    opacity.toFixed(3)
  );

  element.style.setProperty(
    "--intro-sweep-x",
    `${sweepX.toFixed(2)}%`
  );

  element.style.setProperty(
    "--intro-sweep-opacity",
    sweepVisibility.toFixed(3)
  );

  element.style.setProperty(
    "--intro-glow-opacity",
    (
      (
        0.26 +
        grow * 0.16 +
        heroWindow * 0.1 +
        magnetRelease * 0.38
      ) *
      (1 - spinExit)
    ).toFixed(3)
  );

  element.style.setProperty(
    "--intro-ring-opacity",
    (
      (
        0.16 +
        heroWindow * 0.28 +
        magnetRelease * 0.3
      ) *
      (1 - spinExit)
    ).toFixed(3)
  );

  element.style.setProperty(
    "--intro-spark-opacity",
    (
      (
        0.16 +
        orbitVisibility * 0.46 +
        magnetRelease * 0.24
      ) *
      (1 - spinExit)
    ).toFixed(3)
  );

  /* ------------------------------------------------------
     LOGO CARD
     ------------------------------------------------------ */

  if (refs.logoCard) {
    refs.logoCard.style.background =
      "transparent";

    refs.logoCard.style.border =
      "none";

    refs.logoCard.style.boxShadow =
      "none";

    refs.logoCard.style.filter =
      "none";

    refs.logoCard.style.webkitFilter =
      "none";

    /*
     * ให้โลโก้ที่ขยายแล้วไม่โดนตัด
     */
    refs.logoCard.style.overflow =
      "visible";
  }

  /* ------------------------------------------------------
     LOGO VISUAL
     ------------------------------------------------------ */

  if (refs.logo) {
    const logoScale =
      LOGO_BASE_SCALE +
      grow * LOGO_GROW_SCALE +
      heroWindow *
        LOGO_HERO_SCALE +
      breathWave * 0.01 +
      magnetPull * 0.025 +
      magnetRelease * 0.018 -
      spinExit *
        LOGO_EXIT_SHRINK;

    const logoTilt =
      spinExit *
      LOGO_EXIT_TILT;

    const logoLift =
      magnetPull * -2 +
      spinExit * -4;

    refs.logo.style.transform = `
      translate3d(
        0,
        ${logoLift.toFixed(2)}px,
        0
      )
      rotate(${logoTilt.toFixed(2)}deg)
      scale(${logoScale.toFixed(4)})
    `;

    refs.logo.style.transformOrigin =
      "center center";

    refs.logo.style.background =
      "transparent";

    refs.logo.style.border =
      "none";

    refs.logo.style.borderRadius =
      "0";

    refs.logo.style.boxShadow =
      "none";

    refs.logo.style.filter = `
      saturate(0.99)
      sepia(0.04)
      drop-shadow(
        0 18px 30px
        rgba(33, 28, 20, 0.17)
      )
      drop-shadow(
        0 0 26px
        rgba(232, 149, 47, 0.26)
      )
    `;

    refs.logo.style.webkitFilter =
      refs.logo.style.filter;

    refs.logo.style.mixBlendMode =
      "normal";

    refs.logo.style.willChange =
      "transform, opacity, filter";
  }

  /* ------------------------------------------------------
     ORBIT
     ------------------------------------------------------ */

  const orbitTravel =
    normalizeProgress(
      progress,
      ORBIT_IN_START_PROGRESS,
      LOGO_SPIN_EXIT_END_PROGRESS
    );

  const orbitRotation =
    orbitTravel *
      ORBIT_NORMAL_ROTATION +
    Math.pow(
      spinExit,
      1.35
    ) *
      ORBIT_EXIT_ROTATION;

  const orbitScale =
    0.9 +
    orbitIn * 0.1 -
    magnetPull * 0.16 +
    magnetRelease * 0.075 +
    spinExit * 0.19;

  if (refs.orbit) {
    refs.orbit.style.opacity =
      (
        orbitVisibility *
        (1 - spinExit * 0.85)
      ).toFixed(3);

    refs.orbit.style.transform = `
      translate3d(
        -50%,
        -50%,
        0
      )
      rotate(${orbitRotation.toFixed(2)}deg)
      scale(${orbitScale.toFixed(4)})
    `;

    refs.orbit.style.transformOrigin =
      "center center";

    refs.orbit.style.willChange =
      "transform, opacity";
  }

  /*
   * วงเส้นด้านในหมุนสวนกันเล็กน้อย
   * ทำให้ Orbit ดูมีมิติ
   */
  refs.orbitLines.forEach(
    (line, index) => {
      const direction =
        index % 2 === 0
          ? 1
          : -1;

      const lineRotation =
        direction *
        (
          orbitTravel * 24 +
          spinExit * 38
        );

      const lineScaleX =
        index === 0
          ? 1
          : 0.94;

      line.style.transform = `
        rotate(${lineRotation.toFixed(2)}deg)
        scaleX(${lineScaleX})
      `;

      line.style.transformOrigin =
        "center center";
    }
  );

  /* ------------------------------------------------------
     FRUIT CHIPS
     ------------------------------------------------------ */

  refs.chips.forEach(
    (chip, index) => {
      const motion =
        CHIP_MOTION[
          index %
            CHIP_MOTION.length
        ];

      const floatAngle =
        orbitTravel *
          Math.PI *
          4.2 +
        motion.phase;

      const floatX =
        Math.cos(floatAngle) *
        motion.floatX *
        orbitVisibility;

      const floatY =
        Math.sin(floatAngle) *
        motion.floatY *
        orbitVisibility;

      const flyProgress =
        Math.pow(
          exitEase,
          1.25
        );

      const exitX =
        motion.exitX *
        flyProgress;

      const exitY =
        motion.exitY *
        flyProgress;

      const chipRotation =
        motion.baseRotation +
        orbitTravel * 30 +
        motion.exitRotation *
          flyProgress;

      const depthScale =
        0.82 +
        motion.depth * 0.22;

      const chipScale =
        depthScale -
        magnetPull * 0.26 +
        magnetRelease * 0.09 +
        flyProgress * 0.08;

      const chipOpacity =
        orbitVisibility *
        (
          1 -
          smoothstep(
            0.18,
            1,
            spinExit
          )
        );

      const blurAmount =
        (
          1 -
          motion.depth
        ) *
          1.6 +
        flyProgress * 1.2;

      chip.style.opacity =
        chipOpacity.toFixed(3);

      chip.style.visibility =
        chipOpacity > 0.01
          ? "visible"
          : "hidden";

      chip.style.transform = `
        translate3d(
          ${(floatX + exitX).toFixed(2)}px,
          ${(floatY + exitY).toFixed(2)}px,
          0
        )
        rotate(${chipRotation.toFixed(2)}deg)
        scale(${chipScale.toFixed(4)})
      `;

      chip.style.filter = `
        blur(${blurAmount.toFixed(2)}px)
        saturate(${(
          0.92 +
          motion.depth * 0.15
        ).toFixed(3)})
      `;

      chip.style.willChange =
        "transform, opacity, filter";
    }
  );

  /* ------------------------------------------------------
     BREATHING RINGS
     ------------------------------------------------------ */

  if (refs.rings) {
    const ringRotation =
      orbitTravel *
        RING_NORMAL_ROTATION +
      spinExit *
        RING_EXIT_ROTATION;

    const ringScale =
      1 -
      magnetPull * 0.1 +
      magnetRelease * 0.07 +
      spinExit * 0.15;

    refs.rings.style.opacity =
      (
        (
          0.2 +
          heroWindow * 0.52 +
          magnetRelease * 0.28
        ) *
        (1 - spinExit)
      ).toFixed(3);

    refs.rings.style.transform = `
      translate3d(
        -50%,
        -50%,
        0
      )
      rotate(${ringRotation.toFixed(2)}deg)
      scale(${ringScale.toFixed(4)})
    `;

    refs.rings.style.transformOrigin =
      "center center";
  }

  /* ------------------------------------------------------
     IMPACT RING
     ------------------------------------------------------ */

  if (refs.impactRing) {
    const impactOpacity =
      magnetRelease *
      (1 - spinExit);

    const impactScale =
      0.66 +
      releaseTravel * 0.78;

    refs.impactRing.style.opacity =
      impactOpacity.toFixed(3);

    refs.impactRing.style.transform = `
      translate3d(
        -50%,
        -50%,
        0
      )
      scale(${impactScale.toFixed(4)})
    `;

    refs.impactRing.style.visibility =
      impactOpacity > 0.01
        ? "visible"
        : "hidden";
  }

  /* ------------------------------------------------------
     SPARKS
     ------------------------------------------------------ */

  refs.sparks.forEach(
    (spark, index) => {
      const phase =
        index * 1.45;

      const sparkWave =
        Math.sin(
          orbitTravel *
            Math.PI *
            5 +
          phase
        );

      const sparkX =
        Math.cos(
          phase +
          orbitTravel * 3
        ) *
          5 +
        spinExit *
          (
            index % 2 === 0
              ? -35
              : 35
          );

      const sparkY =
        sparkWave * 8 -
        spinExit *
          (
            30 +
            index * 7
          );

      const sparkScale =
        0.72 +
        (
          sparkWave + 1
        ) *
          0.12 +
        magnetRelease * 0.2;

      const sparkOpacity =
        (
          0.16 +
          orbitVisibility * 0.54 +
          magnetRelease * 0.22
        ) *
        (1 - spinExit);

      spark.style.opacity =
        sparkOpacity.toFixed(3);

      spark.style.transform = `
        translate3d(
          ${sparkX.toFixed(2)}px,
          ${sparkY.toFixed(2)}px,
          0
        )
        scale(${sparkScale.toFixed(3)})
      `;

      spark.style.willChange =
        "transform, opacity";
    }
  );

  /* ------------------------------------------------------
     TAGLINE REVEAL
     เปิดจากกึ่งกลางออกด้านข้าง
     ------------------------------------------------------ */

  if (refs.tagline) {
    const taglineOpacity =
      taglineIn *
      (1 - textExit);

    const taglineMask =
      (
        1 -
        taglineIn
      ) *
      48;

    const taglineBlur =
      (
        1 -
        taglineIn
      ) *
      5;

    const taglineY =
      (
        1 -
        taglineIn
      ) *
      10;

    const taglineLetterSpacing =
      0.16 -
      taglineIn * 0.14;

    refs.tagline.style.opacity =
      taglineOpacity.toFixed(3);

    refs.tagline.style.clipPath = `
      inset(
        0
        ${taglineMask.toFixed(2)}%
        0
        ${taglineMask.toFixed(2)}%
        round 999px
      )
    `;

    refs.tagline.style.transform = `
      translate3d(
        0,
        ${taglineY.toFixed(2)}px,
        0
      )
      scale(${(
        0.97 +
        taglineIn * 0.03
      ).toFixed(4)})
    `;

    refs.tagline.style.filter =
      `blur(${taglineBlur.toFixed(2)}px)`;

    refs.tagline.style.letterSpacing =
      `${taglineLetterSpacing.toFixed(3)}em`;

    refs.tagline.style.visibility =
      taglineOpacity > 0.01
        ? "visible"
        : "hidden";
  }

  /* ------------------------------------------------------
     SUBTAGLINE REVEAL
     ------------------------------------------------------ */

  if (refs.subtagline) {
    const subtaglineOpacity =
      subtaglineIn *
      (1 - textExit);

    const subtaglineMask =
      (
        1 -
        subtaglineIn
      ) *
      46;

    const subtaglineBlur =
      (
        1 -
        subtaglineIn
      ) *
      4;

    const subtaglineY =
      (
        1 -
        subtaglineIn
      ) *
      9;

    const subtaglineLetterSpacing =
      0.28 -
      subtaglineIn * 0.1;

    refs.subtagline.style.opacity =
      subtaglineOpacity.toFixed(3);

    refs.subtagline.style.clipPath = `
      inset(
        0
        ${subtaglineMask.toFixed(2)}%
        0
        ${subtaglineMask.toFixed(2)}%
        round 999px
      )
    `;

    refs.subtagline.style.transform = `
      translate3d(
        0,
        ${subtaglineY.toFixed(2)}px,
        0
      )
    `;

    refs.subtagline.style.filter =
      `blur(${subtaglineBlur.toFixed(2)}px)`;

    refs.subtagline.style.letterSpacing =
      `${subtaglineLetterSpacing.toFixed(3)}em`;

    refs.subtagline.style.visibility =
      subtaglineOpacity > 0.01
        ? "visible"
        : "hidden";
  }
};