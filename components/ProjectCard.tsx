import Link from 'next/link';
import { Project } from 'contentlayer/generated';

export default function ProjectCard({ project }: { project: Project }) {
  const years = project.year_started
    + (project.year_ended && project.year_ended !== project.year_started ? `–${project.year_ended}` : '');
  return (
    <Link
      href={project.url}
      className="block group p-6 rounded-2xl border border-gray-200 hover:border-gray-400 hover:bg-white transition-all duration-300"
    >
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h3 className="font-serif text-xl font-medium group-hover:underline underline-offset-4">{project.title}</h3>
        <span className="text-xs text-gray-400 whitespace-nowrap font-light">{years}</span>
      </div>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{project.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{project.status}</span>
        {project.tags.slice(0, 3).map((t) => (
          <span key={t} className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{t}</span>
        ))}
      </div>
    </Link>
  );
}
