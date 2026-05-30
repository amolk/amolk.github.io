import type { Metadata } from 'next';
import { Source_Serif_4 } from 'next/font/google';
import './globals.css';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import siteMetadata from '@/data/siteMetadata';

const sourceSerifPro = Source_Serif_4({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-source-serif-pro',
});

export const metadata: Metadata = {
  title: { default: siteMetadata.title, template: `%s - ${siteMetadata.title}` },
  description: siteMetadata.description,
  metadataBase: new URL(siteMetadata.siteUrl),
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={sourceSerifPro.variable}>
      <head>
        {/* Body (Source Sans Pro) + code (Source Code Pro) fonts, matching i3ai.org/htcc */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css?family=Source+Code+Pro|Source+Sans+Pro:300,400,400i,700"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans relative min-h-screen flex flex-col">
        <AnimatedBackground />
        <TopNav />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
