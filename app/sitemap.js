const siteUrl = 'https://parthjamodkar.com';

const STATIC_ROUTES = [
  '',
  'public-work',
  'research',
  'publications',
  'talks',
  'open-source',
  'blog',
  'about',
  'contact',
  'search',
];

export default function sitemap() {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));

  return staticEntries;
}
