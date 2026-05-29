import Link from 'next/link';
import siteMetadata from '@/data/siteMetadata';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects/', label: 'Projects' },
  { href: '/about/', label: 'About' },
];

export default function TopNav() {
  return (
    <header className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-medium tracking-tight">
          {siteMetadata.headerTitle}
        </Link>
        <nav className="flex gap-6 text-sm">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground transition">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
