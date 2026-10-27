// The home page remains fully readable without these optional enhancements.
const home = document.querySelector(".home-page");
if (home) {
  const themeButton = home.querySelector("[data-theme-toggle]");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  let chosenTheme;
  try {
    chosenTheme = localStorage.getItem("portfolio-theme");
  } catch {
    /* Storage is optional. */
  }
  if (!["light", "dark"].includes(chosenTheme)) chosenTheme = null;
  const setTheme = (theme) => {
    const dark = theme === "dark";
    home.dataset.theme = dark ? "dark" : "light";
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.setAttribute(
      "aria-label",
      `Switch to ${dark ? "light" : "dark"} theme`,
    );
    document.querySelector('meta[name="theme-color"]').content =
      getComputedStyle(home).getPropertyValue("--home-surface").trim();
  };
  setTheme(chosenTheme || (systemTheme.matches ? "dark" : "light"));
  themeButton.hidden = false;
  themeButton.addEventListener("click", () => {
    chosenTheme = home.dataset.theme === "dark" ? "light" : "dark";
    setTheme(chosenTheme);
    try {
      localStorage.setItem("portfolio-theme", chosenTheme);
    } catch {
      /* Storage is optional. */
    }
  });
  systemTheme.addEventListener("change", (event) => {
    if (!chosenTheme) setTheme(event.matches ? "dark" : "light");
  });
}

// Content is visible by default. Motion is an optional, once-only enhancement.
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!motionPreference.matches && "IntersectionObserver" in window) {
  const reveals = [...document.querySelectorAll("[data-reveal]")];
  const manifesto = document.querySelector("[data-manifesto]");
  const words = [...(manifesto?.querySelectorAll(".manifesto-word") || [])];
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.3 },
  );
  const wordObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        wordObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.9, rootMargin: "0px 0px -22% 0px" },
  );
  for (const element of reveals) {
    element.classList.add("is-ready");
    revealObserver.observe(element);
  }
  if (words.length) {
    manifesto.classList.add("is-ready");
    for (const word of words) wordObserver.observe(word);
  }
  motionPreference.addEventListener("change", (event) => {
    if (!event.matches) return;
    revealObserver.disconnect();
    wordObserver.disconnect();
    for (const element of [...reveals, ...words])
      element.classList.add("is-visible");
  });
}
