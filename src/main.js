import "./styles/index.css";
import "./styles/fruitHotspots.css";
import "./styles/mobile-scenes.css";
import "./styles/premium-typography.css";
import "./styles/brand-section-spacing.css";
import "./styles/mobile-layout-correction.css";
import "./styles/nav-framed.css";
import "./styles/intro-text-position.css";
import "./styles/fruit-hotspot-label-layout.css";
import "./styles/scene-watermark-hidden.css";
import "./styles/mobile-about-composition.css";
import "./styles/mobile-fruit-detail-polish.css";
import "./styles/mobile-certificate-premium.css";

import logoUrl from "./assets/Logo Chua.png";

import { clamp } from "./utils/animation.js";
import { VIDEO_SCROLL_KEYFRAMES } from "./config/timing.js";
import { getResponsiveScene } from "./config/responsiveScenes.js";

import { updateAmbientBackground } from "./effects/ambientBackground.js";
import { updateIntroLogo } from "./effects/introLogo.js";
import { updateAboutText } from "./effects/aboutText.js";
import { updateFruitHotspots } from "./effects/fruitHotspots.js";
import { updateLineupHeader } from "./effects/lineupHeader.js";
import { updateBrandShowcase } from "./effects/brandShowcase.js";
import { updateBrandNameCue } from "./effects/brandNameCue.js";
import { updateProductBrandLabels } from "./effects/productBrandLabels.js";
import { updateCertificateCue } from "./effects/certificate.js";
import { updateOemContactCue } from "./effects/oemContactCue.js";
import { updateContactCue } from "./effects/contactCue.js";

import "./effects/topNav.js";
import "./effects/scrollIntroCue.js";

// ======================================================
// ELEMENTS
// ======================================================

const stage =
  document.querySelector(
    ".scrub-stage"
  );

const stickyFrame =
  document.querySelector(
    ".sticky-frame"
  );

const video =
  document.querySelector(
    ".hero-video"
  );

const progressBar =
  document.querySelector(
    "#progressBar"
  );

const scrollPercent =
  document.querySelector(
    "#scrollPercent"
  );

const introLogo =
  document.querySelector(
    "#introLogo"
  );

const introLogoGroup =
  document.querySelector(
    "#introLogoGroup"
  );

const introAboutText =
  document.querySelector(
    "#introAboutText"
  );

const fruitHotspots =
  document.querySelector(
    "#fruitHotspots"
  );

const lineupHeader =
  document.querySelector(
    "#lineupHeader"
  );

const brandShowcase =
  document.querySelector(
    "#brandShowcase"
  );

const brandNameCue =
  document.querySelector(
    "#brandNameCue"
  );

const productBrandLabels =
  document.querySelector(
    "#productBrandLabels"
  );

const certificateCue =
  document.querySelector(
    "#certificateCue"
  );

const oemContactCue =
  document.querySelector(
    "#oemContactCue"
  );

const contactCue =
  document.querySelector(
    "#contactCue"
  );

// ======================================================
// RESPONSIVE VIDEO
// ======================================================

const MOBILE_VIDEO_QUERY =
  "(max-width: 767px) and (orientation: portrait)";

const mobileVideoMedia =
  window.matchMedia(
    MOBILE_VIDEO_QUERY
  );

const initialVideoFrame =
  0.04;

const getPreferredVideoMode =
  () =>
    mobileVideoMedia.matches
      ? "mobile"
      : "desktop";

const getVideoUrl = (
  mode
) => {
  const scene =
    getResponsiveScene(
      mode
    );

  return (
    `${import.meta.env.BASE_URL}` +
    `${scene.video}`
  );
};

// ======================================================
// STATE
// ======================================================

let duration = 1;

let targetTime = 0;

let displayedTime = 0;

let scrollProgress = 0;

let hasMetadata = false;

let renderQueued = false;

let currentVideoMode =
  null;

let videoLoadToken = 0;

let resizeTimer = null;

let isFruitDetailOpen =
  false;

let frozenFruitVideoTime =
  0;

