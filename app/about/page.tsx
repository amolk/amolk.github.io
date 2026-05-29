import Link from 'next/link';
import { allProjects } from 'contentlayer/generated';

export const metadata = {
  title: 'About',
  description: 'About Amol Kelkar — researcher, founder-engineer, builder of AI systems.',
};

const PUBLICATIONS = [
  { title: 'Autonomous conversational AI system without any configuration', year: 2025, venue: 'US Patent 12,282,743', citations: 26 },
  { title: 'Towards automatic evaluation of task-oriented dialogue flows', year: 2024, venue: 'arXiv:2411.10416' },
  { title: 'KULCQ: An Unsupervised Keyword-based Utterance Level Clustering Quality Metric', year: 2024, venue: 'arXiv:2411.09853' },
  { title: 'Cognitive Homeostatic Agents', year: 2021, venue: 'AAMAS 2021', citations: 5 },
  { title: 'Bertrand-DR: Improving Text-to-SQL using a Discriminative Re-ranker', year: 2020, venue: 'arXiv:2002.00557', citations: 34, link: 'https://arxiv.org/abs/2002.00557' },
  { title: 'Scaling self-organizing maps to model large cortical networks', year: 2004, venue: 'Neuroinformatics 2(3)', citations: 45 },
  { title: 'Modeling large cortical networks with growing self-organizing maps', year: 2002, venue: 'Neurocomputing 44', citations: 33 },
];

export default function About() {
  const total = allProjects.length;
  const flagshipSlugs = allProjects.filter((p) => p.featured).map((p) => p.slug);

  return (
    <article className="max-w-3xl mx-auto px-8 pt-24 pb-16 project-content">
      <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-3">About</h1>

      <p>
        I&apos;m Amol Kelkar — <strong>Enterprise AI Architect at{' '}
        <a href="https://www.qualtrics.com">Qualtrics</a></strong> (Redmond, WA). Every
        project here started as something I couldn&apos;t stop thinking about. Some grew
        into companies (Aflatune was acquired by Dhingana; Got It AI grew around{' '}
        <a href="https://arxiv.org/abs/2002.00557">Bertrand-DR</a>). Some became papers —{' '}
        <Link href="/projects/homeostasis-publications/">the homeostatic theory of consciousness</Link>,{' '}
        Cognitive Homeostatic Agents,{' '}
        <Link href="/projects/carapace-intelligence/">the Decision Intelligence formalization</Link>.
        Some are still small things I&apos;m pulling on. Right now the foreground is{' '}
        <Link href="/projects/karta/">Karta</Link>,{' '}
        <Link href="/projects/agent-callstack/">the agent call stack</Link>, and{' '}
        <Link href="/projects/carapace-intelligence/">Carapace Intelligence</Link>.
      </p>

      <p>
        The arc began at <strong>UT Austin (1998–2000)</strong>, modeling large cortical
        networks with growing self-organizing maps under{' '}
        <a href="https://www.cs.utexas.edu/~risto/">Risto Miikkulainen</a> and{' '}
        <a href="https://homepages.inf.ed.ac.uk/jbednar/">Jim Bednar</a>. Then a decade at{' '}
        <strong>Microsoft</strong> on the InfoPath / Office Forms platform — most of the
        ten US patents on my CV come from that era. A stretch of founder roles came next
        — Aflatune (acquired by Dhingana), then ventures acquired by uZoom and Biproxy.
        Then ~5 years at <strong>Got It AI</strong> leading research and engineering on
        conversational systems and text-to-SQL parsing —{' '}
        <a href="https://arxiv.org/abs/2002.00557">Bertrand-DR</a>, the autonomous
        conversational AI patent, and follow-ons. Now at <strong>Qualtrics</strong>,
        building enterprise AI infrastructure.
      </p>

      <p>
        In the last two years I&apos;ve shipped or written: the{' '}
        <Link href="/projects/playbooks/">Playbooks</Link> semantic-programming runtime,
        the agent call stack as <code>unwind-labs/callstack</code> + <code>unwind</code>{' '}
        on PyPI, the{' '}
        <Link href="/projects/carapace-intelligence/">Decision Intelligence</Link> and
        Game Complexity papers, a{' '}
        <Link href="/projects/fly/">connectome-based fly simulator</Link>, the{' '}
        <Link href="/projects/crazydisk/">CrazyDisk</Link> Mac app, and a{' '}
        <Link href="/projects/homeostasis-publications/">homeostatic theory of consciousness</Link>.
        The portfolio here covers all of it — {total} projects, browsable on the{' '}
        <Link href="/projects/">projects page</Link> or as a{' '}
        <Link href="/timeline/">timeline</Link>.
      </p>

      <h2>Now</h2>
      <ul>
        <li><Link href="/projects/karta/">Karta</Link> — multi-agent orchestration on top of Claude Code / OpenCode</li>
        <li><Link href="/projects/agent-callstack/">agent-callstack</Link> + <Link href="/projects/agent-callstack-unwind/">unwind</Link> — the call-stack primitive for sub-agent context; <a href="https://pypi.org/project/unwind-labs/">PyPI</a></li>
        <li><Link href="/projects/carapace-intelligence/">Carapace Intelligence</Link> — decision-intelligence infra with an LLM-as-environment-model framing</li>
        <li><Link href="/projects/harness-programming/">Harness Programming</Link> — book in progress on the new sub-discipline of harness work</li>
      </ul>

      <h2>Selected publications and patents</h2>
      <ul>
        {PUBLICATIONS.map((p) => (
          <li key={p.title}>
            {p.link ? <a href={p.link}>{p.title}</a> : <span>{p.title}</span>}
            {' '}<span className="text-gray-500">— {p.venue}, {p.year}{p.citations ? `, ${p.citations} citations` : ''}</span>
          </li>
        ))}
      </ul>
      <p>
        Full list on{' '}
        <a href="https://scholar.google.com/citations?user=qKZ2VRAAAAAJ&hl=en">
          Google Scholar
        </a>{' '}
        (~485 citations, h-index 12, i10-index 12).
      </p>

      <h2>Education</h2>
      <ul>
        <li><strong>The University of Texas at Austin</strong> (1998–2000) — graduate research on biologically realistic large-scale cortical network models</li>
        <li><strong>University of Pune</strong> (1993–1997) — BE Computer Engineering, Summa Cum Laude</li>
      </ul>

      <h2>Contact</h2>
      <p>
        <a href="mailto:kelkar.amol@gmail.com">kelkar.amol@gmail.com</a> ·{' '}
        <a href="https://github.com/amolk">GitHub</a> ·{' '}
        <a href="https://www.linkedin.com/in/amol-kelkar/">LinkedIn</a> ·{' '}
        <a href="https://scholar.google.com/citations?user=qKZ2VRAAAAAJ&hl=en">Google Scholar</a>
      </p>
    </article>
  );
}
