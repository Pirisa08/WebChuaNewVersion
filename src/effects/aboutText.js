import { clamp, smoothstep } from "../utils/animation.js";
import {
  STORY_START_PROGRESS,
  STORY_FULL_PROGRESS,
  STORY_EXIT_START_PROGRESS,
  STORY_EXIT_END_PROGRESS,
  INGREDIENT_START_PROGRESS,
  INGREDIENT_FULL_PROGRESS,
  INGREDIENT_EXIT_START_PROGRESS,
  INGREDIENT_EXIT_END_PROGRESS,
  STORY_LINE_START_PROGRESS,
  STORY_LINE_STAGGER,
  STORY_LINE_REVEAL_DURATION,
  INGREDIENT_ITEM_START_PROGRESS,
  INGREDIENT_ITEM_STAGGER,
  INGREDIENT_ITEM_REVEAL_DURATION,
} from "../config/timing.js";

// About story timing by scroll percent
// 23% = เริ่มแสดง story text
// 24% = ขึ้นชัด
// 35% = เริ่มค่อย ๆ หาย
// 37% = หายสนิท
const highlightWords = [
  "your needs",
];

const STORY_COPY = {
  desktop: [
    "Striving to understand",
    "your needs",
    "before you understand them.",
  ],

  mobile: [
    "Understanding",
    "your needs",
    "before you do.",
  ],
};

const INGREDIENT_COPY = {
  desktop: `
    Curated fruits<br />
    from Thailand<br />
    Made for the<br />
    <span>Modern Markets</span>
  `,

  mobile: `
    Curated fruits<br />
    from Thailand<br />
    <span>for Modern Markets</span>
  `,
};

const applyResponsiveCopy = (
  element,
  mode = "desktop"
) => {
  const copyMode =
    mode === "mobile"
      ? "mobile"
      : "desktop";

  if (
    element.dataset.aboutCopyMode ===
    copyMode
  ) {
    return;
  }

  element.dataset.aboutCopyMode =
    copyMode;

  const lines =
    element.querySelectorAll(
      ".about-line"
    );

  STORY_COPY[copyMode].forEach(
    (copy, index) => {
      if (lines[index]) {
        lines[index].textContent =
          copy;
      }
    }
  );

  const ingredientTitle =
    element.querySelector(
      ".ingredient-title"
    );

  if (ingredientTitle) {
    ingredientTitle.innerHTML =
      INGREDIENT_COPY[copyMode];
  }
};

const setLineHighlights = (element) => {
  const lines = element.querySelectorAll(".about-line");

  lines.forEach((line) => {
    line.classList.remove("is-accent");

    const text = line.textContent.trim();

    if (highlightWords.includes(text)) {
      line.classList.add("is-accent");
    }
  });
};

const setPanelState = ({
  panel,
  opacity,
  x = 0,
  y = 0,
  scale = 1,
  blur = 0,
}) => {
  if (!panel) return;

  panel.style.opacity = opacity.toFixed(3);
  panel.style.visibility = opacity > 0.01 ? "visible" : "hidden";
  panel.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(
    2
  )}px, 0) scale(${scale.toFixed(3)})`;
  panel.style.filter = `blur(${blur.toFixed(2)}px)`;
};

export const updateAboutText = ({
  element,
  progress,
  mode = "desktop",
}) => {
  if (!element) return;

  applyResponsiveCopy(
    element,
    mode
  );

  setLineHighlights(element);

  const storyPanel = element.querySelector(".about-story-panel");
  const ingredientPanel = element.querySelector(".about-ingredient-panel");

  const storyFadeIn = smoothstep(
    STORY_START_PROGRESS,
    STORY_FULL_PROGRESS,
    progress
  );

  const storyExit = smoothstep(
    STORY_EXIT_START_PROGRESS,
    STORY_EXIT_END_PROGRESS,
    progress
  );

  const ingredientFadeIn = smoothstep(
    INGREDIENT_START_PROGRESS,
    INGREDIENT_FULL_PROGRESS,
    progress
  );

  const ingredientExit = smoothstep(
    INGREDIENT_EXIT_START_PROGRESS,
    INGREDIENT_EXIT_END_PROGRESS,
    progress
  );

  const storyOpacity = storyFadeIn * (1 - storyExit);
  const ingredientOpacity = ingredientFadeIn * (1 - ingredientExit);
  const totalOpacity = Math.max(storyOpacity, ingredientOpacity);

  element.style.opacity = totalOpacity.toFixed(3);
  element.style.visibility = totalOpacity > 0.01 ? "visible" : "hidden";

  setPanelState({
    panel: storyPanel,
    opacity: storyOpacity,
    x: (1 - storyFadeIn) * -34 + storyExit * -28,
    y: (1 - storyFadeIn) * 18 + storyExit * -12,
    scale: 0.965 + storyFadeIn * 0.035 - storyExit * 0.012,
    blur: (1 - storyFadeIn) * 8 + storyExit * 8,
  });

  setPanelState({
    panel: ingredientPanel,
    opacity: ingredientOpacity,
    x: (1 - ingredientFadeIn) * -26 + ingredientExit * -20,
    y: (1 - ingredientFadeIn) * 22 + ingredientExit * -16,
    scale: 0.97 + ingredientFadeIn * 0.03 - ingredientExit * 0.012,
    blur: (1 - ingredientFadeIn) * 8 + ingredientExit * 8,
  });

  const lines = element.querySelectorAll(".about-line");

  lines.forEach((line, index) => {
    const start = STORY_LINE_START_PROGRESS + index * STORY_LINE_STAGGER;
    const end = start + STORY_LINE_REVEAL_DURATION;

    const lineIn = smoothstep(start, end, progress);
    const lineOut = smoothstep(
      STORY_EXIT_START_PROGRESS + index * 0.0012,
      STORY_EXIT_END_PROGRESS,
      progress
    );

    const lineOpacity = clamp(lineIn * (1 - lineOut), 0, 1);
    const lineY = (1 - lineIn) * 22 + lineOut * -14;
    const lineX = (1 - lineIn) * -14 + lineOut * -10;
    const lineBlur = (1 - lineIn) * 8 + lineOut * 6;

    line.style.opacity = lineOpacity.toFixed(3);
    line.style.transform = `translate3d(${lineX.toFixed(2)}px, ${lineY.toFixed(
      2
    )}px, 0)`;
    line.style.filter = `blur(${lineBlur.toFixed(2)}px)`;
  });

  const ingredientItems = element.querySelectorAll(".ingredient-list span");

  ingredientItems.forEach((item, index) => {
    const start =
      INGREDIENT_ITEM_START_PROGRESS + index * INGREDIENT_ITEM_STAGGER;
    const end = start + INGREDIENT_ITEM_REVEAL_DURATION;

    const itemIn = smoothstep(start, end, progress);
    const itemOut = smoothstep(
      INGREDIENT_EXIT_START_PROGRESS + index * 0.002,
      INGREDIENT_EXIT_END_PROGRESS,
      progress
    );

    const itemOpacity = clamp(itemIn * (1 - itemOut), 0, 1);
    const itemY = (1 - itemIn) * 16 + itemOut * -12;
    const itemBlur = (1 - itemIn) * 6 + itemOut * 5;

    item.style.opacity = itemOpacity.toFixed(3);
    item.style.transform = `translate3d(0, ${itemY.toFixed(2)}px, 0)`;
    item.style.filter = `blur(${itemBlur.toFixed(2)}px)`;
  });
};
