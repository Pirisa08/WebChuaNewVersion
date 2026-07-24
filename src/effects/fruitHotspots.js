import {
  clamp,
  smoothstep,
} from "../utils/animation.js";

import {
  FRUIT_HOTSPOT_IN_START,
  FRUIT_HOTSPOT_IN_FULL,
  FRUIT_HOTSPOT_OUT_START,
  FRUIT_HOTSPOT_OUT_END,
} from "../config/timing.js";

/* ======================================================
   INGREDIENT DATA
   ====================================================== */

const mangoIngredients = [
  "Mango",
  "Sugar",
  "Citric acid",
  "Sodium metabisulfite",
];

const mangoNoSugarIngredients = [
  "Mango",
  "Citric acid",
  "Sodium metabisulfite",
];

const strawberryIngredients = [
  "Strawberry",
  "Sugar",
  "Citric acid",
  "Sodium metabisulfite",
];

const longanIngredients = [
  "Longan",
  "Sugar",
  "Citric acid",
  "Sodium metabisulfite",
];

const coconutIngredients = [
  "Coconut",
  "Sugar",
  "Citric acid",
  "Sodium metabisulfite",
];

const pineappleIngredients = [
  "Pineapple",
  "Sugar",
  "Citric acid",
  "Sodium metabisulfite",
];

const pineappleNoSugarIngredients = [
  "Pineapple",
  "Citric acid",
  "Sodium metabisulfite",
];

const guavaIngredients = [
  "Guava",
  "Sugar",
  "Citric acid",
  "Sodium metabisulfite",
];

const rambutanIngredients = [
  "Rambutan",
  "Sugar",
  "Citric acid",
  "Sodium metabisulfite",
];

const tomatoIngredients = [
  "Tomato",
  "Sugar",
  "Citric acid",
  "Sodium metabisulfite",
];

/* ======================================================
   ASSET PATH
   รองรับ Vite Base URL
   ====================================================== */

const fruitAsset = (fileName) =>
  `${import.meta.env.BASE_URL}Dried%20FRUIT/${encodeURIComponent(
    fileName
  )}`;

/* ======================================================
   FRUIT PRODUCT DATA
   ====================================================== */

const FRUIT_PRODUCTS = [
  {
    id: "mango",

    shortName: "Mango",

    detailTitle: "DRIED MANGO",

    detailCopy:
      "Mango selections for retail, gifting, and OEM packs, with different cuts and sweetness profiles.",

    variants: [
      {
        name: "A",
        image: fruitAsset("mango A.avif"),
        ingredients: mangoIngredients,
      },

      {
        name: "A Natural",
        note: "No added sugar",
        image: fruitAsset("natural mango .avif"),
        ingredients: mangoNoSugarIngredients,
      },

      {
        name: "B06",
        image: fruitAsset("mango B.avif"),
        ingredients: mangoIngredients,
      },

      {
        name: "C3",
        image: fruitAsset("mango C3.avif"),
        ingredients: mangoIngredients,
      },
    ],
  },

  {
    id: "strawberry",

    shortName: "Strawberry",

    detailTitle: "DRIED STRAWBERRY",

    detailCopy:
      "Bright red strawberry selections developed for snack packs, toppings, confectionery, and gifting products.",

    variants: [
      {
        name: "Jumbo Strawberry",
        image: fruitAsset("Jumbo Strawberry.avif"),
        ingredients: strawberryIngredients,
      },

      {
        name: "Tiny Strawberry",
        image: fruitAsset("Tiny Strawberry.avif"),
        ingredients: strawberryIngredients,
      },
    ],
  },

  {
    id: "longan",

    shortName: "Longan",

    detailTitle: "DRIED LONGAN",

    detailCopy:
      "Aromatic longan selections for retail snacks, wellness concepts, ingredient use, and export-ready products.",

    variants: [
      {
        name: "Golden Longan",
        image: fruitAsset("Golden Longan.avif"),
        ingredients: longanIngredients,
      },

      {
        name: "Black Red Longan",
        image: fruitAsset(
          "Black-Red Longan Meat.avif"
        ),
        ingredients: longanIngredients,
      },
    ],
  },

  {
    id: "coconut",

    shortName: "Coconut",

    detailTitle: "DRIED COCONUT",

    detailCopy:
      "Young coconut pieces with a naturally soft profile for retail, bakery, confectionery, and OEM products.",

    variants: [
      {
        name: "Grade A Kati",
        image: fruitAsset(
          "COCONUT - Grade A (Kati).avif"
        ),
        ingredients: coconutIngredients,
      },

      {
        name: "Grade B",
        image: fruitAsset(
          "COCONUT - Grade B.avif"
        ),
        ingredients: coconutIngredients,
      },
    ],
  },

  {
    id: "pineapple",

    shortName: "Pineapple",

    detailTitle: "DRIED PINEAPPLE",

    detailCopy:
      "Golden pineapple selections with a tropical aroma for retail snacks, gifting, ingredient use, and OEM packs.",

    variants: [
      {
        name: "Soft Dried Pineapple",
        image: fruitAsset(
          "Pineapple (sliced).avif"
        ),
        ingredients: pineappleIngredients,
      },

      {
        name: "Natural Pineapple",
        note: "No added sugar",
        image: fruitAsset(
          "Natural Pineapple.avif"
        ),
        ingredients: pineappleNoSugarIngredients,
      },
    ],
  },

  {
    id: "mixed",

    shortName: "Mixed Fruit",

    detailTitle: "MIXED DRIED FRUIT",

    detailCopy:
      "A colorful selection of Thai dried fruits for assorted packs, retail displays, gifting, and custom OEM concepts.",

    variants: [
      {
        name: "Guava",
        image: fruitAsset("dried-Guava1.avif"),
        ingredients: guavaIngredients,
      },

      {
        name: "Golden Longan",
        image: fruitAsset("Golden Longan.avif"),
        ingredients: longanIngredients,
      },

      {
        name: "Rambutan",
        image: fruitAsset("RAMBUTAN.avif"),
        ingredients: rambutanIngredients,
      },

      {
        name: "Tomato",
        image: fruitAsset("tomato.avif"),
        ingredients: tomatoIngredients,
      },
    ],
  },
];

