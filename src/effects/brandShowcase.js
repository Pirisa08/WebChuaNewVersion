import {
  clamp,
  smoothstep,
} from "../utils/animation.js";

import {
  BRAND_DETAIL_IN_START,
  BRAND_DETAIL_IN_FULL,
  BRAND_DETAIL_EXIT_START,
  BRAND_DETAIL_EXIT_END,
  BRAND_RANGES,
} from "../config/timing.js";

/* ======================================================
   BRAND CONTENT
   ====================================================== */

const BRANDS = [
  {
    key: "polnapa",
    name: "POLNAPA",

    category:
      "“ผลนภา”: A Thai Dried Fruit Collection",

    description:
      "A colorful dried fruit series crafted from selected Thai fruits for retail, gifting, wholesale, OEM, private label, and export markets.",

    products:
      "Dried Mango / Dried Coconut / Dried Strawberry / Dried Rambutan",

    productsLabel:
      "Thai Dried Fruit Products",

    type:
      "Retail Ready / OEM / Private Label",

    mood:
      "Friendly / Natural / Everyday",

    range:
      BRAND_RANGES[0],
  },

  {
    key: "longanic",
    name: "LONGANIC",

    category:
      "Compressed & Extracted Longan Innovation",

    description:
      "Award-winning longan innovation developed for functional beverages, wellness products, ingredient solutions, and OEM product concepts.",

    products:
      "Longan Drink / Longan Extract / Wellness Shelf Concept",

    productsLabel:
      "Longan Wellness Products",

    type:
      "Functional Drink / Extract / OEM",

    mood:
      "Wellness / Innovation / Modern",

    range:
      BRAND_RANGES[1],
  },

  {
    key: "matsuri",
    name: "MATSURI (まつり)",

    category:
      "Flavoured Roasted Sunflower Seeds Snack",

    description:
      "A generational snack classic reintroduced with trending flavours for modern retail, wholesale, private label, and export markets.",

    products:
      "King Truffle / Hot Mala / Himalayan Salt\nCreamy Milk Caramel / Jing Jai Ginger / Emperor Wasabi",

    productsLabel:
      "Flavours",

    type:
      "Retail Snack / Wholesale / Export",

    mood:
      "Playful / Flavourful / Modern",

    range:
      BRAND_RANGES[2],
  },
];

let currentIndex = -1;
let currentMode = null;

/* ======================================================
   HELPERS
   ====================================================== */

const getActiveIndex = (
  progress
) => {
  const index =
    BRANDS.findIndex(
      (brand) => {
        const [
          start,
          end,
        ] = brand.range;

        return (
          progress >= start &&
          progress < end
        );
      }
    );

  if (index >= 0) {
    return index;
  }

  if (
    progress <
    BRANDS[0].range[0]
  ) {
    return 0;
  }

  return BRANDS.length - 1;
};

const setText = (
  element,
  selector,
  value
) => {
  const target =
    element.querySelector(
      selector
    );

  if (target) {
    target.textContent =
      value;
  }
};

const mergeLayout = (
  base = {},
  override = {}
) => ({
  ...base,
  ...override,
});

/* ======================================================
   CREATE CONTENT
   ====================================================== */

