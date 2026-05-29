import Link from 'next/link';
import { allProjects } from 'contentlayer/generated';
import ProjectCard from '@/components/ProjectCard';

export default function Home() {
  const featured = allProjects
    .filter((p) => p.featured)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <div className="max-w-6xl mx-auto px-8">
      {/* Hero */}
      <section className="min-h-[85vh] flex items-center pt-24">
        <div className="space-y-8 max-w-4xl">
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-tight text-balance">
            AI systems, agent infrastructure, and the occasional theory of consciousness.
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light max-w-3xl leading-relaxed">
            Currently building <Link href="/projects/karta/" className="underline underline-offset-4 hover:text-black">Karta</Link>,{' '}
            <Link href="/projects/agent-callstack/" className="underline underline-offset-4 hover:text-black">the agent call stack</Link>, and{' '}
            <Link href="/projects/carapace-intelligence/" className="underline underline-offset-4 hover:text-black">Carapace Intelligence</Link>.
            A 25-year arc from cortical neural networks at UT Austin, through a decade
            on Microsoft InfoPath, founder roles, and conversational AI at Got It —
            to today&apos;s agent infrastructure and a slow-burning research program
            on consciousness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/projects/" className="px-8 py-3 bg-black text-white rounded-full text-base font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 inline-block text-center">
              Browse all projects
            </Link>
            <Link href="/timeline/" className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full text-base font-medium hover:border-black hover:text-black transition-all duration-300 inline-block text-center">
              See timeline
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif text-3xl md:text-4xl font-medium">Featured</h2>
          <Link href="/projects/" className="text-sm text-gray-500 hover:text-black transition-colors">
            All projects →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {featured.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>
    </div>
  );
}