/* ======================================================
   HOTSPOT ORDER
   ตรงกับภาพในวิดีโอจากซ้ายไปขวา

   Mango
   Strawberry
   Longan
   Coconut
   Pineapple
   Mixed Fruit
   ====================================================== */

const HOTSPOTS = [
  {
    id: "mango",
    className: "fruit-hotspot-mango",
  },

  {
    id: "strawberry",
    className:
      "fruit-hotspot-strawberry",
  },

  {
    id: "longan",
    className: "fruit-hotspot-longan",
  },

  {
    id: "coconut",
    className: "fruit-hotspot-coconut",
  },

  {
    id: "pineapple",
    className:
      "fruit-hotspot-pineapple",
  },

  {
    id: "mixed",
    className: "fruit-hotspot-mixed",
  },
];

/* ======================================================
   STATE
   ====================================================== */

const state = {
  ready: false,

  isModalOpen: false,

  modal: null,
  modalShell: null,

  closeButton: null,

  modalTitle: null,
  modalCopy: null,
  modalGrid: null,

  isScrollLocked: false,

  lockedScrollY: 0,

  previousBodyStyles: null,

  lastFocusedElement: null,
};

/* ======================================================
   HELPERS
   ====================================================== */

const getProduct = (id) =>
  FRUIT_PRODUCTS.find(
    (product) => product.id === id
  );

const createVariantCard = (variant) => {
  const note = variant.note
    ? `
      <span class="fruit-variant-note">
        ${variant.note}
      </span>
    `
    : "";

  return `
    <article class="fruit-variant">
      <figure class="fruit-variant-image">
        <img
          src="${variant.image}"
          alt="${variant.name}"
          loading="eager"
          decoding="async"
        />
      </figure>

      <div class="fruit-variant-heading">
        <h3>${variant.name}</h3>
        ${note}
      </div>

      <p class="fruit-ingredients">
        <strong>Ingredients</strong>

        <span>
          ${variant.ingredients.join(", ")}
        </span>
      </p>
    </article>
  `;
};

/* ======================================================
   PAGE SCROLL LOCK
   ====================================================== */

const lockPageScroll = () => {
  if (state.isScrollLocked) return;

  const { body } = document;

  state.lockedScrollY =
    window.scrollY ||
    document.documentElement.scrollTop ||
    0;

  state.previousBodyStyles = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflowY: body.style.overflowY,
  };

  body.style.position = "fixed";
  body.style.top =
    `-${state.lockedScrollY}px`;

  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflowY = "hidden";

  document.documentElement.classList.add(
    "is-fruit-modal-open"
  );

  state.isScrollLocked = true;
};

