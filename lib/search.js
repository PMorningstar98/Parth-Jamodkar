export function searchContent(items, query) {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items.filter((item) => {
    const haystack = [
      item.title,
      item.description,
      item.source,
      item.type,
      ...(item.categories || []),
      ...(item.tags || []),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(q);
  });
}
