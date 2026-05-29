import Link from 'next/link';
import { Project } from 'contentlayer/generated';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={project.url}
      className="block border border-border rounded-lg p-5 hover:border-foreground hover:shadow-sm transition group"
    >
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <h3 className="font-serif text-lg font-medium group-hover:underline">{project.title}</h3>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {project.year_started}{project.year_ended && project.year_ended !== project.year_started ? `–${project.year_ended}` : ''}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{project.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{project.status}</span>
        {project.tags.slice(0, 3).map((t) => (
          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
        ))}
      </div>
    </Link>
  );
}
