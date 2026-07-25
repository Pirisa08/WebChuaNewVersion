/* ======================================================
   CHUA MOBILE UNIFIED LAYOUT

   หน้าที่:
   - ส่ง Fruit ID ให้ CSS เพื่อเปลี่ยนสีตามผลไม้
   - ส่งจำนวน Variant ให้ CSS
   - รองรับ fruitHotspots.js ทั้งเวอร์ชันเดิมและใหม่
   ====================================================== */

const getFruitModalElements = () => {
  const shell =
    document.querySelector(
      "#fruitHotspots .fruit-modal-shell"
    ) ||
    document.querySelector(
      ".fruit-modal-shell"
    );

  const grid =
    document.querySelector(
      "#fruitHotspots .fruit-variant-grid"
    ) ||
    document.querySelector(
      ".fruit-variant-grid"
    );

  return {
    shell,
    grid,
  };
};

/* ======================================================
   GET VARIANT COUNT
   ====================================================== */

const getVariantCount = (
  grid
) => {
  if (!grid) {
    return 0;
  }

  /*
   * อ่านจาก Class เช่น:
   * fruit-variant-grid-count-2
   * fruit-variant-grid-count-4
   */

  const classMatch =
    Array.from(
      grid.classList
    )
      .map((className) =>
        className.match(
          /^fruit-variant-grid-count-(\d+)$/
        )
      )
      .find(Boolean);

  if (classMatch) {
    return Number(
      classMatch[1]
    );
  }

  /*
   * กรณีไม่มี Class ให้นับ Card โดยตรง
   */

  return grid.querySelectorAll(
    ".fruit-variant"
  ).length;
};

/* ======================================================
   APPLY FRUIT MODAL DATA
   ====================================================== */

const applyFruitModalData = (
  event
) => {
  const {
    shell,
    grid,
  } =
    getFruitModalElements();

  if (!shell) {
    return;
  }

  const fruitId =
    event?.detail?.fruitId;

  const detailVariantCount =
    Number(
      event?.detail
        ?.variantCount
    );

  const detectedVariantCount =
    getVariantCount(
      grid
    );

  const variantCount =
    Number.isFinite(
      detailVariantCount
    ) &&
    detailVariantCount > 0
      ? detailVariantCount
      : detectedVariantCount;

  if (fruitId) {
    shell.dataset.fruitId =
      fruitId;
  }

  if (
    Number.isFinite(
      variantCount
    ) &&
    variantCount > 0
  ) {
    shell.dataset.variantCount =
      String(
        variantCount
      );
  }

  shell.classList.add(
    "is-unified-mobile-modal"
  );
};

/* ======================================================
   RESET FRUIT MODAL DATA
   ====================================================== */

const resetFruitModalData =
  () => {
    const {
      shell,
    } =
      getFruitModalElements();

    if (!shell) {
      return;
    }

    delete shell.dataset
      .fruitId;

    delete shell.dataset
      .variantCount;

    shell.classList.remove(
      "is-unified-mobile-modal"
    );
  };

/* ======================================================
   INITIALIZE
   ====================================================== */

const initializeMobileUnifiedLayout =
  () => {
    document.documentElement
      .classList.add(
        "has-mobile-unified-layout"
      );

    window.addEventListener(
      "fruit-detail:open",
      (event) => {
        /*
         * รอให้ fruitHotspots.js
         * สร้าง Card ให้เสร็จก่อน
         */

        requestAnimationFrame(
          () => {
            applyFruitModalData(
              event
            );
          }
        );
      }
    );

    window.addEventListener(
      "fruit-detail:close",
      resetFruitModalData
    );
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
    initializeMobileUnifiedLayout,
    {
      once: true,
    }
  );
} else {
  initializeMobileUnifiedLayout();
}