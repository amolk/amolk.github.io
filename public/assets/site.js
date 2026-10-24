// Pages work without JavaScript; these enhancements preserve pointer effects,
// the current-date timeline, and screenshot zoom.
const nav = document.querySelector("[data-nav]");
const grid = document.querySelector("[data-pointer-grid]");
const glow = document.querySelector("[data-pointer-glow]");
const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
if (nav && touch) nav.style.opacity = "1";
let pointerFrame;
window.addEventListener("mousemove", (event) => {
  cancelAnimationFrame(pointerFrame);
  pointerFrame = requestAnimationFrame(() => {
    if (grid)
      grid.style.transform = `translate(${event.clientX * 0.005}px, ${event.clientY * 0.005}px)`;
    if (glow) {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }
    if (!nav || touch || nav.dataset.home === "true") return;
    const rect = nav.getBoundingClientRect();
    const distance =
      Math.max(rect.left - event.clientX, 0, event.clientX - rect.right) +
      Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
    const t = Math.max(0, Math.min(1, (distance - 200) / 200));
    nav.style.opacity = String(
      (Math.exp(-10 * t) - Math.exp(-10)) / (1 - Math.exp(-10)),
    );
  });
});
const timeline = document.querySelector("[data-timeline]");
if (timeline) {
  const day = 86400000;
  const date = (value) => new Date(`${value}T00:00:00`).getTime();
  const minYear = Number(timeline.dataset.minYear);
  const min = new Date(minYear, 0, 1).getTime();
  const max = Math.max(Date.now(), date(timeline.dataset.latestEnd));
  const span = max - min || day;
  const percent = (ms) => ((ms - min) / span) * 100;
  const labels = timeline.querySelector("[data-year-labels]");
  const lines = timeline.querySelector("[data-year-grid]");
  // Include year ticks even when a page is opened years after its build.
  timeline.querySelectorAll("[data-year]").forEach((node) => node.remove());
  for (let year = minYear; year <= new Date(max).getFullYear(); year++) {
    const left = `${percent(new Date(year, 0, 1).getTime())}%`;
    const label = document.createElement("div");
    label.className =
      "absolute top-0 text-[10px] text-gray-400 font-light -translate-x-1/2";
    label.dataset.year = String(year);
    label.style.left = left;
    label.textContent = year;
    labels.append(label);
    const line = document.createElement("div");
    line.className = "absolute top-0 bottom-0 border-l border-gray-100";
    line.dataset.year = String(year);
    line.style.left = left;
    lines.append(line);
  }
  timeline.querySelector("[data-today]").style.left = `${percent(Date.now())}%`;
  timeline.querySelectorAll("[data-range-start]").forEach((bar) => {
    const start = date(bar.dataset.rangeStart),
      end = date(bar.dataset.rangeEnd);
    bar.style.left = `${percent(start)}%`;
    bar.style.width = `${Math.max(((end - start + day) / span) * 100, 0.4)}%`;
  });
}
document.querySelectorAll("[data-zoom]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const source = trigger.querySelector("img");
    const overlay = document.createElement("div");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", source.alt);
    overlay.className =
      "fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8 cursor-zoom-out animate-[fadeIn_0.15s_ease-out]";
    const image = document.createElement("img");
    image.src = source.src;
    image.alt = source.alt;
    image.className =
      "max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl cursor-default";
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close");
    closeButton.textContent = "×";
    closeButton.className =
      "absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white text-2xl leading-none hover:bg-white/20 transition-colors";
    const previousOverflow = document.body.style.overflow;
    const close = () => {
      overlay.remove();
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", key);
      trigger.focus();
    };
    const key = (event) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.focus();
      }
    };
    image.addEventListener("click", (event) => event.stopPropagation());
    overlay.addEventListener("click", close);
    overlay.append(image, closeButton);
    document.body.append(overlay);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", key);
    closeButton.focus();
  });
});