let frozenFruitScrollProgress =
  0;

let scrollUpdateQueued =
  false;

let stageTop =
  0;

let stageScrollable =
  1;

// ======================================================
// SEEK SETTINGS
// ======================================================

/*
 * จำกัดการสั่ง Seek ประมาณ 25 ครั้งต่อวินาที
 * ป้องกัน Browser รับคำสั่ง currentTime ซ้อนกัน
 */

const SEEK_MIN_INTERVAL =
  33;

/*
 * ถ้า Scroll ข้ามมากกว่า 0.65 วินาที
 * ให้เฟรมกระโดดตามทันที
 */

const FAST_JUMP_DISTANCE =
  0.65;

/*
 * ระยะกลาง ใช้ความเร็วตามเฟรมสูงขึ้น
 */

const MEDIUM_JUMP_DISTANCE =
  0.18;

const SEEK_EPSILON =
  0.025;

let lastSeekRequestAt =
  0;

let pendingSeekTime =
  null;

// ======================================================
// VIDEO SETUP
// ======================================================

const setupVideoAttributes =
  () => {
    if (!video) {
      return;
    }

    video.muted = true;

    video.defaultMuted =
      true;

    video.playsInline =
      true;

    video.preload =
      "auto";

    video.autoplay =
      false;

    video.loop =
      false;

    video.controls =
      false;

    video.disablePictureInPicture =
      true;

    video.setAttribute(
      "muted",
      ""
    );

    video.setAttribute(
      "playsinline",
      ""
    );

    video.setAttribute(
      "webkit-playsinline",
      ""
    );

    video.setAttribute(
      "preload",
      "auto"
    );

    video.setAttribute(
      "disablepictureinpicture",
      ""
    );
  };

const setVideoMode = (
  mode
) => {
  currentVideoMode =
    mode;

  document.documentElement
    .dataset
    .videoMode =
    mode;

  if (!video) {
    return;
  }

  video.classList.toggle(
    "is-mobile-video",
    mode === "mobile"
  );

  video.classList.toggle(
    "is-desktop-video",
    mode === "desktop"
  );
};

// ======================================================
// OVERLAYS
// ======================================================

const updateOverlayState =
  () => {
    const mode =
      currentVideoMode ??
      getPreferredVideoMode();

    const scene =
      getResponsiveScene(
        mode
      );

    updateAmbientBackground({
      element:
        stickyFrame,

      progress:
        scrollProgress,
    });

    updateIntroLogo({
      element:
        introLogoGroup,

      progress:
        scrollProgress,
    });

    updateAboutText({
      element:
        introAboutText,

      time:
        displayedTime,

      progress:
        scrollProgress,

      mode,
    });

    updateFruitHotspots({
      element:
        fruitHotspots,

      progress:
        scrollProgress,

      mode,

      scene,
    });

    updateLineupHeader({
      element:
        lineupHeader,

      time:
        displayedTime,

      progress:
        scrollProgress,
    });

    updateProductBrandLabels({
      element:
        productBrandLabels,

      progress:
        scrollProgress,

      mode,

      scene,
    });

    updateBrandNameCue({
      element:
        brandNameCue,

      progress:
        scrollProgress,
    });

    updateBrandShowcase({
      element:
        brandShowcase,

      time:
        displayedTime,

      progress:
        scrollProgress,

      mode,

      scene,
    });

    updateCertificateCue({
      element:
        certificateCue,

      progress:
        scrollProgress,
    });

    updateOemContactCue({
      element:
        oemContactCue,

      progress:
        scrollProgress,
    });

    updateContactCue({
      element:
        contactCue,

      progress:
        scrollProgress,
    });
  };

// ======================================================
// RENDER QUEUE
// ======================================================

const scheduleRender =
  () => {
    if (renderQueued) {
      return;
    }

    renderQueued =
      true;

    requestAnimationFrame(
      render
    );
  };

// ======================================================
// BASIC PAGE SETUP
// ======================================================

if (introLogo) {
  introLogo.src =
    logoUrl;
}

