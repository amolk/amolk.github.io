'use client';

import Link from 'next/link';
import { Mail, Linkedin } from 'lucide-react';
import { siGithub } from 'simple-icons';
import siteMetadata from '@/data/siteMetadata';

const Icon = ({ path, className }: { path: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d={path} />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative z-10 bg-black text-white mt-24">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold font-serif mb-4">Amol Kelkar</h3>
            <p className="text-gray-400 leading-tight">
              AI systems, agent infrastructure, semantic programming, consciousness research.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold font-serif mb-4">Explore</h3>
            <div className="space-y-2">
              <Link href="/projects/" className="block text-gray-400 hover:text-white transition-colors">All projects</Link>
              <Link href="/projects/#timeline" className="block text-gray-400 hover:text-white transition-colors">Timeline</Link>
              <Link href="/about/" className="block text-gray-400 hover:text-white transition-colors">About</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold font-serif mb-4">Elsewhere</h3>
            <div className="space-y-2">
              <a href={siteMetadata.github} className="block text-gray-400 hover:text-white transition-colors">GitHub</a>
              <a href={siteMetadata.linkedin} className="block text-gray-400 hover:text-white transition-colors">LinkedIn</a>
              <a href={`mailto:${siteMetadata.email}`} className="block text-gray-400 hover:text-white transition-colors">Email</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} {siteMetadata.author}.
          </div>
          <div className="flex space-x-6">
            <a href={siteMetadata.github} className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
              <Icon path={siGithub.path} className="w-5 h-5" />
            </a>
            <a href={siteMetadata.linkedin} className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={`mailto:${siteMetadata.email}`} className="text-gray-400 hover:text-white transition-colors" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
