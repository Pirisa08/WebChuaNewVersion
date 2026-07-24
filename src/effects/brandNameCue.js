export const updateBrandNameCue = ({ element }) => {
  if (!element) return;

  // ปิด House Brand Portfolio cue ทั้งหมด
  // เพื่อไม่ให้กล่องใหญ่และรายชื่อแบรนด์ขึ้นมาทับกับสินค้า / detail brand
  element.style.opacity = "0";
  element.style.visibility = "hidden";
  element.style.pointerEvents = "none";
  element.style.transform = "translate3d(0, 0, 0)";
  element.style.filter = "blur(0px)";
  element.style.display = "none";

  element.classList.remove("is-changing");
};