if (
  "scrollRestoration" in
  window.history
) {
  window.history
    .scrollRestoration =
    "manual";
}

// ======================================================
// SCROLL PROGRESS
// ======================================================

const getScrollProgress =
  () => {
    if (!stage) {
      return 0;
    }

    if (
      stageScrollable <= 0
    ) {
      return 0;
    }

    return clamp(
      (
        window.scrollY -
        stageTop
      ) /
        stageScrollable,

      0,

      1
    );
  };

const measureStage =
  () => {
    if (!stage) {
      stageTop = 0;
      stageScrollable = 1;

      return;
    }

    const rect =
      stage
        .getBoundingClientRect();

    stageTop =
      window.scrollY +
      rect.top;

    stageScrollable =
      Math.max(
        stage.offsetHeight -
          window.innerHeight,

        1
      );
  };

const updateProgressUi =
  () => {
    if (progressBar) {
      progressBar
        .style
        .transform =
        `scaleX(${scrollProgress})`;
    }

    if (scrollPercent) {
      scrollPercent
        .textContent =
        `${Math.round(
          scrollProgress *
          100
        )}%`;
    }
  };

// ======================================================
// SCROLL TO VIDEO TIMELINE
// ======================================================

const getVideoProgress = (
  progress
) => {
  const normalizedProgress =
    clamp(
      progress,
      0,
      1
    );

  for (
    let index = 1;

    index <
    VIDEO_SCROLL_KEYFRAMES
      .length;

    index += 1
  ) {
    const [
      previousScroll,
      previousVideo,
    ] =
      VIDEO_SCROLL_KEYFRAMES[
        index - 1
      ];

    const [
      nextScroll,
      nextVideo,
    ] =
      VIDEO_SCROLL_KEYFRAMES[
        index
      ];

    if (
      normalizedProgress <=
      nextScroll
    ) {
      const segmentLength =
        nextScroll -
        previousScroll;

      const localProgress =
        segmentLength > 0
          ? (
              normalizedProgress -
              previousScroll
            ) /
            segmentLength
          : 0;

      return (
        previousVideo +
        (
          nextVideo -
          previousVideo
        ) *
          localProgress
      );
    }
  }

  return (
    VIDEO_SCROLL_KEYFRAMES
      .at(-1)[1]
  );
};

const getTimeFromScrollProgress =
  (
    progress,

    videoDuration =
      duration
  ) => {
    const mappedProgress =
      getVideoProgress(
        progress
      );

    return clamp(
      mappedProgress *
        videoDuration,

      0,

      Math.max(
        videoDuration -
          0.01,

        0
      )
    );
  };

// ======================================================
// SEEK MANAGER
// latest request wins
// ======================================================

const getSafeVideoTime = (
  time
) =>
  clamp(
    Number.isFinite(
      time
    )
      ? time
      : 0,

    0,

    Math.max(
      duration - 0.01,
      0
    )
  );

const requestVideoSeek = (
  time,

  {
    force = false,
  } = {}
) => {
  if (
    !video ||
    !hasMetadata
  ) {
    return;
  }

  const safeTime =
    getSafeVideoTime(
      time
    );

  /*
   * จำเฉพาะตำแหน่งล่าสุด
   * คำสั่งก่อนหน้าที่ไม่ทันจะถูกทิ้ง
   */

  pendingSeekTime =
    safeTime;

  /*
   * Browser กำลังถอดรหัสเฟรมเดิม
   * รอ seeked แล้วค่อยไปคำสั่งล่าสุด
   */

  if (
    video.seeking &&
    !force
  ) {
    return;
  }

  const now =
    performance.now();

  if (
    !force &&
    now -
      lastSeekRequestAt <
      SEEK_MIN_INTERVAL
  ) {
    return;
  }

  if (
    Math.abs(
      video.currentTime -
      safeTime
    ) <=
    SEEK_EPSILON
  ) {
    pendingSeekTime =
      null;

    return;
  }

  const nextTime =
    pendingSeekTime;

  pendingSeekTime =
    null;

  lastSeekRequestAt =
    now;

  try {
    video.currentTime =
      nextTime;
  } catch (error) {
    pendingSeekTime =
      nextTime;

    console.warn(
      "[CHUA] Video seek was skipped.",
      error
    );
  }
};

