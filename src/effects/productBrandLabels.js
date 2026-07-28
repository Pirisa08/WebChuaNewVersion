import {
  clamp,
  smoothstep,
} from "../utils/animation.js";

import {
  LABEL_WRAP_IN_START,
  LABEL_WRAP_IN_END,
  LABEL_FOLLOW_PRODUCT_START,
  LABEL_FOLLOW_PRODUCT_END,
  LABEL_OUT_START,
  LABEL_OUT_END,
} from "../config/timing.js";

/* ======================================================
   HELPERS
   ====================================================== */

const lerp = (
  start,
  end,
  progress
) =>
  start +
  (end - start) * progress;

const isVisibleElement = (
  element
) => {
  if (!element) return false;

  const style =
    window.getComputedStyle(
      element
    );

  const opacity =
    Number.parseFloat(
      style.opacity || "1"
    );

  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    opacity > 0.03
  );
};

const rectsOverlap = (
  firstRect,
  secondRect,
  gap = 0
) =>
  !(
    firstRect.right + gap <=
      secondRect.left ||
    firstRect.left >=
      secondRect.right + gap ||
    firstRect.bottom + gap <=
      secondRect.top ||
    firstRect.top >=
      secondRect.bottom + gap
  );

/* ======================================================
   VISIBLE SEO COPY
   ====================================================== */

const TOPLINE_COPY = {
  title:
    "THAI DRIED FRUIT & PRODUCT INNOVATION",

  tags: [
    "DRIED FRUIT",
    "OEM",
    "PRIVATE LABEL",
    "EXPORT",
  ],

  ariaLabel:
    "Thai dried fruit manufacturer and exporter supplying soft dried fruit, OEM, private label, wholesale and export-ready fruit products from Thailand for importers and distributors worldwide",
};

const BRAND_LABEL_COPY = {
  polnapa: {
    title: "POLNAPA",
    subtitle:
      "Thai dried fruit collection",
    ariaLabel:
      "POLNAPA Thai dried fruit collection for retail, gifting, private label and export markets",
  },

  longanic: {
    title: "LONGANIC",
    subtitle:
      "Longan extract & wellness innovation",
    ariaLabel:
      "LONGANIC Thai longan extract and functional wellness product innovation",
  },

  matsuri: {
    title: "MATSURI",
    subtitle:
      "Roasted sunflower seed snack",
    ariaLabel:
      "MATSURI flavoured roasted sunflower seed snack for modern retail and export markets",
  },
};

const LABEL_ORDER = [
  "polnapa",
  "longanic",
  "matsuri",
];

const SELECTORS = {
  polnapa:
    ".product-brand-label-polnapa",

  longanic:
    ".product-brand-label-longanic",

  matsuri:
    ".product-brand-label-matsuri",
};

const layoutState = {
  baseKey: "",
  viewportKey: "",
  protectedRects: [],
};

/* ======================================================
   PREPARE CONTENT
   ====================================================== */

const updateToplineCopy = (
  element
) => {
  const topline =
    element.querySelector(
      ".product-labels-topline"
    );

  if (!topline) return;

  const title =
    topline.querySelector(
      ":scope > p"
    );

  if (title) {
    title.textContent =
      TOPLINE_COPY.title;
  }

  const tagWrap =
    topline.querySelector(
      ".product-labels-topline-tags"
    );

  if (tagWrap) {
    tagWrap.innerHTML =
      TOPLINE_COPY.tags
        .map(
          (tag) =>
            `<span>${tag}</span>`
        )
        .join("");
  }

  topline.setAttribute(
    "aria-label",
    TOPLINE_COPY.ariaLabel
  );
};

const updateBrandCopy = (
  element,
  key
) => {
  const label =
    element.querySelector(
      SELECTORS[key]
    );

  const copy =
    BRAND_LABEL_COPY[key];

  if (!label || !copy) return;

  const title =
    label.querySelector(
      "strong"
    );

  const subtitle =
    label.querySelector(
      "span"
    );

  if (title) {
    title.textContent =
      copy.title;
  }

  if (subtitle) {
    subtitle.textContent =
      copy.subtitle;
  }

  label.setAttribute(
    "role",
    "group"
  );

  label.setAttribute(
    "aria-label",
    copy.ariaLabel
  );
};

