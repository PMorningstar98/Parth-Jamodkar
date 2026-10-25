import index from '@/data/writeups.json';

// Registry of write-up content modules, keyed by slug.
const CONTENT = {
  'dissecting-amos-stealer-packet-by-packet': () =>
    import('@/data/writeups/amos-stealer').then((m) => m.default),
};

export function getWriteupMeta(slug) {
  return index.find((w) => w.slug === slug) || null;
}

export function getAllSlugs() {
  return index.map((w) => w.slug);
}

export function getAllWriteups() {
  return index;
}

export async function getWriteup(slug) {
  const meta = getWriteupMeta(slug);
  const loader = CONTENT[slug];
  if (!meta || !loader) return null;
  const { blocks } = await loader();
  return { ...meta, blocks };
}
