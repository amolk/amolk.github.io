import { allProjects } from 'contentlayer/generated';
import Timeline from '@/components/Timeline';

export const metadata = {
  title: 'Timeline',
  description: 'Project timeline across 15+ years of building.',
};

export default function TimelinePage() {
  return (
    <div className="max-w-6xl mx-auto px-8 pt-24 pb-16">
      <header className="mb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-3">Timeline</h1>
        <p className="text-gray-500 text-lg font-light">
          {allProjects.length} projects, sorted by most recently started.
        </p>
      </header>
      <Timeline projects={allProjects} />
    </div>
  );
}
