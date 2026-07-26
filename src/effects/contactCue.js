import { smoothstep } from "../utils/animation.js";
import logoUrl from "../assets/chua-logo.avif";

import {
  CONTACT_IN_START,
  CONTACT_IN_FULL,
} from "../config/timing.js";

const ensureContactContent = (element) => {
  if (
    !element ||
    element.dataset.contactReady === "true"
  ) {
    return;
  }

  element.dataset.contactReady = "true";
  element.classList.add("contact-cue");

  element.innerHTML = `
    <section
      class="contact-scene"
      aria-label="Contact CHUA Group"
    >
      <article class="contact-copy contact-right-card">

        <!-- ==================================================
             COMPANY
             ================================================== -->

        <div class="contact-brand-block">
          <img
            class="contact-logo"
            src="${logoUrl}"
            alt="CHUA Group"
          />

          <p>
            Premium dried fruit manufacturer.<br />
            Est. 2020 · Chiang Mai, Thailand<br />
            OEM, private label &amp; bulk export for global B2B partners.
          </p>
        </div>

        <!-- ==================================================
             ADDRESS
             ================================================== -->

        <address class="contact-address-block">
          <span>Address</span>

          <strong>
            CHUA GROUP COMPANY LIMITED<br />
            181/38-39 CHANGPHUEAK ROAD<br />
            SI PHUM SUB DISTRICT<br />
            MUEANG CHIANG MAI DISTRICT<br />
            CHIANG MAI 50200<br />
            THAILAND
          </strong>
        </address>

        <!-- ==================================================
             DIRECT CONTACT
             ================================================== -->

        <div class="contact-direct-block">

          <div class="contact-detail-group">
            <span>Email</span>

            <a href="mailto:info@chuagroup.co.th">
              info@chuagroup.co.th
            </a>
          </div>

          <div class="contact-detail-group">
            <span>Phone</span>

            <a href="tel:+66885555646">
              +66 88-555-5646
            </a>
          </div>

          <!-- ==================================================
               SOCIAL LINKS
               WhatsApp / Facebook / Instagram / LinkedIn
               ================================================== -->

          <div
            class="contact-social-group"
            aria-label="Follow CHUA Group"
          >
            <span>Follow Us</span>

            <div class="contact-social-links">

              <!-- WhatsApp -->
              <a
                class="contact-social-link contact-social-whatsapp"
                href="https://wa.me/qr/CYQK3OEYDZXMJ1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact CHUA Group on WhatsApp"
                title="WhatsApp"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="currentColor"
                    d="M12.04 2a9.82 9.82 0 0 0-8.43 14.86L2 22l5.3-1.57A9.93 9.93 0 1 0 12.04 2Zm0 17.86a7.8 7.8 0 0 1-3.98-1.09l-.29-.17-3.14.93.94-3.06-.19-.31a7.72 7.72 0 1 1 6.66 3.7Zm4.23-5.79c-.23-.12-1.37-.67-1.58-.75-.21-.08-.36-.12-.52.12-.15.23-.59.75-.73.9-.13.16-.27.18-.5.06-.23-.12-.98-.36-1.86-1.15a6.93 6.93 0 0 1-1.29-1.6c-.13-.23-.01-.35.1-.47.1-.1.23-.27.35-.4.11-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.52-1.25-.71-1.71-.19-.45-.38-.39-.52-.4h-.44c-.16 0-.41.06-.62.29-.21.23-.81.79-.81 1.93 0 1.13.83 2.23.94 2.38.12.15 1.63 2.49 3.95 3.49.55.24.98.38 1.32.49.55.18 1.05.15 1.45.09.44-.07 1.37-.56 1.56-1.1.19-.54.19-1 .13-1.1-.05-.09-.21-.15-.44-.27Z"
                  />
                </svg>
              </a>

              <!-- Facebook -->
              <a
                class="contact-social-link contact-social-facebook"
                href="https://www.facebook.com/profile.php?id=61557239716245"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow CHUA Group on Facebook"
                title="Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="currentColor"
                    d="M13.7 22v-9h3l.45-3.5H13.7V7.27c0-1.01.28-1.7 1.73-1.7h1.85V2.44A24.7 24.7 0 0 0 14.59 2c-2.66 0-4.48 1.62-4.48 4.6v2.9H7.1V13h3.01v9h3.59Z"
                  />
                </svg>
              </a>

              <!-- Instagram -->
              <a
                class="contact-social-link contact-social-instagram"
                href="https://www.instagram.com/lifeatchuagroup/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow CHUA Group on Instagram"
                title="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="currentColor"
                    d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5Zm8.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
                  />
                </svg>
              </a>

              <!-- LinkedIn -->
              <a
                class="contact-social-link contact-social-linkedin"
                href="https://www.linkedin.com/company/chua-group-co-ltd/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow CHUA Group on LinkedIn"
                title="LinkedIn"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="currentColor"
                    d="M5.34 3.5A2.34 2.34 0 1 1 5.34 8.18a2.34 2.34 0 0 1 0-4.68ZM3.32 9.75h4.04V22H3.32V9.75Zm6.45 0h3.87v1.67h.05c.54-1.02 1.86-2.1 3.83-2.1 4.1 0 4.86 2.7 4.86 6.21V22h-4.03v-5.73c0-1.37-.03-3.13-1.91-3.13-1.91 0-2.2 1.49-2.2 3.03V22H9.77V9.75Z"
                  />
                </svg>
              </a>

            </div>
          </div>
        </div>
      </article>
    </section>
  `;
};

export const updateContactCue = ({
  element,
  progress = 0,
}) => {
  if (!element) return;

  ensureContactContent(element);

  const cueIn = smoothstep(
    CONTACT_IN_START,
    CONTACT_IN_FULL,
    progress
  );

  const opacity = cueIn;

  const x = (1 - cueIn) * 22;
  const y = (1 - cueIn) * 20;
  const scale = 0.974 + cueIn * 0.026;
  const blur = (1 - cueIn) * 7;

  element.style.opacity = opacity.toFixed(3);

  element.style.visibility =
    opacity > 0.01
      ? "visible"
      : "hidden";

  element.style.pointerEvents =
    opacity > 0.82
      ? "auto"
      : "none";

  element.style.transform =
    `translate3d(` +
    `${x.toFixed(2)}px, ` +
    `${y.toFixed(2)}px, 0) ` +
    `scale(${scale.toFixed(3)})`;

  element.style.filter =
    `blur(${blur.toFixed(2)}px)`;

  element.style.setProperty(
    "--contact-in",
    cueIn.toFixed(3)
  );

  element.style.setProperty(
    "--contact-out",
    "0"
  );

  element.style.setProperty(
    "--contact-opacity",
    opacity.toFixed(3)
  );
};
