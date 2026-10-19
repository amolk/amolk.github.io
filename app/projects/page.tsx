import { allProjects } from "contentlayer/generated";
import ProjectCard from "@/components/ProjectCard";
import Timeline from "@/components/Timeline";
import { projectIndex } from "@/lib/projectIndex";

export const metadata = {
  title: "Projects",
  description:
    "All projects, grouped by category, with a timeline across 25+ years of building.",
};

const CATEGORIES: { key: string; label: string; blurb?: string }[] = [
  {
    key: "flagship",
    label: "Flagship",
    blurb: "The biggest, most ambitious work.",
  },
  { key: "shipped", label: "Shipped", blurb: "Products in the world." },
  {
    key: "research",
    label: "Research",
    blurb: "Open questions, papers, experiments.",
  },
  {
    key: "professional",
    label: "Professional",
    blurb: "Work at Microsoft, OfficeSpace.com, and Got It AI.",
  },
  {
    key: "startup",
    label: "Startups",
    blurb: "Things I have tried to build companies around.",
  },
  { key: "tool", label: "Tools & explorations" },
  {
    key: "older",
    label: "Older work",
    blurb: "Pre-2018 Rails-era and NLP-era projects, for completeness.",
  },
];

export default function ProjectsIndex() {
  const { visible, bySlug, isHidden, cards } = projectIndex(allProjects);

  const groups = CATEGORIES.map(({ key, label, blurb }) => ({
    key,
    label,
    blurb,
    projects: cards.filter((p) => p.category === key),
  })).filter((g) => g.projects.length > 0);

  return (
    <div className="max-w-6xl mx-auto px-8 pt-24 pb-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-3">
          Projects
        </h1>
        <p className="text-gray-500 text-lg font-light">
          Living the exponential. {visible.length} projects total and counting.
          Products, research, and tooling.
        </p>
      </header>

      {/* Timeline */}
      <section id="timeline" className="mb-20 scroll-mt-24">
        <Timeline projects={visible} />
      </section>

      {groups.map((g) => (
        <section key={g.key} className="mb-16">
          <div className="mb-6">
            <h2 className="font-serif text-2xl md:text-3xl font-medium">
              {g.label}
            </h2>
            {g.blurb && (
              <p className="text-sm text-gray-500 mt-1 font-light">{g.blurb}</p>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {g.projects.map((p) => {
              const parent = p.parent ? bySlug.get(p.parent) : undefined;
              return (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  parentLabel={isHidden(parent) ? parent?.title : undefined}
                  subprojects={
                    (p.subprojects || [])
                      .map((s) => bySlug.get(s))
                      .filter(Boolean) as typeof allProjects
                  }
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
