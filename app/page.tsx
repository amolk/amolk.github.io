import Link from 'next/link';
import { allProjects } from 'contentlayer/generated';
import ProjectCard from '@/components/ProjectCard';

export default function Home() {
  const featured = allProjects
    .filter((p) => p.featured)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero */}
      <section className="mb-20">
        <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-6 text-balance">
          Building AI systems, agent infrastructure, and the occasional theory of consciousness.
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl font-light">
          15 years across semantic programming, multi-agent systems, predictive coding,
          and shipped products. Currently building <Link href="/projects/karta/" className="underline">Karta</Link>,
          {' '}<Link href="/projects/agent-callstack/" className="underline">the agent call stack</Link>,
          and <Link href="/projects/carapace-intelligence/" className="underline">Carapace Intelligence</Link>.
        </p>
      </section>

      {/* Featured */}
      <section className="mb-20">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-2xl font-medium">Featured projects</h2>
          <Link href="/projects/" className="text-sm text-muted-foreground hover:text-foreground">
            All projects →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {featured.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>
    </div>
  );
}