const prepareLabels = (
  element
) => {
  if (
    element.dataset
      .responsiveBrandLabelsReady ===
    "true"
  ) {
    return;
  }

  element.dataset
    .responsiveBrandLabelsReady =
    "true";

  const samoodiLabel =
    element.querySelector(
      ".product-brand-label-samoodi"
    );

  samoodiLabel?.remove();

  updateToplineCopy(
    element
  );

  LABEL_ORDER.forEach(
    (key) => {
      updateBrandCopy(
        element,
        key
      );
    }
  );

  element.setAttribute(
    "role",
    "region"
  );

  element.setAttribute(
    "aria-label",
    "Thai dried fruit and product innovation brands for retail, OEM, private label and export markets"
  );
};

/* ======================================================
   POSITION HELPERS
   ====================================================== */

const applyBasePosition = ({
  label,
  config,
}) => {
  if (
    Number.isFinite(
      config?.left
    )
  ) {
    label.style.left =
      `${config.left}%`;
  }

  if (
    Number.isFinite(
      config?.top
    )
  ) {
    label.style.top =
      `${config.top}vh`;
  }
};

const applyLabelTransform = ({
  label,
  x,
  y,
  scale,
}) => {
  label.style.transform = `
    translate3d(
      ${x.toFixed(2)}px,
      ${y.toFixed(2)}px,
      0
    )
    scale(${scale.toFixed(3)})
  `;
};

const keepLabelInsideViewport = ({
  label,
  x,
  y,
  scale,
  mode,
}) => {
  const edgeGap =
    mode === "mobile"
      ? 8
      : 18;

  const minimumTop =
    mode === "mobile"
      ? 60
      : 78;

  let adjustedX = x;
  let adjustedY = y;

  applyLabelTransform({
    label,
    x: adjustedX,
    y: adjustedY,
    scale,
  });

  let rect =
    label.getBoundingClientRect();

  if (
    rect.left < edgeGap
  ) {
    adjustedX +=
      edgeGap - rect.left;
  }

  if (
    rect.right >
    window.innerWidth - edgeGap
  ) {
    adjustedX -=
      rect.right -
      (
        window.innerWidth -
        edgeGap
      );
  }

  if (
    rect.top < minimumTop
  ) {
    adjustedY +=
      minimumTop - rect.top;
  }

  if (
    rect.bottom >
    window.innerHeight - edgeGap
  ) {
    adjustedY -=
      rect.bottom -
      (
        window.innerHeight -
        edgeGap
      );
  }

  applyLabelTransform({
    label,
    x: adjustedX,
    y: adjustedY,
    scale,
  });

  rect =
    label.getBoundingClientRect();

  return {
    x: adjustedX,
    y: adjustedY,
    rect,
  };
};

const getProtectedRects = (
  mode
) => {
  /*
   * Mobile positions are designed directly against the 9:16 clip.
   * Auto-pushing them away from the title would break that alignment.
   */
  if (mode === "mobile") {
    return [];
  }

  const titleWrap =
    document.querySelector(
      ".lineup-title-wrap"
    );

  if (
    titleWrap &&
    isVisibleElement(
      titleWrap
    )
  ) {
    return [
      titleWrap
        .getBoundingClientRect(),
    ];
  }

  return Array.from(
    document.querySelectorAll(
      ".lineup-title-main, .lineup-title-bridge"
    )
  )
    .filter(
      isVisibleElement
    )
    .map(
      (title) =>
        title.getBoundingClientRect()
    );
};

const getViewportKey = () =>
  `${window.innerWidth}x${window.innerHeight}`;

const getCachedProtectedRects = (
  mode,
  wrapOpacity
) => {
  if (
    mode === "mobile" ||
    wrapOpacity <= 0.02
  ) {
    layoutState.viewportKey = "";
    layoutState.protectedRects = [];

    return [];
  }

  const viewportKey =
    getViewportKey();

  if (
    layoutState.viewportKey !==
    viewportKey
  ) {
    layoutState.viewportKey =
      viewportKey;

    layoutState.protectedRects =
      getProtectedRects(
        mode
      );
  }

  return layoutState.protectedRects;
};

