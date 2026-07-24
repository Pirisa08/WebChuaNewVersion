import { smoothstep } from "../utils/animation.js";
import { AMBIENT_START, AMBIENT_FULL } from "../config/timing.js";

const lerp = (a, b, t) => a + (b - a) * t;

const cursorState = {
  ready: false,
  frame: null,
  layer: null,
  main: null,
  soft: null,
  warm: null,
  grain: null,

  currentX: 0,
  currentY: 0,
  targetX: 0,
  targetY: 0,

  currentOpacity: 0,
  targetOpacity: 0,

  pageOpacity: 0,
  rafId: null,
  isRunning: false,
};

const ensureCursorFog = (frame) => {
  if (!frame) return null;

  const existing = frame.querySelector(".cursor-fog-layer");

  if (existing) {
    cursorState.layer = existing;
    cursorState.main = existing.querySelector(".cursor-fog-main");
    cursorState.soft = existing.querySelector(".cursor-fog-soft");
    cursorState.warm = existing.querySelector(".cursor-fog-warm");
    cursorState.grain = existing.querySelector(".cursor-fog-grain");

    return existing;
  }

  const layer = document.createElement("div");
  layer.className = "cursor-fog-layer";
  layer.setAttribute("aria-hidden", "true");

  layer.innerHTML = `
    <div class="cursor-fog cursor-fog-main"></div>
    <div class="cursor-fog cursor-fog-soft"></div>
    <div class="cursor-fog cursor-fog-warm"></div>
    <div class="cursor-fog-grain"></div>
  `;

  const video = frame.querySelector(".hero-video");

  if (video && video.nextSibling) {
    frame.insertBefore(layer, video.nextSibling);
  } else {
    frame.appendChild(layer);
  }

  cursorState.layer = layer;
  cursorState.main = layer.querySelector(".cursor-fog-main");
  cursorState.soft = layer.querySelector(".cursor-fog-soft");
  cursorState.warm = layer.querySelector(".cursor-fog-warm");
  cursorState.grain = layer.querySelector(".cursor-fog-grain");

  return layer;
};

const applyCursorTransform = () => {
  const {
    layer,
    main,
    soft,
    warm,
    grain,
    currentX,
    currentY,
    currentOpacity,
    pageOpacity,
  } = cursorState;

  if (!layer || !main || !soft || !warm) return;

  const opacity = currentOpacity * pageOpacity;

  layer.style.opacity = pageOpacity.toFixed(3);
  layer.style.visibility = pageOpacity > 0.01 ? "visible" : "hidden";

  main.style.opacity = (opacity * 0.72).toFixed(3);
  soft.style.opacity = (opacity * 0.44).toFixed(3);
  warm.style.opacity = (opacity * 0.22).toFixed(3);

  main.style.transform = `translate3d(${currentX.toFixed(
    2
  )}px, ${currentY.toFixed(2)}px, 0) translate3d(-50%, -50%, 0)`;

  soft.style.transform = `translate3d(${(currentX + 54).toFixed(
    2
  )}px, ${(currentY + 42).toFixed(2)}px, 0) translate3d(-50%, -50%, 0)`;

  warm.style.transform = `translate3d(${(currentX - 42).toFixed(
    2
  )}px, ${(currentY - 38).toFixed(2)}px, 0) translate3d(-50%, -50%, 0)`;

  if (grain) {
    grain.style.opacity = (opacity * 0.035).toFixed(3);
  }
};

const runCursorLoop = () => {
  cursorState.currentX = lerp(cursorState.currentX, cursorState.targetX, 0.16);
  cursorState.currentY = lerp(cursorState.currentY, cursorState.targetY, 0.16);
  cursorState.currentOpacity = lerp(
    cursorState.currentOpacity,
    cursorState.targetOpacity,
    0.12
  );

  applyCursorTransform();

  const dx = Math.abs(cursorState.targetX - cursorState.currentX);
  const dy = Math.abs(cursorState.targetY - cursorState.currentY);
  const doOpacity = Math.abs(
    cursorState.targetOpacity - cursorState.currentOpacity
  );

  const stillMoving = dx > 0.15 || dy > 0.15 || doOpacity > 0.01;

  if (stillMoving) {
    cursorState.rafId = requestAnimationFrame(runCursorLoop);
  } else {
    cursorState.currentX = cursorState.targetX;
    cursorState.currentY = cursorState.targetY;
    cursorState.currentOpacity = cursorState.targetOpacity;
    applyCursorTransform();

    cursorState.rafId = null;
    cursorState.isRunning = false;
  }
};

const startCursorLoop = () => {
  if (cursorState.isRunning) return;

  cursorState.isRunning = true;
  cursorState.rafId = requestAnimationFrame(runCursorLoop);
};

const initCursorEvents = (frame) => {
  if (!frame || cursorState.ready) return;

  cursorState.ready = true;
  cursorState.frame = frame;

  const setCursorFromEvent = (event) => {
    const rect = frame.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) return;

    cursorState.targetX = event.clientX - rect.left;
    cursorState.targetY = event.clientY - rect.top;
    cursorState.targetOpacity = 1;

    startCursorLoop();
  };

  const hideCursorFog = () => {
    cursorState.targetOpacity = 0;
    startCursorLoop();
  };

  window.addEventListener("pointermove", setCursorFromEvent, {
    passive: true,
  });

  window.addEventListener("pointerleave", hideCursorFog, {
    passive: true,
  });

  window.addEventListener("blur", hideCursorFog, {
    passive: true,
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      hideCursorFog();
    }
  });
};

export const updateAmbientBackground = ({ element, progress = 0 }) => {
  if (!element) return;

  const layer = ensureCursorFog(element);

  if (!layer) return;

  initCursorEvents(element);

  const fadeIn = smoothstep(AMBIENT_START, AMBIENT_FULL, progress);
  const fadeOut = 1 - smoothstep(0.98, 1, progress);

  cursorState.pageOpacity = fadeIn * fadeOut;

  applyCursorTransform();
};
