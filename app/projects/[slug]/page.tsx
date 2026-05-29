import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { allProjects } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer2/hooks';
import ProjectLinks from '@/components/ProjectLinks';

export async function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
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
  if (!project) notFound();

  const MDX = getMDXComponent(project.body.code);
  const years = project.year_started + (project.year_ended && project.year_ended !== project.year_started ? `–${project.year_ended}` : '');

  return (
    <article className="max-w-3xl mx-auto px-8 pt-24 pb-16">
      <Link href="/projects/" className="text-sm text-gray-500 hover:text-black transition-colors">
        ← All projects
      </Link>

      <header className="mt-6 mb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-3">{project.title}</h1>
        <p className="text-xl text-gray-500 font-light mb-6 leading-relaxed">{project.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs mb-6">
          <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{project.status}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{years}</span>
          {project.tags.map((t) => (
            <span key={t} className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{t}</span>
          ))}
        </div>
        <ProjectLinks project={project} />
      </header>

      {project.image && (
        <div className="mb-10">
          <Image
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

      {project.images && project.images.length > 0 && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {project.images.map((src) => (
            <Image
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