const ensureSingleBrandContent = (
  element
) => {
  const copy =
    element.querySelector(
      ".brand-copy"
    );

  if (!copy) return;

  element.classList.remove(
    "is-all-brands"
  );

  if (
    element.dataset
      .responsiveBrandReady ===
    "true"
  ) {
    return;
  }

  element.dataset
    .responsiveBrandReady =
    "true";

  copy.innerHTML = `
    <div class="brand-meta">
      <p class="brand-kicker">
        OUR HOUSE BRANDS
      </p>

      <p
        id="brandCount"
        class="brand-count"
      >
        01 / 03
      </p>
    </div>

    <h2
      id="brandName"
      class="brand-name"
    >
      POLNAPA
    </h2>

    <p
      id="brandCategory"
      class="brand-category"
    >
      “ผลนภา”: A Thai Dried Fruit Collection
    </p>

    <p
      id="brandDescription"
      class="brand-description"
    >
      A colorful dried fruit series crafted from selected Thai fruits
      for retail, gifting, wholesale, OEM, private label, and export markets.
    </p>

    <div class="brand-extra-grid">
      <div class="brand-extra-card">
        <p>
          Brand Type
        </p>

        <strong id="brandType">
          Retail Ready / OEM / Private Label
        </strong>
      </div>

      <div class="brand-extra-card">
        <p>
          Brand Mood
        </p>

        <strong id="brandMood">
          Friendly / Natural / Everyday
        </strong>
      </div>
    </div>

    <div class="brand-products">
      <p
        id="brandProductsLabel"
        class="brand-products-label"
      >
        Thai Dried Fruit Products
      </p>

      <p
        id="brandProducts"
        class="brand-products-list"
      >
        Dried Mango / Dried Coconut / Dried Strawberry / Dried Rambutan
      </p>
    </div>

    <div
      class="brand-progress"
      aria-hidden="true"
    >
      <span class="brand-dot is-active"></span>
      <span class="brand-dot"></span>
      <span class="brand-dot"></span>
    </div>

    <div
      class="brand-card-orbit"
      aria-hidden="true"
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
};

/* ======================================================
   UPDATE CONTENT
   ====================================================== */

const setActiveBrand = (
  element,
  index
) => {
  const brand =
    BRANDS[index];

  element.dataset.brandKey =
    brand.key;

  setText(
    element,
    "#brandCount",
    `${String(index + 1).padStart(2, "0")} / ${String(BRANDS.length).padStart(2, "0")}`
  );

  setText(
    element,
    "#brandName",
    brand.name
  );

  setText(
    element,
    "#brandCategory",
    brand.category
  );

  setText(
    element,
    "#brandDescription",
    brand.description
  );

  setText(
    element,
    "#brandProducts",
    brand.products
  );

  setText(
    element,
    "#brandType",
    brand.type
  );

  setText(
    element,
    "#brandMood",
    brand.mood
  );

  const productsLabel =
    element.querySelector(
      "#brandProductsLabel"
    );

  if (productsLabel) {
    productsLabel.textContent =
      brand.productsLabel || "";

    productsLabel.style.display =
      brand.productsLabel
        ? ""
        : "none";
  }

  const dots =
    element.querySelectorAll(
      ".brand-dot"
    );

  dots.forEach(
    (
      dot,
      dotIndex
    ) => {
      dot.classList.toggle(
        "is-active",
        dotIndex === index
      );

      dot.classList.toggle(
        "is-before-active",
        dotIndex < index
      );
    }
  );

  element.classList.remove(
    "is-changing"
  );

  requestAnimationFrame(
    () => {
      element.classList.add(
        "is-changing"
      );
    }
  );
};

/* ======================================================
   RESPONSIVE POSITION
   ====================================================== */

const applyResponsiveBrandLayout = ({
  element,
  mode,
  scene,
  brandKey,
}) => {
  const baseLayout =
    scene?.brandDetails
      ?.default ?? {};

  const brandLayout =
    scene?.brandDetails
      ?.[brandKey] ?? {};

  const layout =
    mergeLayout(
      baseLayout,
      brandLayout
    );

  element.dataset.sceneMode =
    mode;

  const properties = [
    "left",
    "right",
    "top",
    "bottom",
    "width",
    "maxHeight",
  ];

  properties.forEach(
    (property) => {
      const value =
        layout[property];

      if (
        value === undefined ||
        value === null
      ) {
        return;
      }

      element.style[property] =
        value;
    }
  );
};

/* ======================================================
   UPDATE BRAND SHOWCASE
   ====================================================== */

export const updateBrandShowcase = ({
  element,
  progress = 0,
  mode = "desktop",
  scene = null,
}) => {
  if (!element) return;

  ensureSingleBrandContent(
    element
  );

  const sceneMode =
    mode === "mobile"
      ? "mobile"
      : "desktop";

  const index =
    getActiveIndex(
      progress
    );

  const brand =
    BRANDS[index];

  if (
    index !== currentIndex ||
    sceneMode !== currentMode
  ) {
    currentIndex = index;
    currentMode = sceneMode;

    setActiveBrand(
      element,
      index
    );
  }

  applyResponsiveBrandLayout({
    element,
    mode: sceneMode,
    scene,
    brandKey: brand.key,
  });

  const fadeIn =
    smoothstep(
      BRAND_DETAIL_IN_START,
      BRAND_DETAIL_IN_FULL,
      progress
    );

  const exit =
    smoothstep(
      BRAND_DETAIL_EXIT_START,
      BRAND_DETAIL_EXIT_END,
      progress
    );

  const opacity =
    fadeIn *
    (1 - exit);

  const isMobile =
    sceneMode === "mobile";

  const x =
    isMobile
      ? 0
      : (
          (1 - fadeIn) * 46 +
          exit * 10
        );

  const y =
    isMobile
      ? (
          (1 - fadeIn) * 16 +
          exit * -10
        )
      : (
          (1 - fadeIn) * 34 +
          exit * -16
        );

  const blur =
    (1 - fadeIn) *
      (isMobile ? 5 : 8) +
    exit *
      (isMobile ? 6 : 7);

  const scale =
    (isMobile ? 0.98 : 0.965) +
    fadeIn *
      (isMobile ? 0.02 : 0.035) -
    exit *
      (isMobile ? 0.018 : 0.012);

  const localProgress =
    clamp(
      (
        progress -
        BRAND_DETAIL_IN_START
      ) /
        Math.max(
          BRAND_DETAIL_EXIT_START -
            BRAND_DETAIL_IN_START,
          0.0001
        ),
      0,
      1
    );

  element.style.opacity =
    opacity.toFixed(3);

  element.style.visibility =
    opacity > 0.01
      ? "visible"
      : "hidden";

  element.style.pointerEvents =
    "none";

  element.style.transform = `
    translate3d(
      ${x.toFixed(2)}px,
      ${y.toFixed(2)}px,
      0
    )
    scale(${scale.toFixed(3)})
  `;

  element.style.filter =
    `blur(${blur.toFixed(2)}px)`;

  element.style.setProperty(
    "--brand-detail-progress",
    localProgress.toFixed(3)
  );

  const brandDetailActive =
    isMobile &&
    opacity > 0.03;

  document.documentElement
    .classList.toggle(
      "is-mobile-brand-detail-active",
      brandDetailActive
    );

  const visualWrap =
    element.querySelector(
      ".brand-visual-wrap"
    );

  const visual =
    element.querySelector(
      "#brandVisual"
    );

  if (visualWrap) {
    visualWrap.style.display =
      "none";
  }

  if (visual) {
    visual.removeAttribute(
      "src"
    );

    visual.style.display =
      "none";

    visual.style.opacity =
      "0";
  }
};
