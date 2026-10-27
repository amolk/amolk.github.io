// The shared shell is static. Enhance only the current-date timeline and zoom.
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
  const maxYear = new Date(max).getFullYear();
  // Include year ticks even when a page is opened years after its build.
  timeline.querySelectorAll("[data-year]").forEach((node) => node.remove());
  for (let year = minYear; year <= maxYear; year++) {
    const left = `${percent(new Date(year, 0, 1).getTime())}%`;
    const label = document.createElement("div");
    label.className = "timeline-year-label";
    label.dataset.year = String(year);
    label.style.left = left;
    label.textContent = year;
    labels.append(label);
    const line = document.createElement("div");
    line.className = "timeline-year-line";
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
  // Fit both axes initially. Zoom enlarges the chart, not the surrounding page.
  const scroller = timeline.querySelector("[data-timeline-scroll]");
  const chart = timeline.querySelector(".timeline-chart");
  const body = timeline.querySelector(".timeline-body");
  const axis = timeline.querySelector(".timeline-axis");
  const controls = timeline.querySelector("[data-timeline-zoom]");
  const zoomIn = controls.querySelector("[data-timeline-zoom-in]");
  const zoomOut = controls.querySelector("[data-timeline-zoom-out]");
  const level = controls.querySelector("[data-timeline-zoom-level]");
  const yearLabels = [...labels.children];
  const yearLines = [...lines.querySelectorAll("[data-year]")];
  let zoom = 1;
  const details = timeline.closest("details");
  // Keep the view with this history entry, including when Back reloads the page.
  // A fresh visit gets its own entry and still starts with the complete chart.
  const saveView = () => {
    history.replaceState(
      {
        ...history.state,
        timelineView: {
          zoom,
          left: scroller.scrollLeft,
          top: scroller.scrollTop,
        },
      },
      "",
    );
  };

  const updateYears = () => {
    if (!labels.clientWidth) return;
    const yearWidth = labels.clientWidth / (maxYear - minYear || 1);
    const step = [1, 2, 5, 10, 20, 50].find((n) => n * yearWidth >= 40) || 50;
    const lastPosition =
      (Number.parseFloat(yearLabels.at(-1).style.left) / 100) *
      labels.clientWidth;
    yearLabels.forEach((label, index) => {
      const position =
        (Number.parseFloat(label.style.left) / 100) * labels.clientWidth;
      const endpoint = index === 0 || index === yearLabels.length - 1;
      const visible =
        endpoint ||
        (Number(label.dataset.year) % step === 0 &&
          position >= 40 &&
          lastPosition - position >= 40);
      label.hidden = !visible;
      yearLines[index].hidden = !visible;
    });
  };

  const localPoint = (clientX, clientY) => {
    if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return center();
    const rect = scroller.getBoundingClientRect();
    return {
      x: clientX - rect.left - scroller.clientLeft,
      y: clientY - rect.top - scroller.clientTop,
    };
  };
  const center = () => ({
    x: (scroller.clientWidth + axis.firstElementChild.offsetWidth) / 2,
    y: (scroller.clientHeight + axis.offsetHeight) / 2,
  });
  const anchorAt = (point) => ({
    x:
      (scroller.scrollLeft + point.x - axis.firstElementChild.offsetWidth) /
      labels.clientWidth,
    y: (scroller.scrollTop + point.y - axis.offsetHeight) / body.clientHeight,
  });
  const setZoom = (value, point = center(), anchor = anchorAt(point)) => {
    zoom = Math.min(8, Math.max(1, value));
    timeline.style.setProperty("--timeline-zoom", zoom);
    timeline.toggleAttribute("data-zoomed", zoom > 1);
    scroller.scrollLeft =
      zoom === 1
        ? 0
        : axis.firstElementChild.offsetWidth +
          anchor.x * labels.clientWidth -
          point.x;
    scroller.scrollTop =
      zoom === 1
        ? 0
        : axis.offsetHeight + anchor.y * body.clientHeight - point.y;
    level.value = `${Math.round(zoom * 100)}%`;
    zoomOut.disabled = zoom === 1;
    zoomIn.disabled = zoom === 8;
    updateYears();
  };
  const restoreView = () => {
    const view = history.state?.timelineView;
    if (!view || ![view.zoom, view.left, view.top].every(Number.isFinite))
      return;
    setZoom(view.zoom);
    scroller.scrollLeft = Math.max(0, view.left);
    scroller.scrollTop = Math.max(0, view.top);
  };
  restoreView();
  window.addEventListener("pagehide", saveView);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) restoreView();
  });
  zoomIn.addEventListener("click", () => setZoom(zoom * 1.5));
  zoomOut.addEventListener("click", () => setZoom(zoom / 1.5));
  controls
    .querySelector("[data-timeline-fit]")
    .addEventListener("click", () => setZoom(1));
  controls.hidden = false;

  // Trackpad pinch arrives as a control-wheel gesture in Chromium and Firefox.
  scroller.addEventListener(
    "wheel",
    (event) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? scroller.clientHeight
            : 1);
      setZoom(
        zoom * Math.exp(-delta * 0.01),
        localPoint(event.clientX, event.clientY),
      );
    },
    { passive: false },
  );

  // Keep native one-finger panning; take over only a two-finger pinch.
  let pinch = null;
  const touchGesture = (touches) => ({
    distance: Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY,
    ),
    point: localPoint(
      (touches[0].clientX + touches[1].clientX) / 2,
      (touches[0].clientY + touches[1].clientY) / 2,
    ),
  });
  scroller.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 2) return;
      event.preventDefault();
      const gesture = touchGesture(event.touches);
      pinch = { ...gesture, zoom, anchor: anchorAt(gesture.point) };
    },
    { passive: false },
  );
  scroller.addEventListener(
    "touchmove",
    (event) => {
      if (!pinch || event.touches.length !== 2) return;
      event.preventDefault();
      const gesture = touchGesture(event.touches);
      setZoom(
        (pinch.zoom * gesture.distance) / (pinch.distance || 1),
        gesture.point,
        pinch.anchor,
      );
    },
    { passive: false },
  );
  const endPinch = () => {
    pinch = null;
  };
  scroller.addEventListener("touchend", endPinch);
  scroller.addEventListener("touchcancel", endPinch);

  // Safari on macOS exposes trackpad pinch through gesture events instead.
  if ("ongesturestart" in window) {
    let gestureZoom = 1;
    scroller.addEventListener("gesturestart", (event) => {
      event.preventDefault();
      gestureZoom = zoom;
    });
    scroller.addEventListener("gesturechange", (event) => {
      event.preventDefault();
      if (!pinch)
        setZoom(
          gestureZoom * event.scale,
          localPoint(event.clientX, event.clientY),
        );
    });
    scroller.addEventListener("gestureend", (event) => event.preventDefault());
  }

  const observer = new ResizeObserver(updateYears);
  observer.observe(labels);
  details.addEventListener("toggle", () => {
    if (details.open) updateYears();
  });
  updateYears();
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