const flushPendingVideoSeek =
  () => {
    if (
      pendingSeekTime ===
        null ||
      !video ||
      !hasMetadata ||
      video.seeking
    ) {
      return;
    }

    requestVideoSeek(
      pendingSeekTime,

      {
        force: true,
      }
    );
  };

// ======================================================
// LOAD / SWITCH VIDEO
// ======================================================

const loadResponsiveVideo =
  ({
    mode =
      getPreferredVideoMode(),

    preserveTimeline =
      true,

    resetScroll =
      false,
  } = {}) => {
    if (!video) {
      return;
    }

    const nextMode =
      mode === "mobile"
        ? "mobile"
        : "desktop";

    const nextUrl =
      getVideoUrl(
        nextMode
      );

    if (
      currentVideoMode ===
        nextMode &&
      video.getAttribute(
        "src"
      ) === nextUrl &&
      hasMetadata
    ) {
      return;
    }

    const preservedScrollProgress =
      resetScroll
        ? 0
        : preserveTimeline
          ? getScrollProgress()
          : scrollProgress;

    const loadToken =
      ++videoLoadToken;

    hasMetadata =
      false;

    pendingSeekTime =
      null;

    setVideoMode(
      nextMode
    );

    document.documentElement
      .classList
      .add(
        "is-video-switching"
      );

    const handleLoadedMetadata =
      () => {
        if (
          loadToken !==
          videoLoadToken
        ) {
          return;
        }

        duration =
          video.duration ||
          1;

        hasMetadata =
          true;

        if (
          resetScroll
        ) {
          window.scrollTo(
            0,
            0
          );
        }

        scrollProgress =
          clamp(
            preservedScrollProgress,
            0,
            1
          );

        const nextTime =
          scrollProgress <=
          0.0001
            ? Math.min(
                initialVideoFrame,

                Math.max(
                  duration -
                    0.01,

                  0
                )
              )
            : getTimeFromScrollProgress(
                scrollProgress,

                duration
              );

        targetTime =
          nextTime;

        displayedTime =
          nextTime;

        if (
          isFruitDetailOpen
        ) {
          frozenFruitScrollProgress =
            scrollProgress;

          frozenFruitVideoTime =
            nextTime;
        }

        requestVideoSeek(
          nextTime,

          {
            force: true,
          }
        );

        video.pause();

        updateProgressUi();

        updateOverlayState();

        document.documentElement
          .classList
          .remove(
            "is-video-switching"
          );

        document.documentElement
          .classList
          .add(
            "is-ready"
          );

        scheduleRender();

        console.info(
          `[CHUA] ${nextMode} video ready: ${nextUrl}`
        );
      };

    const handleVideoError =
      () => {
        if (
          loadToken !==
          videoLoadToken
        ) {
          return;
        }

        document.documentElement
          .classList
          .remove(
            "is-video-switching"
          );

        /*
         * มือถือโหลดไม่ได้
         * ให้ใช้ Desktop แทน
         */

        if (
          nextMode ===
          "mobile"
        ) {
          console.warn(
            "[CHUA] Mobile video could not be loaded. Falling back to desktop video."
          );

          loadResponsiveVideo({
            mode:
              "desktop",

            preserveTimeline:
              true,

            resetScroll:
              false,
          });

          return;
        }

        console.error(
          `[CHUA] Video could not be loaded: ${nextUrl}`
        );
      };

    video.addEventListener(
      "loadedmetadata",

      handleLoadedMetadata,

      {
        once: true,
      }
    );

    video.addEventListener(
      "error",

      handleVideoError,

      {
        once: true,
      }
    );

    video.src =
      nextUrl;

    video.load();
  };

// ======================================================
// FRUIT DETAIL FREEZE
// ======================================================

