// Compare art directions with ?direction=folds|canopy|horizon|amber.
// Add &palette=cool to compare against the original blue-grey treatment.
// Resolve before the stylesheet paints; preload only the selected artwork.
(() => {
  const artworks = {
    folds: "/images/home/folded-light.webp",
    canopy: "/images/home/living-systems-blue.webp",
    horizon: "/images/home/open-horizon.webp",
    amber: "/images/home/amber-study.webp",
  };
  const warmArtworks = {
    folds: "/images/home/folded-light-warm.webp",
    canopy: "/images/home/living-systems-warm.webp",
  };
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("direction");
  const direction = Object.hasOwn(artworks, requested) ? requested : "canopy";
  const palette = params.get("palette") === "cool" ? "cool" : "warm";
  document.documentElement.dataset.direction = direction;
  document.documentElement.dataset.palette = palette;
  const preload = document.createElement("link");
  preload.rel = "preload";
  preload.as = "image";
  preload.href =
    (palette === "warm" && warmArtworks[direction]) || artworks[direction];
  preload.fetchPriority = "high";
  document.head.append(preload);
})();
