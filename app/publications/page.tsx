import { publications, scholar } from "@/data/publications";

export const metadata = {
  title: "Publications",
  description:
    "Peer-reviewed papers and patents on AI systems, conversational agents, and computational neuroscience.",
};

export default function PublicationsIndex() {
  const sorted = [...publications].sort(
    (a, b) => b.year - a.year || (b.citations ?? 0) - (a.citations ?? 0),
  );

  return (
    <div className="max-w-4xl mx-auto px-8 pt-24 pb-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-3">
          Publications
        </h1>
        <p className="text-gray-500 text-lg font-light">
          Peer-reviewed papers and patents across AI systems, conversational
          agents, and computational neuroscience. Full list on{" "}
          <a
            href={scholar.url}
            className="underline underline-offset-4 hover:text-black"
          >
            Google Scholar
          </a>
          .
        </p>
      </header>

      <ol className="space-y-4">
        {sorted.map((p) => (
          <li
            key={p.title}
            className="group p-5 rounded-xl border border-gray-200 hover:border-gray-400 hover:bg-white transition-all duration-300"
          >
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h2 className="font-serif text-lg font-medium leading-snug">
                {p.link ? (
                  <a
                    href={p.link}
                    className="group-hover:underline underline-offset-4"
                  >
                    {p.title}
                  </a>
                ) : (
                  <span>{p.title}</span>
                )}
              </h2>
              <span className="text-xs text-gray-400 whitespace-nowrap font-light">
                {p.year}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-light mb-1.5">
              {p.authors}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                {p.type}
              </span>
              <span>{p.venue}</span>
              {p.citations ? (
                <span className="text-gray-400">· {p.citations} citations</span>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