window.addEventListener(
  "fruit-detail:open",

  () => {
    if (
      isFruitDetailOpen
    ) {
      return;
    }

    isFruitDetailOpen =
      true;

    frozenFruitVideoTime =
      displayedTime;

    frozenFruitScrollProgress =
      scrollProgress;

    targetTime =
      frozenFruitVideoTime;

    displayedTime =
      frozenFruitVideoTime;

    if (
      video &&
      hasMetadata
    ) {
      video.pause();

      requestVideoSeek(
        frozenFruitVideoTime,

        {
          force: true,
        }
      );
    }
  }
);

window.addEventListener(
  "fruit-detail:close",

  () => {
    isFruitDetailOpen =
      false;

    scrollProgress =
      frozenFruitScrollProgress;

    displayedTime =
      frozenFruitVideoTime;

    targetTime =
      getTimeFromScrollProgress(
        frozenFruitScrollProgress
      );

    requestVideoSeek(
      frozenFruitVideoTime,

      {
        force: true,
      }
    );

    updateProgressUi();

    updateOverlayState();

    scheduleRender();
  }
);

// ======================================================
// UPDATE TARGET FROM SCROLL
// ======================================================

const updateTarget =
  () => {
    scrollUpdateQueued =
      false;

    if (
      isFruitDetailOpen
    ) {
      targetTime =
        frozenFruitVideoTime;

      displayedTime =
        frozenFruitVideoTime;

      if (
        video &&
        hasMetadata &&
        Math.abs(
          video.currentTime -
          frozenFruitVideoTime
        ) >
          0.01
      ) {
        requestVideoSeek(
          frozenFruitVideoTime,

          {
            force: true,
          }
        );
      }

      return;
    }

    scrollProgress =
      getScrollProgress();

    if (
      hasMetadata
    ) {
      targetTime =
        getTimeFromScrollProgress(
          scrollProgress
        );

      /*
       * Scroll ข้ามไกล
       * ให้เฟรมตามทันที
       */

      if (
        Math.abs(
          targetTime -
          displayedTime
        ) >
        FAST_JUMP_DISTANCE
      ) {
        displayedTime =
          targetTime;

        requestVideoSeek(
          displayedTime
        );
      }
    }

    updateProgressUi();

    updateOverlayState();

    scheduleRender();
  };

const scheduleTargetUpdate =
  () => {
    if (scrollUpdateQueued) {
      return;
    }

    scrollUpdateQueued =
      true;

    requestAnimationFrame(
      updateTarget
    );
  };

// ======================================================
// ADAPTIVE RENDER
// ======================================================

function render(
  now =
    performance.now()
) {
  renderQueued =
    false;

  if (
    isFruitDetailOpen
  ) {
    displayedTime =
      frozenFruitVideoTime;

    targetTime =
      frozenFruitVideoTime;

    if (
      video &&
      hasMetadata &&
      Math.abs(
        video.currentTime -
        frozenFruitVideoTime
      ) >
        0.01
    ) {
      requestVideoSeek(
        frozenFruitVideoTime,

        {
          force: true,
        }
      );
    }

    return;
  }

  const difference =
    targetTime -
    displayedTime;

  const distance =
    Math.abs(
      difference
    );

  /*
   * ระยะไกล:
   * กระโดดตาม Scroll ทันที
   *
   * ระยะกลาง:
   * เคลื่อนตามเร็ว
   *
   * ระยะใกล้:
   * เคลื่อนนุ่ม
   */

  if (
    distance >
    FAST_JUMP_DISTANCE
  ) {
    displayedTime =
      targetTime;
  } else {
    const followStrength =
      distance >
      MEDIUM_JUMP_DISTANCE
        ? 0.46
        : 0.24;

    displayedTime +=
      difference *
      followStrength;
  }

  if (
    video &&
    hasMetadata &&
    Number.isFinite(
      displayedTime
    )
  ) {
    if (
      now -
        lastSeekRequestAt >=
      SEEK_MIN_INTERVAL
    ) {
      requestVideoSeek(
        displayedTime
      );
    } else {
      pendingSeekTime =
        getSafeVideoTime(
          displayedTime
        );
    }
  }

  if (
    Math.abs(
      targetTime -
      displayedTime
    ) >
    0.018
  ) {
    scheduleRender();
  }
}