const resolveDesktopCollision = ({
  label,
  x,
  y,
  scale,
  protectedRects,
  occupiedRects,
}) => {
  const collisionGap = 18;

  let adjustedX = x;
  let adjustedY = y;

  let result =
    keepLabelInsideViewport({
      label,
      x: adjustedX,
      y: adjustedY,
      scale,
      mode: "desktop",
    });

  adjustedX = result.x;
  adjustedY = result.y;

  let labelRect =
    result.rect;

  protectedRects.forEach(
    (protectedRect) => {
      if (
        !rectsOverlap(
          labelRect,
          protectedRect,
          8
        )
      ) {
        return;
      }

      const moveRight =
        protectedRect.right -
        labelRect.left +
        collisionGap;

      const moveDown =
        protectedRect.bottom -
        labelRect.top +
        collisionGap;

      const canMoveRight =
        labelRect.right +
          moveRight <
        window.innerWidth - 18;

      if (canMoveRight) {
        adjustedX +=
          moveRight;
      } else {
        adjustedY +=
          moveDown;
      }

      applyLabelTransform({
        label,
        x: adjustedX,
        y: adjustedY,
        scale,
      });

      labelRect =
        label.getBoundingClientRect();
    }
  );

  occupiedRects.forEach(
    (occupiedRect) => {
      if (
        !rectsOverlap(
          labelRect,
          occupiedRect,
          8
        )
      ) {
        return;
      }

      const moveDown =
        occupiedRect.bottom -
        labelRect.top +
        collisionGap;

      adjustedY +=
        moveDown;

      applyLabelTransform({
        label,
        x: adjustedX,
        y: adjustedY,
        scale,
      });

      labelRect =
        label.getBoundingClientRect();
    }
  );

  return keepLabelInsideViewport({
    label,
    x: adjustedX,
    y: adjustedY,
    scale,
    mode: "desktop",
  });
};

/* ======================================================
   UPDATE PRODUCT BRAND LABELS
   ====================================================== */

