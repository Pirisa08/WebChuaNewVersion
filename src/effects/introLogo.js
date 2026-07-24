import { clamp, smoothstep } from "../utils/animation.js";
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

// Intro logo timing by scroll percent
// 04-08% = logo fades in
// 08-12% = logo grows into hero position
// 15-20% = logo hold + premium motion
// 20-23% = logo rotates with fruit video

const LOGO_GROW_SCALE = 0.2;

// หมุนตามเข็มนาฬิกา
// ถ้าหมุนสวนทางกับวิดีโอ ให้เปลี่ยน 360 เป็น -360
const LOGO_EXIT_ROTATION = 360;

/**
 * ลบข้อความ REINTRO เก่า แต่เก็บ tagline ใต้โลโก้ไว้
 */
const removeIntroText = (element) => {
  if (!element) return;

  // ลบ element ข้อความเก่าที่ไม่ต้องการ
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

  // ลบ text node ที่มีคำว่า REINTRO แบบตรงตัว
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT
  );

  const textNodesToRemove = [];

  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    const text = textNode.textContent?.trim().toLowerCase();

    if (text === "reintro" || text === "re-intro") {
      textNodesToRemove.push(textNode);
    }
  }

  textNodesToRemove.forEach((textNode) => {
    textNode.remove();
  });
};

/**
 * เพิ่มวงแหวนและวงโคจรรอบโลโก้
 */
const ensureIntroLogoEffects = (element) => {
  if (!element) return;

  // ลบข้อความทุกครั้ง เผื่อ React หรือส่วนอื่น render กลับมาใหม่
  removeIntroText(element);

  if (element.dataset.introLogoEnhanced === "true") return;

  element.dataset.introLogoEnhanced = "true";
  element.classList.add("intro-logo-group--enhanced");

  const logoCard = element.querySelector(".intro-logo-card");
  const tagline = element.querySelector(".intro-tagline");

  if (tagline && !element.querySelector(".intro-subtagline")) {
    const subtagline = document.createElement("p");

    subtagline.className = "intro-subtagline";
    subtagline.textContent = "From Thai Fruits to Global Markets";

    tagline.insertAdjacentElement("afterend", subtagline);
  }

  if (logoCard && !element.querySelector(".intro-breath-rings")) {
    const ringWrap = document.createElement("div");

    ringWrap.className = "intro-breath-rings";
    ringWrap.setAttribute("aria-hidden", "true");

    ringWrap.innerHTML = `
      <span class="intro-breath-ring intro-breath-ring-1"></span>
      <span class="intro-breath-ring intro-breath-ring-2"></span>
    `;

    element.insertBefore(ringWrap, logoCard);
  }

  if (logoCard && !element.querySelector(".intro-orbit")) {
    const orbit = document.createElement("div");

    orbit.className = "intro-orbit";
    orbit.setAttribute("aria-hidden", "true");

    orbit.innerHTML = `
      <span class="intro-orbit-line intro-orbit-line-1"></span>
      <span class="intro-orbit-line intro-orbit-line-2"></span>

      <span class="intro-fruit-chip intro-fruit-chip-1"></span>
      <span class="intro-fruit-chip intro-fruit-chip-2"></span>
      <span class="intro-fruit-chip intro-fruit-chip-3"></span>
      <span class="intro-fruit-chip intro-fruit-chip-4"></span>
      <span class="intro-fruit-chip intro-fruit-chip-5"></span>
      <span class="intro-fruit-chip intro-fruit-chip-6"></span>
    `;

    element.insertBefore(orbit, logoCard);
  }
};

