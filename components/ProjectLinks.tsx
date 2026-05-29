import { siGithub } from 'simple-icons';
import { ExternalLink, FileText, Package, Store, Apple } from 'lucide-react';
import type { Project } from 'contentlayer/generated';

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d={siGithub.path} />
  </svg>
);

interface LinkSpec {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function ProjectLinks({ project }: { project: Project }) {
  const links: LinkSpec[] = [];

  if (project.is_public && project.repo_url) {
    const slug = project.repo_url.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').replace(/\/$/, '');
    links.push({ href: project.repo_url, label: slug, icon: <GitHubIcon className="w-4 h-4" /> });
  }
  if (project.demo_url) links.push({ href: project.demo_url, label: 'Demo', icon: <ExternalLink className="w-4 h-4" /> });
  if (project.paper_url) links.push({ href: project.paper_url, label: 'Paper', icon: <FileText className="w-4 h-4" /> });
  if (project.pypi_url) links.push({ href: project.pypi_url, label: 'PyPI', icon: <Package className="w-4 h-4" /> });
  if (project.npm_url) links.push({ href: project.npm_url, label: 'npm', icon: <Package className="w-4 h-4" /> });
  if (project.marketplace_url) links.push({ href: project.marketplace_url, label: 'Marketplace', icon: <Store className="w-4 h-4" /> });
  if (project.app_store_url) links.push({ href: project.app_store_url, label: 'App Store', icon: <Apple className="w-4 h-4" /> });

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700 hover:border-black hover:text-black transition-colors"
        >
          {l.icon}
          <span>{l.label}</span>
        </a>
      ))}
    </div>
  );
}
