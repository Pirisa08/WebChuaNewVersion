import { clamp, smoothstep } from "../utils/animation.js";
import {
  BRAND_DETAIL_IN_START,
  BRAND_DETAIL_IN_FULL,
  BRAND_DETAIL_EXIT_START,
  BRAND_DETAIL_EXIT_END,
  BRAND_RANGES,
} from "../config/timing.js";

const brands = [
  {
    name: "POLNAPA",
    category: "“ผลนภา”: A Thai Dried Fruit Collection",
    description:
      "A colorful dried fruit series crafted from selected Thai fruits for retail, gifting, and export markets.",
    products:
      "Dried Mango / Dried Coconut / Dried Strawberry / Dried Rambutan",
    productsLabel: "",
    type: "Retail Ready",
    mood: "Friendly / Natural / Everyday",
    range: BRAND_RANGES[0],
  },
  {
    name: "LONGANIC",
    category: "Compressed & Extracted Longan Innovation",
    description:
      "Award-winning innovation rich in antioxidants and ellagic acid to combat and alleviate sleep-deprived symptoms.",
    products:
      "Longan Drink / Longan Extract / Wellness Shelf Concept",
    productsLabel: "",
    type: "Functional Drink & Supplement",
    mood: "Wellness / Innovation / Modern",
    range: BRAND_RANGES[1],
  },
  {
    name: "MATSURI (まつり)",
    category: "Flavoured Roasted Sunflower Seeds Snack",
    description:
      "Reintroducing a generational classic with a flavourful twist focused on blending trending tastes and an approachable snack identity for the modern market.",
    products:
      "King Truffle - Hot Mala - Himalayan Salt\nCreamy Milk Caramel - Jing Jai Ginger - Emperor Wasabi",
    productsLabel: "Flavors",
    type: "Retail Sunflower Seeds Brand",
    mood: "Playful / Flavorful / Minimal",
    range: BRAND_RANGES[2],
  },
];

let currentIndex = -1;

const getActiveIndex = (progress) => {
  const index = brands.findIndex((brand) => {
    const [start, end] = brand.range;
    return progress >= start && progress < end;
  });

  if (index >= 0) return index;
  if (progress < brands[0].range[0]) return 0;
  return brands.length - 1;
};

const setText = (element, selector, value) => {
  const target = element.querySelector(selector);
  if (target) {
    target.textContent = value;
  }
};

const setActiveBrand = (element, index) => {
  const brand = brands[index];

  setText(
    element,
    "#brandCount",
    `${String(index + 1).padStart(2, "0")} / ${String(brands.length).padStart(
      2,
      "0"
    )}`
  );

  setText(element, "#brandName", brand.name);
  setText(element, "#brandCategory", brand.category);
  setText(element, "#brandDescription", brand.description);
  setText(element, "#brandProducts", brand.products);

  const productsLabel = element.querySelector("#brandProductsLabel");
  if (productsLabel) {
    productsLabel.textContent = brand.productsLabel || "";
    productsLabel.style.display = brand.productsLabel ? "" : "none";
  }

  const type = element.querySelector("#brandType");
  const mood = element.querySelector("#brandMood");

  if (type) type.textContent = brand.type;
  if (mood) mood.textContent = brand.mood;

  const dots = element.querySelectorAll(".brand-dot");

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
    dot.classList.toggle("is-before-active", dotIndex < index);
  });

  element.classList.remove("is-changing");

  requestAnimationFrame(() => {
    element.classList.add("is-changing");
  });
};

