import { withContentlayer } from 'next-contentlayer2';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  outputFileTracingRoot: __dirname,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  trailingSlash: true,
  // Silence webpack's infrastructure cache warnings (a benign dynamic-import
  // notice from @contentlayer2/core); real build errors still surface.
  webpack: (config) => {
    config.infrastructureLogging = { level: 'error' };
    return config;
  },
};

export default withContentlayer(nextConfig);
