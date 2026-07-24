import { smoothstep } from "../utils/animation.js";
import {
  OEM_CONTACT_START_PROGRESS,
  OEM_CONTACT_FULL_PROGRESS,
  OEM_CONTACT_EXIT_START_PROGRESS,
  OEM_CONTACT_EXIT_END_PROGRESS,
} from "../config/timing.js";

// OEM timing
// 95.0% = เริ่มแสดง หลัง certificate fade out จบที่ 94.6%
// 96.2% = ชัดเต็ม
// 97.6% = เริ่มเลื่อนออก เพื่อส่งต่อกล่องขวาให้ Contact
// 98.6% = หายสนิท
const ensureOemContactContent = (element) => {
  if (!element || element.dataset.oemContactReady === "true") return;

  element.dataset.oemContactReady = "true";
  element.classList.add("oem-contact-cue");

  element.innerHTML = `
    <section class="oem-contact-scene" aria-label="OEM and private label">
      <article class="oem-contact-copy oem-right-card">
        <p class="oem-contact-kicker">
          <span></span>
          OEM & PRIVATE LABEL
        </p>

        <h2>
          Create Your
          <span>Own Brand Today!</span>
        </h2>

        <p class="oem-contact-lead">
          From concept, formulation, packaging, and production to export-ready
          support, CHUA helps bring Thai fruit product ideas to market.
        </p>

        <div class="oem-contact-service-list" aria-label="OEM services">
          <article>
            <span>01</span>
            <strong>Product Development</strong>
            <p>Concept, formulation, product direction, and market-ready planning.</p>
          </article>

          <article>
            <span>02</span>
            <strong>Custom OEM</strong>
            <p>Custom flavors, cuts, packaging, private label, and production.</p>
          </article>

          <article>
            <span>03</span>
            <strong>Export Support</strong>
            <p>Sourcing, documentation, logistics, and shipment coordination.</p>
          </article>
        </div>
      </article>
    </section>
  `;
};

export const updateOemContactCue = ({ element, progress = 0 }) => {
  if (!element) return;

  ensureOemContactContent(element);

  const cueIn = smoothstep(
    OEM_CONTACT_START_PROGRESS,
    OEM_CONTACT_FULL_PROGRESS,
    progress
  );

  const cueOut = smoothstep(
    OEM_CONTACT_EXIT_START_PROGRESS,
    OEM_CONTACT_EXIT_END_PROGRESS,
    progress
  );

  const opacity = cueIn * (1 - cueOut);

  const x = (1 - cueIn) * 34 + cueOut * 42;
  const y = (1 - cueIn) * 16 + cueOut * -22;
  const scale = 0.986 + cueIn * 0.014 - cueOut * 0.014;
  const blur = (1 - cueIn) * 4 + cueOut * 6;

  element.style.opacity = opacity.toFixed(3);
  element.style.visibility = opacity > 0.01 ? "visible" : "hidden";
  element.style.pointerEvents = opacity > 0.8 ? "auto" : "none";
  element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(
    2
  )}px, 0) scale(${scale.toFixed(3)})`;
  element.style.filter = `blur(${blur.toFixed(2)}px)`;

  element.style.setProperty("--oem-contact-in", cueIn.toFixed(3));
  element.style.setProperty("--oem-contact-out", cueOut.toFixed(3));
  element.style.setProperty("--oem-contact-opacity", opacity.toFixed(3));
};
