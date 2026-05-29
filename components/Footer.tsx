import Link from 'next/link';
import siteMetadata from '@/data/siteMetadata';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-muted-foreground flex flex-col sm:flex-row justify-between gap-3">
        <div>© {new Date().getFullYear()} {siteMetadata.author}</div>
        <div className="flex gap-4">
          <Link href={siteMetadata.github}>GitHub</Link>
          <Link href={siteMetadata.linkedin}>LinkedIn</Link>
          <Link href={`mailto:${siteMetadata.email}`}>Email</Link>
        </div>
      </div>
    </footer>
  );
}