const unlockPageScroll = () => {
  if (!state.isScrollLocked) return;

  const { body } = document;

  const styles =
    state.previousBodyStyles ?? {};

  body.style.position =
    styles.position ?? "";

  body.style.top =
    styles.top ?? "";

  body.style.left =
    styles.left ?? "";

  body.style.right =
    styles.right ?? "";

  body.style.width =
    styles.width ?? "";

  body.style.overflowY =
    styles.overflowY ?? "";

  document.documentElement.classList.remove(
    "is-fruit-modal-open"
  );

  window.scrollTo(
    0,
    state.lockedScrollY
  );

  state.isScrollLocked = false;

  state.lockedScrollY = 0;

  state.previousBodyStyles = null;
};

/* ======================================================
   OPEN MODAL
   ====================================================== */

const openModal = (
  element,
  product
) => {
  if (
    !state.modal ||
    !product ||
    state.isModalOpen
  ) {
    return;
  }

  state.isModalOpen = true;

  state.lastFocusedElement =
    document.activeElement instanceof
    HTMLElement
      ? document.activeElement
      : null;

  state.modalTitle.textContent =
    product.detailTitle;

  state.modalCopy.textContent =
    product.detailCopy;

  state.modalGrid.className =
    [
      "fruit-variant-grid",
      `fruit-variant-grid-count-${product.variants.length}`,
    ].join(" ");

  state.modalGrid.innerHTML =
    product.variants
      .map(createVariantCard)
      .join("");

  state.modal.hidden = false;

  lockPageScroll();

  window.dispatchEvent(
    new CustomEvent(
      "fruit-detail:open",
      {
        detail: {
          fruitId: product.id,
        },
      }
    )
  );

  element.classList.add(
    "is-modal-open"
  );

  requestAnimationFrame(() => {
    element.classList.add(
      "is-modal-visible"
    );

    state.closeButton?.focus({
      preventScroll: true,
    });
  });
};

/* ======================================================
   CLOSE MODAL
   ====================================================== */

const closeModal = (element) => {
  if (
    !state.modal ||
    state.modal.hidden ||
    !state.isModalOpen
  ) {
    return;
  }

  state.isModalOpen = false;

  element.classList.remove(
    "is-modal-visible"
  );

  window.setTimeout(() => {
    if (
      element.classList.contains(
        "is-modal-visible"
      )
    ) {
      return;
    }

    element.classList.remove(
      "is-modal-open"
    );

    state.modal.hidden = true;

    unlockPageScroll();

    window.dispatchEvent(
      new CustomEvent(
        "fruit-detail:close"
      )
    );

    state.lastFocusedElement?.focus?.({
      preventScroll: true,
    });

    state.lastFocusedElement = null;
  }, 200);
};

/* ======================================================
   CREATE CONTENT
   ====================================================== */

const ensureContent = (element) => {
  if (
    !element ||
    state.ready
  ) {
    return;
  }

  state.ready = true;

  element.innerHTML = `
    <section
      class="fruit-hotspot-scene"
      aria-label="Explore dried fruit details"
    >
      <div class="fruit-hotspot-hint">
        <span
          class="fruit-hotspot-hint-dot"
          aria-hidden="true"
        ></span>

        <span class="fruit-hotspot-hint-copy">
          <strong>
            Explore the fruit collection
          </strong>

          <small>
            Click a fruit to discover grades &amp; ingredients
          </small>
        </span>
      </div>

      <div class="fruit-hotspot-stage">
        <div class="fruit-hotspot-map">
          ${HOTSPOTS.map((hotspot) => {
            const product =
              getProduct(hotspot.id);

            return `
              <button
                class="
                  fruit-hotspot
                  ${hotspot.className}
                "
                type="button"
                data-fruit-id="${hotspot.id}"
                aria-label="View ${product.shortName} grades and ingredients"
              >
                <span
                  class="fruit-hotspot-focus"
                  aria-hidden="true"
                ></span>

                <span class="fruit-hotspot-card">
                  <span
                    class="fruit-hotspot-dot"
                    aria-hidden="true"
                  ></span>

                  <span class="fruit-hotspot-copy">
                    <strong>
                      ${product.shortName}
                    </strong>

                    <small>
                      View details
                    </small>
                  </span>

                  <span
                    class="fruit-hotspot-arrow"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </span>
              </button>
            `;
          }).join("")}
        </div>
      </div>
    </section>

    <div
      class="fruit-modal"
      hidden
    >
      <div
        class="fruit-modal-backdrop"
        aria-hidden="true"
      ></div>

      <div
        class="fruit-modal-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fruitModalTitle"
      >
        <button
          class="fruit-modal-close"
          type="button"
          aria-label="Close fruit detail"
        >
          <span aria-hidden="true">
            ×
          </span>
        </button>

        <header class="fruit-modal-copy">
          <div>
            <p>
              FRUIT DETAIL
            </p>

            <h2 id="fruitModalTitle"></h2>
          </div>

          <span id="fruitModalCopy"></span>
        </header>

        <div class="fruit-variant-grid"></div>
      </div>
    </div>
  `;

  state.modal =
    element.querySelector(
      ".fruit-modal"
    );

  state.modalShell =
    element.querySelector(
      ".fruit-modal-shell"
    );

  state.closeButton =
    element.querySelector(
      ".fruit-modal-close"
    );

  state.modalTitle =
    element.querySelector(
      "#fruitModalTitle"
    );

  state.modalCopy =
    element.querySelector(
      "#fruitModalCopy"
    );

  state.modalGrid =
    element.querySelector(
      ".fruit-variant-grid"
    );

  element.addEventListener(
    "click",
    (event) => {
      const hotspot =
        event.target.closest(
          ".fruit-hotspot"
        );

      const closeButton =
        event.target.closest(
          ".fruit-modal-close"
        );

      const backdrop =
        event.target.closest(
          ".fruit-modal-backdrop"
        );

      if (hotspot) {
        const product = getProduct(
          hotspot.dataset.fruitId
        );

        openModal(
          element,
          product
        );

        return;
      }

      if (
        closeButton ||
        backdrop
      ) {
        closeModal(element);
      }
    }
  );

  window.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        state.isModalOpen
      ) {
        closeModal(element);
      }
    }
  );
};

