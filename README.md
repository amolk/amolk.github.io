# amolk.github.io

Personal portfolio site for [Amol Kelkar](https://github.com/amolk).

## Stack

- **Next.js 15** (static export for GitHub Pages)
- **React 19 + TypeScript**
- **Tailwind CSS + ShadCN** (tokens copied from [runplaybooks.ai](https://github.com/playbooks-ai/website) for visual consistency)
- **Contentlayer2** — typed MDX content under `data/projects/`
- Deploy via `.github/workflows/deploy.yml` → GitHub Pages

## Develop

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # static export to ./out
```

## Content

Each project is one MDX file in `data/projects/<slug>.mdx` with frontmatter:

```yaml
---
title: Karta
slug: karta
summary: One-line tagline.
status: active        # active | shipped | paused | archived | exploration
category: flagship    # flagship | shipped | research | startup | tool | older
year_started: 2025
year_ended: 2026
tags: [rails, multi-tenant, ai-agents]
repo_url: https://github.com/amolk/karta
demo_url: https://karta.example.com
featured: true
order: 1
---
```

Pages render automatically — no React changes needed to add a project.

## IA

- `/` — hero + featured projects
- `/projects/` — all projects grouped by category
- `/projects/[slug]/` — per-project deep page (from MDX)
- `/about/` — bio + contact

## Inheritance from runplaybooks.ai

Color tokens, Tailwind theme, ShadCN config, Source Serif Pro for headings.
Components are deliberately minimal — port any complex sections (HeroSection,
ShadowBox, AnimatedBackground) from the runplaybooks repo when desired.
