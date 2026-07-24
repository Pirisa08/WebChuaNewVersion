import { clamp, smoothstep } from "../utils/animation.js";
import {
  LABEL_WRAP_IN_START,
  LABEL_WRAP_IN_END,
  LABEL_FOLLOW_PRODUCT_START,
  LABEL_FOLLOW_PRODUCT_END,
  LABEL_OUT_START,
  LABEL_OUT_END,
} from "../config/timing.js";

const lerp = (a, b, t) => a + (b - a) * t;

const LABELS = [
  {
    selector: ".product-brand-label-polnapa",
    enterX: -16,
    enterY: 18,

    followX: 30,
    followY: 0,

    exitX: -8,
    exitY: -12,

    lineStart: 120,
    lineEnd: 20,

    wobble: 0.9,
    scaleBoost: 0.008,
    origin: "center center",
  },
  {
    selector: ".product-brand-label-longanic",
    enterX: 0,
    enterY: 18,

    followX: -175,
    followY: -92,

    exitX: 8,
    exitY: -12,

    lineStart: 155,
    lineEnd: 10,

    wobble: 0.9,
    scaleBoost: 0.01,
    origin: "center center",
  },
  {
    selector: ".product-brand-label-matsuri",
    enterX: 14,
    enterY: 18,

    followX: -120,
    followY: -72,

    exitX: 10,
    exitY: -10,

    lineStart: 105,
    lineEnd: 10,

    wobble: 0.85,
    scaleBoost: 0.008,
    origin: "center center",
  },
];

const prepareLabels = (element) => {
  if (element.dataset.newProductLabelsReady === "true") return;
  element.dataset.newProductLabelsReady = "true";

  // ลบ sa-MOOD-i ถ้ายังมีหลงเหลือใน HTML
  const samoodiLabel = element.querySelector(".product-brand-label-samoodi");
  if (samoodiLabel) {
    samoodiLabel.remove();
  }
};

export const updateProductBrandLabels = ({ element, progress = 0 }) => {
  if (!element) return;

  prepareLabels(element);

  const wrapIn = smoothstep(LABEL_WRAP_IN_START, LABEL_WRAP_IN_END, progress);

  const followProduct = smoothstep(
    LABEL_FOLLOW_PRODUCT_START,
    LABEL_FOLLOW_PRODUCT_END,
    progress
  );

  const wrapOut = smoothstep(LABEL_OUT_START, LABEL_OUT_END, progress);

  const wrapOpacity = wrapIn * (1 - wrapOut);
  const wrapY = lerp(12, 0, wrapIn) + lerp(0, -10, wrapOut);
  const wrapBlur = lerp(7, 0, wrapIn) + lerp(0, 6, wrapOut);

  element.style.opacity = wrapOpacity.toFixed(3);
  element.style.visibility = wrapOpacity > 0.02 ? "visible" : "hidden";
  element.style.transform = `translate3d(0, ${wrapY.toFixed(2)}px, 0)`;
  element.style.filter = `blur(${wrapBlur.toFixed(2)}px)`;

  const topline = element.querySelector(".product-labels-topline");
  if (topline) {
    // ให้ top line มองเห็นตลอดช่วงที่ container มองเห็น
    topline.style.opacity = wrapOpacity.toFixed(3);
    topline.style.visibility = wrapOpacity > 0.02 ? "visible" : "hidden";
    topline.style.transform = `translate3d(-50%, ${lerp(10, 0, wrapIn).toFixed(
      2
    )}px, 0)`;
    topline.style.filter = `blur(${wrapBlur.toFixed(2)}px)`;
  }

  const wobblePhase = clamp(
    (progress - LABEL_FOLLOW_PRODUCT_START) /
      (LABEL_FOLLOW_PRODUCT_END - LABEL_FOLLOW_PRODUCT_START),
    0,
    1
  );

  const wobbleWave = Math.sin(wobblePhase * Math.PI);

  LABELS.forEach((config, index) => {
    const label = element.querySelector(config.selector);
    if (!label) return;

    const labelInStart = LABEL_WRAP_IN_START + index * 0.001;
    const labelIn = smoothstep(labelInStart, LABEL_WRAP_IN_END, progress);

    const labelOut = smoothstep(
      LABEL_OUT_START + index * 0.001,
      LABEL_OUT_END + index * 0.001,
      progress
    );

    const labelOpacity = labelIn * (1 - labelOut);

    const enterX = lerp(config.enterX, 0, labelIn);
    const enterY = lerp(config.enterY, 0, labelIn);

    const wobble = wobbleWave * config.wobble;

    const followX = lerp(0, config.followX, followProduct) + wobble * 1.8;
    const followY = lerp(0, config.followY, followProduct) - wobble * 1.1;

    const exitX = lerp(0, config.exitX, labelOut);
    const exitY = lerp(0, config.exitY, labelOut);

    const x = enterX + followX + exitX;
    const y = enterY + followY + exitY;

    const scale =
      lerp(0.96, 1, labelIn) +
      followProduct * config.scaleBoost -
      labelOut * 0.05;

    const lineHeight = lerp(config.lineStart, config.lineEnd, followProduct);

    label.style.setProperty("--label-line-height", `${lineHeight.toFixed(1)}px`);
    label.style.setProperty("--label-line-opacity", labelOpacity.toFixed(3));

    label.style.opacity = labelOpacity.toFixed(3);
    label.style.visibility = labelOpacity > 0.02 ? "visible" : "hidden";
    label.style.transformOrigin = config.origin;
    label.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(
      2
    )}px, 0) scale(${scale.toFixed(3)})`;

    const blur = (1 - labelIn) * 6 + labelOut * 5;
    label.style.filter = `blur(${blur.toFixed(2)}px)`;
  });
};