export const updateIntroLogo = ({ element, progress = 0 }) => {
  if (!element) return;

  ensureIntroLogoEffects(element);

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

  const holdLocal = clamp(
    (progress - LOGO_HOLD_MOTION_START_PROGRESS) /
      (
        LOGO_HOLD_MOTION_END_PROGRESS -
        LOGO_HOLD_MOTION_START_PROGRESS
      ),
    0,
    1
  );

  const holdWindow =
    smoothstep(0.15, 0.162, progress) *
    (1 - smoothstep(0.192, 0.205, progress));

  const breathWave =
    Math.sin(holdLocal * Math.PI * 2.2) *
    holdWindow;

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

  const orbitProgress = orbitIn * (1 - orbitOut);

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

  const spinExit = smoothstep(
    LOGO_SPIN_EXIT_START_PROGRESS,
    LOGO_SPIN_EXIT_END_PROGRESS,
    progress
  );

  const opacity = fadeIn * (1 - spinExit);

  const introScale = 0.58 + fadeIn * 0.28;
  const growScale = grow * LOGO_GROW_SCALE;
  const breathScale = breathWave * 0.022;

  // ตอนออกให้โลโก้ค่อย ๆ เล็กลง
  const exitScale = spinExit * 0.26;

  const scale =
    introScale +
    growScale +
    breathScale -
    exitScale;

  const translateY =
    (1 - fadeIn) * 26 -
    holdMotion * 4 +
    spinExit * -24;

  const translateX = spinExit * 10;

  const rotate =
    spinExit * LOGO_EXIT_ROTATION;

  element.style.opacity = opacity.toFixed(3);

  element.style.visibility =
    opacity > 0.01 ? "visible" : "hidden";

  element.style.left = "50%";
  element.style.top = "50%";

  element.style.transform = `
    translate3d(
      calc(-50% + ${translateX.toFixed(2)}px),
      calc(-50% + ${translateY.toFixed(2)}px),
      0
    )
    scale(${scale.toFixed(3)})
    rotate(${rotate.toFixed(2)}deg)
  `;

  // ป้องกันเงาหรือกรอบจากตัว container
  element.style.background = "transparent";
  element.style.boxShadow = "none";
  element.style.border = "none";
  element.style.filter = "none";
  element.style.webkitFilter = "none";

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
    orbitProgress.toFixed(3)
  );

  element.style.setProperty(
    "--intro-exit",
    spinExit.toFixed(3)
  );

  element.style.setProperty(
    "--intro-spin",
    spinExit.toFixed(3)
  );

  element.style.setProperty(
    "--intro-opacity",
    opacity.toFixed(3)
  );

  element.style.setProperty(
    "--intro-tagline",
    taglineIn.toFixed(3)
  );

  element.style.setProperty(
    "--intro-tagline-opacity",
    (taglineIn * (1 - spinExit)).toFixed(3)
  );

  element.style.setProperty(
    "--intro-subtagline-opacity",
    (subtaglineIn * (1 - spinExit)).toFixed(3)
  );

  element.style.setProperty(
    "--intro-orbit-opacity",
    (orbitProgress * (1 - spinExit)).toFixed(3)
  );

  element.style.setProperty(
    "--intro-glow-opacity",
    (
      (0.32 + grow * 0.18 + holdWindow * 0.12) *
      (1 - spinExit)
    ).toFixed(3)
  );

  element.style.setProperty(
    "--intro-ring-opacity",
    (
      (0.18 + holdWindow * 0.36) *
      (1 - spinExit)
    ).toFixed(3)
  );

  element.style.setProperty(
    "--intro-spark-opacity",
    (
      (0.28 + orbitProgress * 0.42) *
      (1 - spinExit)
    ).toFixed(3)
  );

  const logoCard =
    element.querySelector(".intro-logo-card");

  const logo =
    element.querySelector(".intro-logo");

  if (logoCard) {
    logoCard.style.background = "transparent";
    logoCard.style.border = "none";
    logoCard.style.boxShadow = "none";
    logoCard.style.filter = "none";
    logoCard.style.webkitFilter = "none";
    logoCard.style.overflow = "hidden";
  }

  if (logo) {
    // คืนเงาอุ่นรอบโลโก้ แต่ยังไม่ใส่กรอบทึบ
    logo.style.background = "transparent";
    logo.style.border = "none";
    logo.style.borderRadius = "0";
    logo.style.boxShadow = "none";
    logo.style.filter =
      "saturate(0.98) sepia(0.06) drop-shadow(0 18px 30px rgba(33, 28, 20, 0.18)) drop-shadow(0 0 22px rgba(232, 149, 47, 0.24))";
    logo.style.webkitFilter =
      "saturate(0.98) sepia(0.06) drop-shadow(0 18px 30px rgba(33, 28, 20, 0.18)) drop-shadow(0 0 22px rgba(232, 149, 47, 0.24))";
    logo.style.mixBlendMode = "normal";
  }
};
