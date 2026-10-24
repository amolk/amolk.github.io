# amolk.github.io

Personal portfolio for [Amol Kelkar](https://amolkelkar.me), built with Eleventy and deployed to GitHub Pages.

## Develop and verify

Use Node.js 22 or later and npm.

```bash
npm ci
npm test
npm run dev   # http://localhost:3000
npm run build # clean static output in out/, then verify every generated page
```

`npm run build` compiles Tailwind CSS, renders Nunjucks templates, and checks page routes, internal links, anchors, and media. `npm test` covers project visibility, activity sorting, the 21-day home page window, timeline dates, and Markdown extensions. The browser JavaScript preserves the pointer effects, current-date timeline, and screenshot zoom. Content and navigation render without JavaScript.

Templates live in `pages/` and `_includes/`. Data loaders in `_data/` read project Markdown and publications. Styles live in `styles/`; Source Serif 4 is self-hosted in `public/fonts/`. The existing Source Sans Pro and Source Code Pro stylesheet remains hosted by Google Fonts. If you change styles while the development server is running, run `npm run css` to rebuild the stylesheet.

## Update content

Each project is one file in `data/projects/<slug>.mdx`. The existing `.mdx` filenames remain supported; their contents use Markdown with YAML front matter, GFM, math, and syntax highlighting. Templates and browser behavior use Nunjucks and plain JavaScript.

```yaml
---
title: Example Project
slug: example-project
summary: One-line tagline.
status: active        # active | shipped | paused | archived | exploration
category: flagship   # flagship | shipped | research | professional | startup | tool | older
year_started: 2025
year_ended: 2026
tags: [rails, multi-tenant, ai-agents]
repo_url: https://github.com/amolk/example-project
is_public: true
ranges: ["2025-01-10:2025-03-02", "2026-04-01:2026-05-15"]
---
```

Projects generate `/projects/<slug>/` pages and `/tags/<tag>/` indexes. Set `is_private: true` to omit a project from public pages, or `hide_from_index: true` to keep its detail page while hiding its card. Parent projects can list `subprojects`. Store images, videos, and other downloadable files in `public/` to preserve their URLs.

The home page shows two to six cards based on activity in the last 21 days. A parent card includes its subprojects' activity. The deploy workflow rebuilds daily to keep that selection current. `node scripts/sync-from-wiki.mjs` still syncs flagship status from the local wiki; use `--check` to report drift without changing files.

Edit publications in `data/publications.json`, site metadata in `_data/site.json`, and biography text in `pages/about.njk`.

## Deploy

`.github/workflows/deploy.yml` runs tests and builds on pushes to `main`, on the daily schedule, and through **Run workflow**. It uploads `out/` and deploys through GitHub Pages. In the repository's **Settings → Pages**, keep the source set to **GitHub Actions** and the custom domain set to `amolkelkar.me`. `public/CNAME` preserves that domain in the output. Existing domain DNS settings remain in use.

## Migration verification

The Eleventy migration preserves the original Next.js build at commit `7fc38db`: 132 HTML files, 40 public assets, and 60 project sources. After building, run this optional check against that original snapshot:

```bash
node scripts/verify-build.mjs --migration
```

The fixture checks titles, descriptions, Open Graph metadata, visible text, links, media, anchors, and original file hashes. Normal builds validate current content; the historical fixture is expected to differ after intentional content changes.
