import { allProjects } from 'contentlayer/generated';
import ProjectCard from '@/components/ProjectCard';

export const metadata = {
  title: 'Projects',
  description: 'All projects, grouped by category.',
};

const CATEGORIES: { key: string; label: string; blurb?: string }[] = [
  { key: 'flagship', label: 'Flagship', blurb: 'Current focus, deepest work.' },
  { key: 'shipped', label: 'Shipped', blurb: 'Products in the world.' },
  { key: 'research', label: 'Research', blurb: 'Open questions, papers, experiments.' },
  { key: 'startup', label: 'Startups', blurb: 'Things I have tried to build companies around.' },
  { key: 'tool', label: 'Tools & explorations' },
  { key: 'older', label: 'Older work', blurb: 'Pre-2018 Rails-era and NLP-era projects, for completeness.' },
];

export default function ProjectsIndex() {
  const groups = CATEGORIES.map(({ key, label, blurb }) => ({
    key, label, blurb,
    projects: allProjects
      .filter((p) => p.category === key)
      .sort((a, b) => (b.year_started ?? '').localeCompare(a.year_started ?? '')),
  })).filter((g) => g.projects.length > 0);

  return (
    <div className="max-w-6xl mx-auto px-8 pt-24 pb-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-3">Projects</h1>
        <p className="text-gray-500 text-lg font-light">{allProjects.length} projects total — across product, research, and tooling.</p>
      </header>

      {groups.map((g) => (
        <section key={g.key} className="mb-16">
          <div className="mb-6">
            <h2 className="font-serif text-2xl md:text-3xl font-medium">{g.label}</h2>
            {g.blurb && <p className="text-sm text-gray-500 mt-1 font-light">{g.blurb}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {g.projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
