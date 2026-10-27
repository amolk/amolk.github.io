// Progressive enhancements: all collections and project content work without JS.
const projectIndex = document.querySelector("[data-project-index]");
if (projectIndex) {
  const input = projectIndex.querySelector("input[type=search]");
  const cards = [...projectIndex.querySelectorAll("[data-project-card]")];
  const groups = [...projectIndex.querySelectorAll("[data-project-group]")];
  const indexed = cards.map((card) => ({
    card,
    text: `${card.textContent} ${card.dataset.projectKeywords}`.toLocaleLowerCase(),
  }));
  const count = projectIndex.querySelector("[data-project-count]");
  const empty = projectIndex.querySelector("[data-project-empty]");
  const timeline = projectIndex.querySelector("#timeline");
  const filter = () => {
    const words = input.value
      .trim()
      .toLocaleLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    let matches = 0;
    for (const { card, text } of indexed) {
      card.hidden = !words.every((word) => text.includes(word));
      if (!card.hidden) matches++;
    }
    for (const group of groups)
      group.hidden = !group.querySelector("[data-project-card]:not([hidden])");
    count.textContent = `${matches} ${words.length ? "matching " : ""}${matches === 1 ? "entry" : "entries"}`;
    empty.hidden = matches > 0;
  };
  projectIndex.querySelector("[data-project-search]").hidden = false;
  input.addEventListener("input", filter);
  projectIndex
    .querySelector("[data-search-clear]")
    .addEventListener("click", () => {
      input.value = "";
      filter();
      input.focus();
    });
  // Category links always lead to the complete category, even after a search.
  projectIndex.querySelectorAll(".portfolio-index-nav a").forEach((link) =>
    link.addEventListener("click", () => {
      input.value = "";
      filter();
      if (link.hash === "#timeline") timeline.open = true;
    }),
  );
  filter();
  const openTimeline = () => {
    if (window.location.hash === "#timeline") timeline.open = true;
  };
  openTimeline();
  window.addEventListener("hashchange", openTimeline);
}

const publications = document.querySelector("[data-publications]");
if (publications) {
  const entries = [...publications.querySelectorAll("[data-publication-type]")];
  const years = [...publications.querySelectorAll("[data-publication-year]")];
  const buttons = [
    ...publications.querySelectorAll("[data-publication-filter]"),
  ];
  const count = publications.querySelector("[data-publication-count]");
  const filter = (type) => {
    let matches = 0;
    for (const entry of entries) {
      entry.hidden = type !== "all" && entry.dataset.publicationType !== type;
      if (!entry.hidden) matches++;
    }
    for (const year of years)
      year.hidden = !year.querySelector(
        "[data-publication-type]:not([hidden])",
      );
    for (const button of buttons)
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.publicationFilter === type),
      );
    count.textContent = `${matches} ${type === "all" ? "publications" : type === "paper" ? "papers" : "patents"}`;
  };
  publications.querySelector("[data-publication-controls]").hidden = false;
  for (const button of buttons)
    button.addEventListener("click", () =>
      filter(button.dataset.publicationFilter),
    );
  filter("all");
}

// Authored explainers own their sections. Derive navigation from their actual IDs.
const explainer = document.querySelector(".case-explainer .ex");
if (explainer) {
  const sections = [...explainer.querySelectorAll(".ex-section[id]")];
  if (sections.length > 1) {
    const navigation = document.createElement("nav");
    navigation.className = "case-jump-nav";
    navigation.setAttribute("aria-label", "On this page");
    for (const section of sections) {
      const heading = section.querySelector("h2");
      if (!heading) continue;
      const link = document.createElement("a");
      link.href = `#${section.id}`;
      link.textContent = heading.textContent;
      navigation.append(link);
    }
    sections[0].before(navigation);
  }
}
