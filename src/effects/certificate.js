import { smoothstep } from "../utils/animation.js";
import {
  CERTIFICATE_START_PROGRESS,
  CERTIFICATE_FULL_PROGRESS,
  CERTIFICATE_EXIT_START_PROGRESS,
  CERTIFICATE_EXIT_END_PROGRESS,
} from "../config/timing.js";

const certificateImages = [
  {
    file: "cert-gmp.png",
    name: "GMP",
    desc: "Good Manufacturing Practice",
  },
  {
    file: "cert-haccp.png",
    name: "HACCP",
    desc: "Food Safety Control",
  },
  {
    file: "cert-brcs.png",
    name: "BRCGS",
    desc: "Food Safety Certified",
  },
  {
    file: "cert-fda.png",
    name: "Thai FDA",
    desc: "Food & Drug Administration",
  },
  {
    file: "cert-nia.png",
    name: "NIA",
    desc: "Innovation support",
  },
  {
    file: "cert-sme.png",
    name: "SME",
    desc: "Thai SME recognition",
  },
  {
    file: "cert-thai-retail.png",
    name: "Thai Retail",
    desc: "Retail network standard",
  },
  {
    file: "cert-yec.png",
    name: "YEC",
    desc: "Young Entrepreneur Chamber",
  },
];

const ensureCertificateContent = (element) => {
  if (!element || element.dataset.certificateReady === "true") return;

  element.dataset.certificateReady = "true";
  element.classList.add("certificate-cue");
  element.classList.remove("contact-cue");

  element.innerHTML = `
    <section class="certificate-scene" aria-label="Certificate and standards">
      <article class="certificate-copy-card" aria-label="Certificate message">
        <p class="certificate-kicker">
          <span></span>
          CERTIFIED QUALITY
        </p>

        <h2>
          Built on
          <span>Trust</span>
        </h2>

        <p class="certificate-lead">
          CHUA develops Thai fruit products with reliable production standards,
          food safety systems, and export-ready documentation for modern markets.
        </p>

        <div class="certificate-logo-area" aria-label="Certificate logos">
          <p class="certificate-logo-kicker">
            <span></span>
            FOOD SAFETY CERTIFICATIONS
          </p>

          <div class="certificate-logo-grid">
            ${certificateImages
              .map(
                (item) => `
                  <figure class="certificate-logo-card">
                    <div class="certificate-logo-frame">
                      <img
                        src="${import.meta.env.BASE_URL}certificate/${item.file}"
                        alt="${item.name}"
                        loading="eager"
                      />
                    </div>

                    <figcaption>
                      <strong>${item.name}</strong>
                      <span>${item.desc}</span>
                    </figcaption>
                  </figure>
                `
              )
              .join("")}
          </div>
        </div>

        <div class="certificate-copy-points" aria-label="Quality highlights">
          <div>
            <strong>Food Safety</strong>
            <span>Certified production standards for reliable manufacturing.</span>
          </div>

          <div>
            <strong>Export Ready</strong>
            <span>Documentation and production support for international markets.</span>
          </div>

          <div>
            <strong>OEM Confidence</strong>
            <span>Quality systems that support private label and brand owners.</span>
          </div>
        </div>
      </article>
    </section>
  `;
};

export const updateCertificateCue = ({ element, progress = 0 }) => {
  if (!element) return;

  ensureCertificateContent(element);

  const cueIn = smoothstep(
    CERTIFICATE_START_PROGRESS,
    CERTIFICATE_FULL_PROGRESS,
    progress
  );

  const cueOut = smoothstep(
    CERTIFICATE_EXIT_START_PROGRESS,
    CERTIFICATE_EXIT_END_PROGRESS,
    progress
  );

  const opacity = cueIn * (1 - cueOut);
  const x = (1 - cueIn) * -18 + cueOut * -14;
  const y = (1 - cueIn) * 12 + cueOut * -8;
  const scale = 0.992 + cueIn * 0.008 - cueOut * 0.008;
  const blur = (1 - cueIn) * 5 + cueOut * 6;

  element.style.opacity = opacity.toFixed(3);
  element.style.visibility = opacity > 0.01 ? "visible" : "hidden";
  element.style.pointerEvents = opacity > 0.8 ? "auto" : "none";
  element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(
    2
  )}px, 0) scale(${scale.toFixed(3)})`;
  element.style.filter = `blur(${blur.toFixed(2)}px)`;

  element.style.setProperty("--certificate-in", cueIn.toFixed(3));
  element.style.setProperty("--certificate-out", cueOut.toFixed(3));
  element.style.setProperty("--certificate-opacity", opacity.toFixed(3));
};
