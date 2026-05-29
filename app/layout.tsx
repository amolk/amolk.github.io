import type { Metadata } from 'next';
import './globals.css';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';
import siteMetadata from '@/data/siteMetadata';

export const metadata: Metadata = {
  title: { default: siteMetadata.title, template: `%s — ${siteMetadata.title}` },
  description: siteMetadata.description,
  metadataBase: new URL(siteMetadata.siteUrl),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
