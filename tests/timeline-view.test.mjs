import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const script = await readFile(
  new URL("../public/assets/site.js", import.meta.url),
  "utf8",
);

// Run the real browser enhancement with layout measurements and history supplied
// by the harness. A second instance represents Back without the browser cache.
function page(state = null) {
  const element = (properties = {}) => {
    const listeners = new Map();
    return {
      children: [],
      dataset: {},
      style: {},
      append(child) {
        this.children.push(child);
      },
      addEventListener(name, handler) {
        listeners.set(name, handler);
      },
      emit(name, event = {}) {
        listeners.get(name)?.(event);
      },
      ...properties,
    };
  };
  let zoom = 1;
  const details = element({ open: true });
  const scroller = element({
    clientWidth: 800,
    clientHeight: 400,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const labels = element();
  Object.defineProperty(labels, "clientWidth", { get: () => 800 * zoom - 200 });
  const body = element();
  Object.defineProperty(body, "clientHeight", { get: () => 400 * zoom - 34 });
  const lines = element({ querySelectorAll: () => lines.children });
  const zoomIn = element();
  const zoomOut = element();
  const fit = element();
  const level = element({ value: "100%" });
  const controls = element({
    querySelector: (selector) =>
      ({
        "[data-timeline-zoom-in]": zoomIn,
        "[data-timeline-zoom-out]": zoomOut,
        "[data-timeline-fit]": fit,
        "[data-timeline-zoom-level]": level,
      })[selector],
  });
  const timeline = element({
    dataset: { minYear: "2025", latestEnd: "2026-01-01" },
    style: {
      setProperty(name, value) {
        if (name === "--timeline-zoom") zoom = value;
      },
    },
    toggleAttribute() {},
    closest: () => details,
    querySelectorAll: () => [],
    querySelector: (selector) =>
      ({
        "[data-year-labels]": labels,
        "[data-year-grid]": lines,
        "[data-today]": element(),
        "[data-timeline-scroll]": scroller,
        ".timeline-chart": element(),
        ".timeline-body": body,
        ".timeline-axis": {
          firstElementChild: { offsetWidth: 200 },
          offsetHeight: 34,
        },
        "[data-timeline-zoom]": controls,
      })[selector],
  });
  const history = {
    state,
    replaceState(value) {
      this.state = structuredClone(value);
    },
  };
  const window = element();
  runInNewContext(script, {
    document: {
      querySelector: () => timeline,
      querySelectorAll: () => [],
      createElement: () => element(),
    },
    window,
    history,
    ResizeObserver: class {
      observe() {}
    },
  });
  return { scroller, level, zoomIn, fit, details, history, window };
}

test("a fresh history entry fits every project initially", () => {
  const view = page();
  assert.equal(view.level.value, "100%");
  assert.equal(view.scroller.scrollLeft, 0);
  assert.equal(view.scroller.scrollTop, 0);
});

test("Back without a cached document restores zoom and both pan offsets", () => {
  const original = page({ unrelatedState: "keep" });
  original.zoomIn.emit("click");
  original.zoomIn.emit("click");
  original.scroller.scrollLeft = 615;
  original.scroller.scrollTop = 287;
  original.window.emit("pagehide");
  assert.equal(original.history.state.unrelatedState, "keep");

  const returned = page(original.history.state);
  // The initial details toggle must not reset the restored zoom to Fit.
  returned.details.emit("toggle");
  assert.equal(returned.level.value, "225%");
  assert.equal(returned.scroller.scrollLeft, 615);
  assert.equal(returned.scroller.scrollTop, 287);
  returned.fit.emit("click");
  assert.equal(returned.level.value, "100%");
  assert.equal(returned.scroller.scrollLeft, 0);
  assert.equal(returned.scroller.scrollTop, 0);
});

test("cached Back restoration restores pan and rejects invalid values", () => {
  const original = page();
  original.zoomIn.emit("click");
  original.scroller.scrollLeft = 240;
  original.window.emit("pagehide");
  original.scroller.scrollLeft = 0;
  original.window.emit("pageshow", { persisted: true });
  assert.equal(original.level.value, "150%");
  assert.equal(original.scroller.scrollLeft, 240);

  const invalid = page({ timelineView: { zoom: "bad", left: 1, top: 2 } });
  assert.equal(invalid.level.value, "100%");
  assert.equal(invalid.scroller.scrollLeft, 0);
});
