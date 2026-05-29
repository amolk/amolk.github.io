import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: `projects/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    status: { type: 'enum', options: ['active', 'shipped', 'paused', 'archived', 'exploration'], required: true },
    category: { type: 'enum', options: ['flagship', 'shipped', 'research', 'startup', 'tool', 'older'], required: true },
    year_started: { type: 'string', required: false },
    year_ended: { type: 'string', required: false },
    ranges: { type: 'list', of: { type: 'string' }, default: [] },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    repo_url: { type: 'string', required: false },
    demo_url: { type: 'string', required: false },
    paper_url: { type: 'string', required: false },
    pypi_url: { type: 'string', required: false },
    npm_url: { type: 'string', required: false },
    marketplace_url: { type: 'string', required: false },
    app_store_url: { type: 'string', required: false },
    image: { type: 'string', required: false },
    images: { type: 'list', of: { type: 'string' }, default: [] },
    video: { type: 'string', required: false },
    is_public: { type: 'boolean', default: false },
    parent: { type: 'string', required: false },
    subprojects: { type: 'list', of: { type: 'string' }, default: [] },
    hide_from_index: { type: 'boolean', default: false },
    featured: { type: 'boolean', default: false },
    order: { type: 'number', required: false },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc) => `/projects/${doc.slug}/` },
  },
}));

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Project],
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeKatex,
      [rehypePrism, { ignoreMissing: true }],
    ],
  },
});