const ensureSingleBrandContent = (element) => {
  const copy = element.querySelector(".brand-copy");
  if (!copy) return;

  element.classList.remove("is-all-brands");

  if (element.dataset.singleBrandReady !== "true") {
    element.dataset.singleBrandReady = "true";

    copy.innerHTML = `
      <div class="brand-meta">
        <p class="brand-kicker">OUR HOUSE BRANDS</p>
        <p id="brandCount" class="brand-count">01 / 03</p>
      </div>

      <h2 id="brandName" class="brand-name">POLNAPA</h2>
      <p id="brandCategory" class="brand-category">“ผลนภา”: A Thai Dried Fruit Collection</p>

      <p id="brandDescription" class="brand-description">
        A colorful dried fruit series crafted from selected Thai fruits for
        retail, gifting, and export markets.
      </p>

      <div class="brand-extra-grid">
        <div class="brand-extra-card">
          <p>Brand Type</p>
          <strong id="brandType">Retail Ready</strong>
        </div>

        <div class="brand-extra-card">
          <p>Brand Mood</p>
          <strong id="brandMood">Friendly / Natural / Everyday</strong>
        </div>
      </div>

      <div class="brand-products">
        <p id="brandProductsLabel" class="brand-products-label" style="display: none;"></p>
        <p id="brandProducts" class="brand-products-list">
          Dried Mango / Dried Coconut / Dried Strawberry / Dried Rambutan
        </p>
      </div>

      <div class="brand-progress" aria-hidden="true">
        <span class="brand-dot is-active"></span>
        <span class="brand-dot"></span>
        <span class="brand-dot"></span>
      </div>

      <div class="brand-card-orbit" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
  }
};

export const updateBrandShowcase = ({ element, progress = 0 }) => {
  if (!element) return;

  ensureSingleBrandContent(element);

  const index = getActiveIndex(progress);

  if (index !== currentIndex) {
    currentIndex = index;
    setActiveBrand(element, index);
  }

  const fadeIn = smoothstep(
    BRAND_DETAIL_IN_START,
    BRAND_DETAIL_IN_FULL,
    progress
  );

  const exit = smoothstep(
    BRAND_DETAIL_EXIT_START,
    BRAND_DETAIL_EXIT_END,
    progress
  );

  const isFinalBrand = index === brands.length - 1;

  let opacity;
  let x;
  let y;
  let blur;
  let scale;
  let rotate;
  let brightness;
  let saturate;

  if (isFinalBrand) {
    // MATSURI: ให้กล่องค่อย ๆ กลืนหายไปกับวิดีโอ
    const dissolve = exit;

    opacity = fadeIn * (1 - dissolve);

    // ขยับเบา ๆ ตามทิศของฉาก แล้วกลืนหาย
    x = (1 - fadeIn) * 42 + dissolve * 36;
    y = (1 - fadeIn) * 28 + dissolve * -6;

    // เบลอมากขึ้นตอนหาย เพื่อให้ดูละลายไปกับฝุ่น/แสง
    blur = (1 - fadeIn) * 8 + dissolve * 18;

    // ย่อเล็กลงระหว่างกลืนหาย
    scale = 0.965 + fadeIn * 0.035 - dissolve * 0.065;

    // เอียงนิดเดียวตอนหาย จะดูไม่แข็ง
    rotate = dissolve * 1.2;

    // ลด saturation และเพิ่ม brightness เล็กน้อย
    brightness = 1 + dissolve * 0.04;
    saturate = 1 - dissolve * 0.18;
  } else {
    // POLNAPA / LONGANIC ใช้ motion ปกติ
    opacity = fadeIn * (1 - exit);
    x = (1 - fadeIn) * 46 + exit * 10;
    y = (1 - fadeIn) * 34 + exit * -16;
    blur = (1 - fadeIn) * 8 + exit * 7;
    scale = 0.965 + fadeIn * 0.035 - exit * 0.012;
    rotate = 0;
    brightness = 1;
    saturate = 1;
  }

  const localProgress = clamp(
    (progress - BRAND_DETAIL_IN_START) /
      (BRAND_DETAIL_EXIT_START - BRAND_DETAIL_IN_START),
    0,
    1
  );

  element.style.opacity = opacity.toFixed(3);
  element.style.visibility = opacity > 0.01 ? "visible" : "hidden";
  element.style.pointerEvents = "none";
  element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(
    2
  )}px, 0) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(2)}deg)`;

  element.style.filter = `blur(${blur.toFixed(
    2
  )}px) brightness(${brightness.toFixed(3)}) saturate(${saturate.toFixed(3)})`;

  element.style.setProperty(
    "--brand-detail-progress",
    localProgress.toFixed(3)
  );

  const visualWrap = element.querySelector(".brand-visual-wrap");
  const visual = element.querySelector("#brandVisual");

  if (visualWrap) {
    visualWrap.style.display = "none";
  }

  if (visual) {
    visual.removeAttribute("src");
    visual.style.display = "none";
    visual.style.opacity = "0";
  }
};