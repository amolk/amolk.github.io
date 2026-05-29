import { notFound } from 'next/navigation';
import Link from 'next/link';
import { allProjects } from 'contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer2/hooks';

export async function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  const MDX = useMDXComponent(project.body.code);

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/projects/" className="text-sm text-muted-foreground hover:text-foreground">
        ← All projects
      </Link>

      <header className="mt-6 mb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-3">{project.title}</h1>
        <p className="text-lg text-muted-foreground mb-6">{project.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{project.status}</span>
          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {project.year_started}{project.year_ended && project.year_ended !== project.year_started ? `–${project.year_ended}` : ''}
          </span>
          {project.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
          ))}
        </div>
        <div className="mt-5 flex gap-4 text-sm">
          {project.repo_url && <a className="underline" href={project.repo_url} target="_blank" rel="noopener">GitHub</a>}
          {project.demo_url && <a className="underline" href={project.demo_url} target="_blank" rel="noopener">Demo</a>}
          {project.paper_url && <a className="underline" href={project.paper_url} target="_blank" rel="noopener">Paper</a>}
        </div>
      </header>

      <div className="prose prose-neutral max-w-none">
        <MDX />
      </div>
    </article>
  );
}