// ======================================================
// RESET
// ======================================================

const resetToTop =
  () => {
    window.scrollTo(
      0,
      0
    );

    targetTime =
      0;

    displayedTime =
      0;

    scrollProgress =
      0;

    isFruitDetailOpen =
      false;

    frozenFruitVideoTime =
      0;

    frozenFruitScrollProgress =
      0;

    pendingSeekTime =
      null;

    lastSeekRequestAt =
      0;

    document.documentElement
      .classList
      .remove(
        "is-fruit-modal-open"
      );

    if (
      video &&
      hasMetadata
    ) {
      const safeInitialTime =
        Math.min(
          initialVideoFrame,

          Math.max(
            duration -
              0.01,

            0
          )
        );

      targetTime =
        safeInitialTime;

      displayedTime =
        safeInitialTime;

      requestVideoSeek(
        safeInitialTime,

        {
          force: true,
        }
      );
    }

    updateProgressUi();

    updateOverlayState();

    scheduleRender();
  };

// ======================================================
// VIDEO EVENTS
// ======================================================

if (video) {
  video.addEventListener(
    "seeked",

    flushPendingVideoSeek
  );

  video.addEventListener(
    "canplay",

    () => {
      video.pause();
    }
  );

  video.addEventListener(
    "play",

    () => {
      video.pause();
    }
  );
}

// ======================================================
// RESPONSIVE EVENTS
// ======================================================

const handleResponsiveVideoChange =
  () => {
    const preferredMode =
      getPreferredVideoMode();

    if (
      preferredMode ===
      currentVideoMode
    ) {
      updateTarget();

      return;
    }

    loadResponsiveVideo({
      mode:
        preferredMode,

      preserveTimeline:
        true,

      resetScroll:
        false,
    });
  };

if (
  typeof mobileVideoMedia
    .addEventListener ===
  "function"
) {
  mobileVideoMedia
    .addEventListener(
      "change",

      handleResponsiveVideoChange
    );
} else {
  mobileVideoMedia
    .addListener(
      handleResponsiveVideoChange
    );
}

// ======================================================
// WINDOW EVENTS
// ======================================================

window.addEventListener(
  "scroll",

  scheduleTargetUpdate,

  {
    passive: true,
  }
);

window.addEventListener(
  "resize",

  () => {
    window.clearTimeout(
      resizeTimer
    );

    resizeTimer =
      window.setTimeout(
        () => {
          measureStage();

          handleResponsiveVideoChange();

          scheduleTargetUpdate();
        },

        160
      );
  }
);

window.addEventListener(
  "orientationchange",

  () => {
    window.setTimeout(
      () => {
        measureStage();

        handleResponsiveVideoChange();
      },

      180
    );
  }
);

window.addEventListener(
  "pageshow",

  () => {
    requestAnimationFrame(
      () => {
        const preferredMode =
          getPreferredVideoMode();

        if (
          preferredMode !==
          currentVideoMode
        ) {
          loadResponsiveVideo({
            mode:
              preferredMode,

            preserveTimeline:
              false,

            resetScroll:
              true,
          });
        } else {
          resetToTop();
        }
      }
    );
  }
);

// ======================================================
// INITIAL LOAD
// ======================================================

setupVideoAttributes();

measureStage();

loadResponsiveVideo({
  mode:
    getPreferredVideoMode(),

  preserveTimeline:
    false,

  resetScroll:
    true,
});

updateTarget();

requestAnimationFrame(
  () => {
    document.documentElement
      .classList
      .add(
        "is-ready"
      );

    scheduleRender();
  }
);

console.info(
  "[CHUA] Responsive desktop/mobile adaptive video scrub loaded"
);

document.documentElement
  .dataset
  .chuaPatch =
  "responsive-adaptive-video-scrub";
