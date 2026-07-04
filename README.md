# Parth Jamodkar — Security Research Portal

A data-driven personal research portal built with Next.js (App Router), Tailwind CSS,
and Framer Motion. Dark mode, glassmorphism, terminal-inspired UI, and a duotone
"known / unknown" decode-rain visual in the hero.

Every publication, talk, repo, and blog post lives in a JSON data file — adding new
work means adding one entry, not editing page code.

## 1. Before you launch: fill in the placeholders

A few things were left as clearly-marked placeholders because only you have the real values:

| File | What to update |
|---|---|
| `data/site.json` | `email` (currently `your-email@example.com`), `location` (optional), `resumeUrl` if you rename the file |
| `data/timeline.json` | `year` fields left as `""` — add the real years for each milestone |
| `data/content.json` | `date` fields left as `""` on most items — add publish dates as you find them |
| `public/resume.pdf` | Add your actual résumé PDF here (the "Download Résumé" button links to `/resume.pdf`) |
| `app/layout.js`, `app/sitemap.js`, `app/robots.js`, `app/rss.xml/route.js` | Replace the placeholder `siteUrl` (`https://parthjamodkar.com`) with your real domain once you have one |

## 2. Run it locally

Requires Node.js 18.17+.

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## 3. Add new work (no code changes needed)

All content lives in `data/content.json` as a single array. Each entry looks like this:

```json
{
  "id": "unique-slug",
  "type": "publication",
  "title": "Article title",
  "description": "One or two sentences.",
  "url": "https://example.com/the-article",
  "source": "Microsoft Security Blog",
  "date": "2026-08-01",
  "categories": ["Threat Hunting", "Detection Engineering"],
  "tags": ["KQL", "MITRE ATT&CK"],
  "featured": false
}
```

- `type` must be one of: `publication`, `talk`, `opensource`, `blog`.
- `categories` should match the names in `data/research-categories.json` so the item
  shows up on the Research page.
- Set `featured: true` to surface an item in the "Latest research" section on the homepage.
- The new entry automatically appears on: its section page (Publications/Talks/Open
  Source/Blog), the Research page (under matching categories), the Public Work page,
  the homepage feed (if featured), the RSS feed, and search.

To add a career milestone, add an entry to `data/timeline.json`. To add/remove a skill
tag, edit `data/skills.json`.

## 4. Build for production

```bash
npm run build
```

This produces a fully static site in the `out/` folder (`next.config.mjs` sets
`output: 'export'`), so it can be hosted anywhere that serves static files — no Node
server required.

## 5. Deploy

### Option A — GitHub Pages
1. Push this project to a GitHub repository.
2. Run `npm run build` to generate `out/`.
3. Deploy the contents of `out/` to the `gh-pages` branch (e.g. with the
   `gh-pages` npm package, or a GitHub Actions workflow that runs `npm run build`
   and publishes `out/`).
4. `.nojekyll` is already included in `public/` so GitHub Pages won't ignore the
   `_next` folder.
5. If deploying to a **project** page (`username.github.io/repo-name`) rather than a
   **user** page (`username.github.io`), add `basePath: '/repo-name'` to
   `next.config.mjs`.

### Option B — Vercel / Netlify
Connect the GitHub repo directly — both platforms detect Next.js automatically and
will build and deploy on every push. `output: 'export'` still works; Vercel will also
serve it as a static site.

## 6. Project structure

```
app/                  Routes (App Router) — one folder per page
  page.js             Home
  about/
  research/           Grouped by category
  publications/
  talks/
  open-source/
  blog/
  public-work/        Aggregator page — the "everything in one place" view
  contact/
  search/             Client-side search across all content
  sitemap.js           Auto-generated sitemap.xml
  robots.js            Auto-generated robots.txt
  rss.xml/route.js     Auto-generated RSS feed
components/           Shared UI (Header, Footer, Hero, ContentCard, Timeline, etc.)
data/                 All editable content — JSON only, no code
  site.json           Name, roles, tagline, social links, nav
  content.json         Publications, talks, open-source items, blog posts
  timeline.json         Career milestones
  skills.json            Skill tags
  research-categories.json   Research category descriptions
lib/search.js          Shared search-matching logic
```

## 7. Notes on the design

- **Theme**: dark, blue/violet duotone, glassmorphism panels, monospace type
  (JetBrains Mono) for headings/labels, Inter for body copy.
- **Signature visual**: the hero's decode-rain canvas literalizes the tagline —
  blue columns are "known" signals that resolve and hold, violet columns are
  "unknown" ones that keep scrambling. It's the one deliberately loud element;
  everything else stays quiet by design.
- Respects `prefers-reduced-motion` (rain slows down, other animations shorten).
- Keyboard focus is visible everywhere; all interactive elements are real
  `<a>`/`<button>` elements.