/* ======================================================
   UPDATE HOTSPOTS
   ====================================================== */

export const updateFruitHotspots = ({
  element,
  progress = 0,
}) => {
  if (!element) return;

  ensureContent(element);

  const cueIn = smoothstep(
    FRUIT_HOTSPOT_IN_START,
    FRUIT_HOTSPOT_IN_FULL,
    progress
  );

  const cueOut = smoothstep(
    FRUIT_HOTSPOT_OUT_START,
    FRUIT_HOTSPOT_OUT_END,
    progress
  );

  const opacity =
    cueIn *
    (1 - cueOut);

  const isVisible =
    opacity > 0.01 ||
    state.isModalOpen;

  element.style.opacity =
    isVisible
      ? "1"
      : "0";

  element.style.visibility =
    isVisible
      ? "visible"
      : "hidden";

  element.style.pointerEvents =
    state.isModalOpen ||
    opacity > 0.55
      ? "auto"
      : "none";

  element.setAttribute(
    "aria-hidden",
    isVisible
      ? "false"
      : "true"
  );

  const scene =
    element.querySelector(
      ".fruit-hotspot-scene"
    );

  if (scene) {
    const sceneY =
      (1 - cueIn) * 12 +
      cueOut * -8;

    const sceneBlur =
      (1 - cueIn) * 5 +
      cueOut * 5;

    scene.style.opacity =
      opacity.toFixed(3);

    scene.style.transform =
      `translate3d(
        0,
        ${sceneY.toFixed(2)}px,
        0
      )`;

    scene.style.filter =
      `blur(${sceneBlur.toFixed(
        2
      )}px)`;
  }

  const hotspots =
    element.querySelectorAll(
      ".fruit-hotspot"
    );

  hotspots.forEach(
    (hotspot, index) => {
      const itemStart =
        FRUIT_HOTSPOT_IN_START +
        index * 0.0022;

      const itemEnd =
        Math.min(
          itemStart + 0.016,
          FRUIT_HOTSPOT_IN_FULL
        );

      const itemIn =
        smoothstep(
          itemStart,
          itemEnd,
          progress
        );

      const itemOut =
        smoothstep(
          FRUIT_HOTSPOT_OUT_START +
            index * 0.0006,
          FRUIT_HOTSPOT_OUT_END,
          progress
        );

      const itemOpacity =
        clamp(
          itemIn *
            (1 - itemOut),
          0,
          1
        );

      const itemY =
        (1 - itemIn) * 14 +
        itemOut * -8;

      const itemScale =
        0.965 +
        itemIn * 0.035 -
        itemOut * 0.025;

      hotspot.style.opacity =
        itemOpacity.toFixed(3);

      hotspot.style.visibility =
        itemOpacity > 0.02
          ? "visible"
          : "hidden";

      hotspot.style.transform =
        `translate3d(
          -50%,
          calc(-50% + ${itemY.toFixed(
            2
          )}px),
          0
        )
        scale(${itemScale.toFixed(
          3
        )})`;
    }
  );
};