export const updateProductBrandLabels = ({
  element,
  progress = 0,
  mode = "desktop",
  scene = null,
}) => {
  if (!element) return;

  prepareLabels(
    element
  );

  const sceneMode =
    mode === "mobile"
      ? "mobile"
      : "desktop";

  element.dataset.sceneMode =
    sceneMode;

  const labelConfigs =
    scene?.brandLabels ?? {};

  const wrapIn =
    smoothstep(
      LABEL_WRAP_IN_START,
      LABEL_WRAP_IN_END,
      progress
    );

  const followProduct =
    smoothstep(
      LABEL_FOLLOW_PRODUCT_START,
      LABEL_FOLLOW_PRODUCT_END,
      progress
    );

  const wrapOut =
    smoothstep(
      LABEL_OUT_START,
      LABEL_OUT_END,
      progress
    );

  const wrapOpacity =
    wrapIn *
    (1 - wrapOut);

  const wrapY =
    lerp(
      12,
      0,
      wrapIn
    ) +
    lerp(
      0,
      -10,
      wrapOut
    );

  const wrapBlur =
    sceneMode === "mobile"
      ? 0
      : lerp(
          7,
          0,
          wrapIn
        ) +
        lerp(
          0,
          6,
          wrapOut
        );

  element.style.opacity =
    wrapOpacity.toFixed(3);

  element.style.visibility =
    wrapOpacity > 0.02
      ? "visible"
      : "hidden";

  element.style.pointerEvents =
    "none";

  element.style.transform =
    `translate3d(0, ${wrapY.toFixed(2)}px, 0)`;

  element.style.filter =
    `blur(${wrapBlur.toFixed(2)}px)`;

  const topline =
    element.querySelector(
      ".product-labels-topline"
    );

  if (topline) {
    topline.style.opacity =
      wrapOpacity.toFixed(3);

    topline.style.visibility =
      wrapOpacity > 0.02
        ? "visible"
        : "hidden";

    topline.style.transform =
      `translate3d(-50%, ${lerp(10, 0, wrapIn).toFixed(2)}px, 0)`;

    topline.style.filter =
      `blur(${wrapBlur.toFixed(2)}px)`;
  }

  if (wrapOpacity <= 0.002) {
    return;
  }

  const followDuration =
    Math.max(
      LABEL_FOLLOW_PRODUCT_END -
        LABEL_FOLLOW_PRODUCT_START,
      0.0001
    );

  const wobblePhase =
    clamp(
      (
        progress -
        LABEL_FOLLOW_PRODUCT_START
      ) /
        followDuration,
      0,
      1
    );

  const wobbleWave =
    Math.sin(
      wobblePhase * Math.PI
    );

  const protectedRects =
    getCachedProtectedRects(
      sceneMode,
      wrapOpacity
    );

  const occupiedRects = [];

  const baseKey =
    `${sceneMode}:${JSON.stringify(labelConfigs)}`;

  const shouldApplyBasePosition =
    layoutState.baseKey !==
    baseKey;

  if (shouldApplyBasePosition) {
    layoutState.baseKey =
      baseKey;
  }

  LABEL_ORDER.forEach(
    (
      key,
      index
    ) => {
      const label =
        element.querySelector(
          SELECTORS[key]
        );

      const config =
        labelConfigs[key];

      if (!label || !config) {
        return;
      }

      if (shouldApplyBasePosition) {
        applyBasePosition({
          label,
          config,
        });
      }

      const labelInStart =
        LABEL_WRAP_IN_START +
        index * 0.001;

      const labelIn =
        smoothstep(
          labelInStart,
          LABEL_WRAP_IN_END,
          progress
        );

      const labelOut =
        smoothstep(
          LABEL_OUT_START +
            index * 0.001,
          LABEL_OUT_END +
            index * 0.001,
          progress
        );

      const labelOpacity =
        labelIn *
        (1 - labelOut);

      const enterX =
        lerp(
          config.enterX ?? 0,
          0,
          labelIn
        );

      const enterY =
        lerp(
          config.enterY ?? 0,
          0,
          labelIn
        );

      const wobble =
        wobbleWave *
        (config.wobble ?? 0);

      const followX =
        lerp(
          0,
          config.followX ?? 0,
          followProduct
        ) +
        wobble * 1.8;

      const followY =
        lerp(
          0,
          config.followY ?? 0,
          followProduct
        ) -
        wobble * 1.1;

      const exitX =
        lerp(
          0,
          config.exitX ?? 0,
          labelOut
        );

      const exitY =
        lerp(
          0,
          config.exitY ?? 0,
          labelOut
        );

      const baseX =
        enterX +
        followX +
        exitX;

      const baseY =
        enterY +
        followY +
        exitY;

      const scale =
        lerp(
          0.96,
          1,
          labelIn
        ) +
        followProduct *
          (config.scaleBoost ?? 0) -
        labelOut * 0.05;

      const lineHeight =
        lerp(
          config.lineStart ?? 80,
          config.lineEnd ?? 16,
          followProduct
        );

      label.style.setProperty(
        "--label-line-height",
        `${lineHeight.toFixed(1)}px`
      );

      label.style.setProperty(
        "--label-line-opacity",
        labelOpacity.toFixed(3)
      );

      label.style.opacity =
        labelOpacity.toFixed(3);

      label.style.visibility =
        labelOpacity > 0.02
          ? "visible"
          : "hidden";

      label.style.transformOrigin =
        "center center";

      label.style.pointerEvents =
        "none";

      const blur =
        sceneMode === "mobile"
          ? 0
          : (1 - labelIn) * 6 +
            labelOut * 5;

      label.style.filter =
        `blur(${blur.toFixed(2)}px)`;

      if (
        labelOpacity <= 0.02
      ) {
        applyLabelTransform({
          label,
          x: baseX,
          y: baseY,
          scale,
        });

        return;
      }

      if (sceneMode === "mobile") {
        applyLabelTransform({
          label,
          x: baseX,
          y: baseY,
          scale,
        });

        return;
      }

      const resolved =
        resolveDesktopCollision({
          label,
          x: baseX,
          y: baseY,
          scale,
          protectedRects:
            config.avoidProtectedCollision
              ? []
              : protectedRects,
          occupiedRects,
        });

      occupiedRects.push(
        resolved.rect
      );
    }
  );
};
