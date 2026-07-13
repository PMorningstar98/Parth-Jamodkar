// Fetches the Medium RSS feed and appends any *new* posts to data/content.json.
// Existing entries (matched by normalized URL) are never overwritten, so any
// manual curation of descriptions/categories/featured flags is preserved.
//
// Run locally:  node scripts/update-medium.mjs
// In CI it runs on a schedule (see .github/workflows/update-medium.yml).

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = join(__dirname, '..', 'data', 'content.json');
const FEED_URL = 'https://medium.com/feed/@parth7378785501';

// Map lowercased Medium tags to the site's research categories.
const CATEGORY_MAP = [
  [/threat[-\s]?intel/, 'Threat Intelligence'],
  [/threat[-\s]?hunt/, 'Threat Hunting'],
  [/detection|sigma|yara|kql/, 'Detection Engineering'],
  [/cloud|gcp|google-?cloud|azure|aws/, 'Cloud Security'],
  [/\bai\b|ml|llm|artificial/, 'AI Security'],
  [/supply[-\s]?chain/, 'Supply Chain Security'],
  [/mitre|att&?ck/, 'MITRE ATT&CK Mapping'],
];

function stripCdata(s = '') {
  return s.replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').trim();
}

function decodeEntities(s = '') {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8230;/g, '\u2026')
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#8212;/g, '\u2014');
}

function normalizeUrl(url = '') {
  return url.split('?')[0].replace(/\/$/, '').toLowerCase();
}

function slugId(url) {
  const seg = normalizeUrl(url).split('/').pop() || '';
  // drop the trailing hex id Medium appends to slugs
  const slug = seg.replace(/-[0-9a-f]{8,}$/, '');
  return `medium-${slug}`.slice(0, 60);
}

function mapCategories(tags) {
  const cats = [];
  for (const tag of tags) {
    for (const [re, name] of CATEGORY_MAP) {
      if (re.test(tag) && !cats.includes(name)) cats.push(name);
    }
  }
  return cats.length ? cats : ['Threat Hunting'];
}

function textFromHtml(html = '') {
  return decodeEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function summarize(html, max = 200) {
  const text = textFromHtml(html);
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '\u2026';
}

function parseFeed(xml) {
  const items = [];
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  for (const block of blocks) {
    const title = decodeEntities(stripCdata((block.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || ''));
    const link = stripCdata((block.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '');
    const pubDate = stripCdata((block.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '');
    const tags = [...block.matchAll(/<category>([\s\S]*?)<\/category>/g)].map((m) =>
      stripCdata(m[1]).toLowerCase(),
    );
    const descRaw = stripCdata((block.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '');
    const contentRaw = stripCdata(
      (block.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/) || [])[1] || '',
    );
    if (!title || !link) continue;
    const date = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : '';
    items.push({ title, link, date, tags, description: summarize(descRaw || contentRaw) });
  }
  return items;
}

async function main() {
  const raw = readFileSync(CONTENT_PATH, 'utf8');
  const content = JSON.parse(raw);
  const existingUrls = new Set(content.map((i) => normalizeUrl(i.url || '')));
  const existingIds = new Set(content.map((i) => i.id));

  const res = await fetch(FEED_URL, { headers: { 'User-Agent': 'Mozilla/5.0 (feed-updater)' } });
  if (!res.ok) throw new Error(`Feed request failed: ${res.status}`);
  const xml = await res.text();
  const posts = parseFeed(xml);

  const added = [];
  for (const post of posts) {
    if (existingUrls.has(normalizeUrl(post.link))) continue;
    let id = slugId(post.link);
    let n = 2;
    while (existingIds.has(id)) id = `${slugId(post.link)}-${n++}`;
    existingIds.add(id);
    const entry = {
      id,
      type: 'blog',
      title: post.title,
      description: post.description || 'Personal security research and writing published on Medium.',
      url: post.link,
      source: 'Medium',
      date: post.date,
      categories: mapCategories(post.tags),
      tags: post.tags.slice(0, 4),
      featured: false,
    };
    content.push(entry);
    added.push(entry);
  }

  if (added.length === 0) {
    console.log('No new Medium posts found. content.json unchanged.');
    return;
  }

  writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2) + '\n');
  console.log(`Added ${added.length} new Medium post(s):`);
  added.forEach((e) => console.log(`  - ${e.title}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
