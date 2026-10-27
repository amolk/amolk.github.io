import { projectSections } from "./lib/projectSections.mjs";

export default function (config) {
  config.addPassthroughCopy({ public: "/" });
  config.addWatchTarget("data");
  config.addWatchTarget("lib");
  config.addFilter("socialIcon", (svg) => svg.replace("w-4 h-4", "w-5 h-5"));
  config.addFilter("take", (values, count) => values.slice(0, count));
  config.addFilter("projectSections", projectSections);
  return {
    dir: {
      input: "pages",
      includes: "../_includes",
      data: "../_data",
      output: "out",
    },
    templateFormats: ["njk"],
  };
}
