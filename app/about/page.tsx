import Link from 'next/link';
import { allProjects } from 'contentlayer/generated';

export const metadata = {
  title: 'About',
  description: 'About Amol Kelkar — Enterprise AI Architect at Qualtrics, researcher, founder-engineer, builder of AI systems.',
};

const PUBLICATIONS = [
  { title: 'Autonomous conversational AI system without any configuration', year: 2025, venue: 'US Patent 12,282,743', citations: 26 },
  { title: 'Towards automatic evaluation of task-oriented dialogue flows', year: 2024, venue: 'arXiv:2411.10416', link: 'https://arxiv.org/abs/2411.10416' },
  { title: 'KULCQ: An Unsupervised Keyword-based Utterance Level Clustering Quality Metric', year: 2024, venue: 'arXiv:2411.09853', link: 'https://arxiv.org/abs/2411.09853' },
  { title: 'Cognitive Homeostatic Agents', year: 2021, venue: 'AAMAS 2021', citations: 5, link: 'https://aamas.csc.liv.ac.uk/Proceedings/aamas2021/pdfs/p12.pdf' },
  { title: 'Bertrand-DR: Improving Text-to-SQL using a Discriminative Re-ranker', year: 2020, venue: 'arXiv:2002.00557', citations: 34, link: 'https://arxiv.org/abs/2002.00557' },
  { title: 'Scaling self-organizing maps to model large cortical networks', year: 2004, venue: 'Neuroinformatics 2(3)', citations: 45 },
  { title: 'Modeling large cortical networks with growing self-organizing maps', year: 2002, venue: 'Neurocomputing 44', citations: 33, link: 'https://nn.cs.utexas.edu/downloads/papers/bednar.cns01.pdf' },
];

export default function About() {
  const total = allProjects.length;

  return (
    <article className="max-w-3xl mx-auto px-8 pt-24 pb-16 project-content">
      <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-3">About</h1>

      <p>
        I&apos;m Amol Kelkar — <strong>Enterprise AI Architect at{' '}
        <a href="https://www.qualtrics.com">Qualtrics</a></strong> (Seattle, WA). Every
        project here started as something I couldn&apos;t stop thinking about. Some grew
        into companies (Aflatune was acquired by Dhingana; Got It AI was acquired by
        Qualtrics). Some became papers —{' '}
        <Link href="/projects/homeostasis-publications/">the homeostatic theory of consciousness</Link>,{' '}
        <a href="https://aamas.csc.liv.ac.uk/Proceedings/aamas2021/pdfs/p12.pdf">Cognitive Homeostatic Agents</a>,{' '}
        <Link href="/projects/carapace-intelligence/">the Decision Intelligence formalization</Link>.
        Actively working on <Link href="/projects/karta/">Karta</Link>,{' '}
        <Link href="/projects/agent-callstack/">the agent call stack</Link>, and{' '}
        <Link href="/projects/carapace-intelligence/">Carapace Intelligence</Link>.
      </p>

      <p>
        The arc began at <strong>UT Austin (1998–2000)</strong>,{' '}
        <a href="https://nn.cs.utexas.edu/downloads/papers/bednar.cns01.pdf">modeling
        large cortical networks with growing self-organizing maps</a> under{' '}
        <a href="https://www.cs.utexas.edu/~risto/">Risto Miikkulainen</a> and{' '}
        <a href="https://homepages.inf.ed.ac.uk/jbednar/">Jim Bednar</a>. Then about a
        decade at <strong>Microsoft</strong> on NetDocs, InfoPath, the Office Forms
        platform, and Windows Live — several US patents come from that era. A stretch of
        founder roles came next — Aflatune (acquired by Dhingana),{' '}
        <span className="text-gray-400">[TODO]</span> (acquired by uZoom),{' '}
        <span className="text-gray-400">[TODO]</span> (acquired by Biproxy). Then ~5 years
        at <strong>Got It AI</strong> leading research and engineering on conversational
        analytics, text-to-SQL, AI agent systems, and patented autonomous conversational
        AI — including{' '}
        <a href="https://arxiv.org/abs/2002.00557">Bertrand-DR</a>. Now at{' '}
        <strong>Qualtrics</strong>, guiding the agent-native transformation of the
        company.
      </p>

      <p>
        <Link href="/projects/playbooks/"><strong>Playbooks</strong></Link>{' '}
        deserves its own callout. It&apos;s one of the first agent harnesses ever built,
        with capabilities — a durable runtime, a class-based agent model, prose-debuggable{' '}
        <code>.pb</code> programs, multi-agent threads — that mainstream systems are still
        catching up to. I ran a company around it for ~2 years, shipped 16 releases
        through v0.7.4, and sunset it in April 2026 with a public retrospective once the
        broader ecosystem (Claude Skills, etc.) converged on enough of the same ground
        that the marginal contribution dropped.
      </p>

      <p>
        I love to build, and with coding AI agents I&apos;m having an amazing time
        building at 1000× my former pace. I&apos;m rapidly building large-scale projects
        and loving the process. Right now that means{' '}
        <Link href="/projects/karta/">Karta</Link>,{' '}
        <Link href="/projects/agent-callstack/">agent-callstack</Link> +{' '}
        <Link href="/projects/agent-callstack-unwind/">unwind</Link>,{' '}
        <Link href="/projects/carapace-intelligence/">Carapace Intelligence</Link>,{' '}
        <Link href="/projects/unfold/">unfold</Link>,{' '}
        <Link href="/projects/crazydisk/">CrazyDisk</Link>,{' '}
        <Link href="/projects/crazywindows/">CrazyWindows</Link>, and{' '}
        <Link href="/projects/harness-programming/">Harness Programming</Link> (a book in
        progress) — see the <Link href="/projects/">full project list</Link> ({total}{' '}
        entries) and the <Link href="/timeline/">timeline</Link> for the rest.
      </p>

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
