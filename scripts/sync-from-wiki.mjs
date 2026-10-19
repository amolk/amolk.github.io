#!/usr/bin/env node
/**
 * Sync the "flagship" list from the wiki onto the site.
 *
 * The wiki (~/work/llm-wiki-vault) is the source of truth for flagship status:
 *
 *   flagship: true     ->  category: flagship      /projects "Flagship" group
 *
 * The home page "Top of mind" grid is not synced. The site derives it at build
 * time from each project's `ranges` (see lib/projectIndex.ts), so the wiki's
 * top-of-mind flag has no effect here.
 *
 * Usage:
 *   node scripts/sync-from-wiki.mjs           apply changes
 *   node scripts/sync-from-wiki.mjs --check   report drift, change nothing, exit 1 if any
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { homedir } from 'node:os';

const VAULT = process.env.WIKI_VAULT ?? join(homedir(), 'work/llm-wiki-vault');
const VAULT_PROJECTS = join(VAULT, 'entities/projects');
const SITE_PROJECTS = join(process.cwd(), 'data/projects');
const CHECK = process.argv.includes('--check');

const VALID_CATEGORIES = ['flagship', 'shipped', 'research', 'startup', 'tool', 'older'];

function frontmatter(text) {
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---\n', 3);
  if (end === -1) return null;
  return { body: text.slice(0, end + 5), raw: text.slice(4, end), rest: text.slice(end + 5) };
}

/** Minimal scalar reader. Only used for flags and single-value fields. */
function field(raw, key) {
  const m = raw.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : undefined;
}

function setField(raw, key, value) {
  const re = new RegExp(`^${key}:[ \\t]*.*$`, 'm');
  return re.test(raw) ? raw.replace(re, `${key}: ${value}`) : `${raw}\n${key}: ${value}`;
}

// ---- read the wiki --------------------------------------------------------
if (!existsSync(VAULT_PROJECTS)) {
  console.error(`Wiki not found at ${VAULT_PROJECTS}. Set WIKI_VAULT to override.`);
  process.exit(1);
}

const flagship = new Set();

for (const file of readdirSync(VAULT_PROJECTS).filter((f) => f.endsWith('.md'))) {
  const fm = frontmatter(readFileSync(join(VAULT_PROJECTS, file), 'utf8'));
  if (!fm) continue;
  const slug = basename(file, '.md');
  if (field(fm.raw, 'flagship') === 'true') flagship.add(slug);
}

// A flagged wiki entry with no page on the site is a silent no-op otherwise.
const missing = [...flagship].filter(
  (slug) => !existsSync(join(SITE_PROJECTS, `${slug}.mdx`)),
);
if (missing.length) {
  console.error(
    `These projects are flagged in the wiki but have no page on the site:\n` +
      missing.map((s) => `  ${s}  (expected data/projects/${s}.mdx)`).join('\n') +
      `\nCreate the page, or remove the flag from the wiki entry.`,
  );
  process.exit(1);
}

// ---- apply to the site ----------------------------------------------------
const changes = [];
const blocked = [];

const pages = readdirSync(SITE_PROJECTS)
  .filter((f) => f.endsWith('.mdx'))
  .map((file) => {
    const path = join(SITE_PROJECTS, file);
    const text = readFileSync(path, 'utf8');
    const fm = frontmatter(text);
    if (!fm) throw new Error(`${file} has no frontmatter`);
    return { slug: basename(file, '.mdx'), path, fm };
  });

for (const page of pages) {
  const { slug, fm } = page;
  let raw = fm.raw;
  const before = raw;

  // flagship -> category
  const wantFlagship = flagship.has(slug);
  const category = field(raw, 'category');
  if (wantFlagship && category !== 'flagship') {
    raw = setField(raw, 'category', 'flagship');
    changes.push(`${slug}: category ${category} -> flagship`);
  } else if (!wantFlagship && category === 'flagship') {
    // `flagship` occupies the category slot, so there is nothing to fall back
    // to. Guessing here silently mis-files the project, so stop and ask.
    blocked.push(
      `  ${slug} is category: flagship on the site but no longer flagship: true in the wiki.\n` +
        `    Set its category by hand in data/projects/${slug}.mdx to one of: ` +
        `${VALID_CATEGORIES.filter((c) => c !== 'flagship').join(', ')}`,
    );
  }

  if (raw !== before && !CHECK) {
    writeFileSync(page.path, `---\n${raw}\n---\n${page.fm.rest.replace(/^\n?---\n/, '')}`);
  }
}

// ---- report ---------------------------------------------------------------
if (blocked.length) {
  console.error(`Sync stopped. A project left the flagship list and needs a category:\n${blocked.join('\n')}`);
  process.exit(1);
}

if (!changes.length) {
  console.log('In sync with the wiki. No changes.');
  process.exit(0);
}

console.log(`${CHECK ? 'Out of sync with the wiki' : 'Synced from the wiki'}:`);
for (const c of changes) console.log(`  ${c}`);
console.log(`\nflagship (${flagship.size}): ${[...flagship].sort().join(', ')}`);
process.exit(CHECK ? 1 : 0);
