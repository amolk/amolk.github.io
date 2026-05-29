import { allProjects } from 'contentlayer/generated';
import ProjectCard from '@/components/ProjectCard';

const CATEGORIES: { key: string; label: string }[] = [
  { key: 'flagship', label: 'Flagship' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'research', label: 'Research' },
  { key: 'startup', label: 'Startups' },
  { key: 'tool', label: 'Tools & utilities' },
  { key: 'older', label: 'Older work' },
];

export default function ProjectsIndex() {
  const groups = CATEGORIES.map(({ key, label }) => ({
    key, label,
    projects: allProjects
      .filter((p) => p.category === key)
      .sort((a, b) => (b.year_started ?? '').localeCompare(a.year_started ?? '')),
  })).filter((g) => g.projects.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl font-medium mb-3">All projects</h1>
      <p className="text-muted-foreground mb-12">{allProjects.length} projects total.</p>

      {groups.map((g) => (
        <section key={g.key} className="mb-14">
          <h2 className="font-serif text-2xl font-medium mb-5">{g.label}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {g.projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
