'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { useMouseDistanceOpacity } from '@/lib/useMouseDistanceOpacity';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/projects/', label: 'Projects' },
  { href: '/publications/', label: 'Publications' },
  { href: '/about/', label: 'About' },
];

export default function TopNav() {
  const pathname = usePathname() || '/';
  const navRef = useRef<HTMLDivElement>(null);
  const opacity = useMouseDistanceOpacity(navRef as React.RefObject<HTMLElement>, { d1: 200, d2: 400 });

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // Keep the nav fully visible on the home page; mouse-distance fade applies elsewhere.
  const effectiveOpacity = pathname === '/' ? 1 : opacity;

  return (
    <div
      ref={navRef}
      style={{ opacity: effectiveOpacity }}
      className="fixed top-0 right-0 z-50 bg-white bg-opacity-50 px-8 py-3 w-full transition-opacity duration-100 ease-out backdrop-brightness-200 pointer-events-none"
    >
      <nav className="flex justify-between items-center font-light max-w-6xl mx-auto">
        <Link
          href="/"
          className="font-serif text-lg font-medium text-black pointer-events-auto"
        >
          Amol Kelkar
        </Link>
        <div className="flex items-center space-x-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive(item.href)
                  ? 'text-black font-medium pointer-events-auto'
                  : 'text-gray-500 hover:text-black transition-colors duration-200 pointer-events-auto'
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
