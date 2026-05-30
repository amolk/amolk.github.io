import { notFound } from 'next/navigation';
import Link from 'next/link';
import { allProjects } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer2/hooks';
import ProjectLinks from '@/components/ProjectLinks';
import ZoomableImage from '@/components/ZoomableImage';
import { tagSlug } from '@/lib/tags';

export async function generateStaticParams() {
  return allProjects.filter((p) => !p.is_private).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project || project.is_private) notFound();

  const MDX = getMDXComponent(project.body.code);
  const years = project.year_started + (project.year_ended && project.year_ended !== project.year_started ? `–${project.year_ended}` : '');
  const parent = project.parent ? allProjects.find((p) => p.slug === project.parent) : undefined;
  const children = (project.subprojects || [])
    .map((s) => allProjects.find((p) => p.slug === s))
    .filter(Boolean) as typeof allProjects;

  return (
    <article className="max-w-3xl mx-auto px-8 pt-24 pb-16">
      <Link href="/projects/" className="text-sm text-gray-500 hover:text-black transition-colors">
        ← All projects
      </Link>

      <header className="mt-6 mb-10">
        {parent && (
          <div className="text-sm text-gray-500 mb-2">
            Part of {parent.is_private ? (
              <span>{parent.title}</span>
            ) : (
              <Link href={parent.url} className="underline underline-offset-2 hover:text-black">{parent.title}</Link>
            )}
          </div>
        )}
        <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-3">{project.title}</h1>
        <p className="text-xl text-gray-500 font-light mb-6 leading-tight">{project.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs mb-6">
          <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{project.status}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{years}</span>
          {project.tags.map((t) => (
            <Link key={t} href={`/tags/${tagSlug(t)}/`} className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors">{t}</Link>
          ))}
        </div>
        <ProjectLinks project={project} />
      </header>

      {project.image && (
        <div className="mb-10">
          <ZoomableImage
            src={project.image}
            alt={`${project.title} screenshot`}
            width={1600}
            height={900}
            className="rounded-2xl border border-gray-200 shadow-sm w-full h-auto"
          />
        </div>
      )}

      {project.video && (
        <div className="mb-10">
          <video controls className="rounded-2xl border border-gray-200 shadow-sm w-full">
            <source src={project.video} />
          </video>
        </div>
      )}

      <div className="project-content">
        <MDX />
      </div>

      {children.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="font-serif text-2xl font-medium mb-5">Sub-projects</h2>
          <div className="grid gap-4">
            {children.map((c) => (
              <Link
                key={c.slug}
                href={c.url}
                className="block group p-5 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <h3 className="font-serif text-lg font-medium group-hover:underline underline-offset-4">{c.title}</h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap font-light">
                    {c.year_started}{c.year_ended && c.year_ended !== c.year_started ? `–${c.year_ended}` : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-tight">{c.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {project.images && project.images.length > 0 && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {project.images.map((src) => (
            <ZoomableImage
              key={src}
              src={src}
              alt={`${project.title} screenshot`}
              width={1200}
              height={800}
              className="rounded-xl border border-gray-200 w-full h-auto"
            />
          ))}
        </div>
      )}
    </article>
  );
}
