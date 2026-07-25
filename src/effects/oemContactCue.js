import { smoothstep } from "../utils/animation.js";

import {
  OEM_CONTACT_START_PROGRESS,
  OEM_CONTACT_FULL_PROGRESS,
  OEM_CONTACT_EXIT_START_PROGRESS,
  OEM_CONTACT_EXIT_END_PROGRESS,
} from "../config/timing.js";

/* ======================================================
   OEM CONTENT
   ====================================================== */

const ensureOemContactContent = (
  element
) => {
  if (
    !element ||
    element.dataset
      .oemContactReady ===
      "true"
  ) {
    return;
  }

  element.dataset.oemContactReady =
    "true";

  element.classList.add(
    "oem-contact-cue"
  );

  element.innerHTML = `
    <section
      class="oem-contact-scene"
      aria-label="OEM and private label"
    >
      <article
        class="oem-contact-copy oem-right-card"
      >
        <div class="oem-contact-heading">
          <p class="oem-contact-kicker">
            <span aria-hidden="true"></span>
            OEM &amp; PRIVATE LABEL
          </p>

          <h2>
            Create Your
            <span>Own Brand Today!</span>
          </h2>

          <p class="oem-contact-lead">
            From concept, formulation, packaging,
            and production to export-ready support,
            CHUA helps bring Thai fruit product
            ideas to market.
          </p>
        </div>

        <div
          class="oem-contact-service-list"
          aria-label="OEM services"
        >
          <article>
            <span>01</span>

            <strong>
              Product Development
            </strong>

            <p>
              Concept, formulation, product direction,
              and market-ready planning.
            </p>
          </article>

          <article>
            <span>02</span>

            <strong>
              Custom OEM
            </strong>

            <p>
              Custom flavors, cuts, packaging,
              private label, and production.
            </p>
          </article>

          <article>
            <span>03</span>

            <strong>
              Export Support
            </strong>

            <p>
              Sourcing, documentation, logistics,
              and shipment coordination.
            </p>
          </article>
        </div>
      </article>
    </section>
  `;
};

/* ======================================================
   UPDATE OEM
   ====================================================== */

export const updateOemContactCue = ({
  element,
  progress = 0,
}) => {
  if (!element) {
    return;
  }

  ensureOemContactContent(
    element
  );

  const cueIn =
    smoothstep(
      OEM_CONTACT_START_PROGRESS,
      OEM_CONTACT_FULL_PROGRESS,
      progress
    );

  const cueOut =
    smoothstep(
      OEM_CONTACT_EXIT_START_PROGRESS,
      OEM_CONTACT_EXIT_END_PROGRESS,
      progress
    );

  const opacity =
    cueIn *
    (1 - cueOut);

  const x =
    (1 - cueIn) *
      24 +
    cueOut *
      26;

  const y =
    (1 - cueIn) *
      14 +
    cueOut *
      -14;

  const scale =
    0.99 +
    cueIn *
      0.01 -
    cueOut *
      0.01;

  const blur =
    (1 - cueIn) *
      4 +
    cueOut *
      5;

  element.style.opacity =
    opacity.toFixed(3);

  element.style.visibility =
    opacity > 0.01
      ? "visible"
      : "hidden";

  /*
   * สำคัญ:
   * Overlay ห้ามดัก Wheel หรือ Touch Scroll
   */
  element.style.pointerEvents =
    "none";

  element.style.transform = `
    translate3d(
      ${x.toFixed(2)}px,
      ${y.toFixed(2)}px,
      0
    )
    scale(
      ${scale.toFixed(3)}
    )
  `;

  element.style.filter = `
    blur(
      ${blur.toFixed(2)}px
    )
  `;

  element.setAttribute(
    "aria-hidden",
    opacity > 0.01
      ? "false"
      : "true"
  );

  element.style.setProperty(
    "--oem-contact-in",
    cueIn.toFixed(3)
  );

  element.style.setProperty(
    "--oem-contact-out",
    cueOut.toFixed(3)
  );

  element.style.setProperty(
    "--oem-contact-opacity",
    opacity.toFixed(3)
  );
};