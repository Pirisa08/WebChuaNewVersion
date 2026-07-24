import { smoothstep } from "../utils/animation.js";
import {
  LINEUP_BRIDGE_IN_START,
  LINEUP_BRIDGE_IN_FULL,
  LINEUP_BRIDGE_EXIT_START,
  LINEUP_BRIDGE_EXIT_END,
} from "../config/timing.js";

// Our House Brands timing
// 56% = เริ่มเข้า
// 60% = ชัดเต็ม
// 83% = เริ่มค่อย ๆ หาย
// 85% = หายสนิท
//
// รอบนี้ไม่ย่อ ไม่ compact แล้ว
// ให้ headline อยู่ที่เดิมยาว ๆ ตามที่ต้องการ
export const updateLineupHeader = ({ element, progress }) => {
  if (!element) return;

  const fadeIn = smoothstep(
    LINEUP_BRIDGE_IN_START,
    LINEUP_BRIDGE_IN_FULL,
    progress
  );
  const exit = smoothstep(
    LINEUP_BRIDGE_EXIT_START,
    LINEUP_BRIDGE_EXIT_END,
    progress
  );

  const opacity = fadeIn * (1 - exit);
  const y = (1 - fadeIn) * 18 + exit * -10;
  const blur = (1 - fadeIn) * 8 + exit * 8;
  const scale = 1;

  element.style.opacity = opacity.toFixed(3);
  element.style.visibility = opacity > 0.01 ? "visible" : "hidden";
  element.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
  element.style.filter = `blur(${blur.toFixed(2)}px)`;

  // ใช้เฉพาะ headline bridge
  element.style.setProperty("--lineup-main-title-opacity", "0");
  element.style.setProperty("--lineup-bridge-title-opacity", opacity.toFixed(3));
  element.style.setProperty("--lineup-bridge-title-y", "0px");
  element.style.setProperty("--lineup-bridge-title-scale", scale.toFixed(3));

  // ปิด copy/tag เก่า เพื่อไม่ให้ทับกับสินค้า
  element.style.setProperty("--lineup-copy-opacity", "0");
  element.style.setProperty("--lineup-tags-opacity", "0");
  element.style.setProperty("--lineup-inner-scale", "1");
  element.style.setProperty("--lineup-inner-y", "0px");

  element.classList.toggle("is-bridge", opacity > 0.08);
  element.classList.remove("is-compact");
};
