export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 prose prose-neutral">
      <h1 className="font-serif">About</h1>
      <p>
        I&apos;m Amol Kelkar. I build AI systems, agent infrastructure, and the occasional
        theory of consciousness. <strong>TODO: replace this paragraph with a real bio.</strong>
      </p>
      <h2>Currently</h2>
      <ul>
        <li>Building <a href="/projects/karta/">Karta</a> — TODO</li>
        <li>Shipping <a href="/projects/agent-callstack/">the agent call stack</a> as <code>unwind-labs</code></li>
        <li>Researching <a href="/projects/carapace-intelligence/">Carapace Intelligence</a></li>
      </ul>
      <h2>Background</h2>
      <p>TODO — short timeline.</p>
      <h2>Contact</h2>
      <p>
        <a href="mailto:kelkar.amol@gmail.com">kelkar.amol@gmail.com</a> ·{' '}
        <a href="https://github.com/amolk">github.com/amolk</a>
      </p>
    </div>
  );
}
