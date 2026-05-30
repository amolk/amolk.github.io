import { notFound } from 'next/navigation';
import Link from 'next/link';
import { allProjects } from 'contentlayer/generated';
import ProjectCard from '@/components/ProjectCard';
import { tagSlug } from '@/lib/tags';

const visible = allProjects.filter((p) => !p.is_private);

// First display-label seen for a given slug (e.g. "agentic-ai" -> "agentic AI").
function labelFor(slug: string): string | undefined {
  for (const p of visible) {
    for (const t of p.tags) if (tagSlug(t) === slug) return t;
  }
  return undefined;
}

export function generateStaticParams() {
  const slugs = new Set<string>();
  visible.forEach((p) => p.tags.forEach((t) => slugs.add(tagSlug(t))));
  return Array.from(slugs).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const label = labelFor(tag);
  return { title: label ? `Projects tagged “${label}”` : 'Tag' };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const label = labelFor(tag);
  if (!label) notFound();

  const projects = visible
    .filter((p) => p.tags.some((t) => tagSlug(t) === tag))
    .sort((a, b) => (b.year_started ?? '').localeCompare(a.year_started ?? ''));

  return (
    <div className="max-w-6xl mx-auto px-8 pt-24 pb-16">
      <Link href="/projects/" className="text-sm text-gray-500 hover:text-black transition-colors">
        ← All projects
      </Link>

      <header className="mt-6 mb-10">
        <div className="text-sm text-gray-500 mb-2">Tag</div>
        <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight">{label}</h1>
        <p className="text-gray-500 text-lg font-light mt-2">
          {projects.length} project{projects.length === 1 ? '' : 's'}
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-5">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
