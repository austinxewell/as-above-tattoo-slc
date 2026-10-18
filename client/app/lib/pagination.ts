type PageInfo = {
  total: number;
  page: number;
  pageSize: number;
};

export function outOfRangePageUrl(url: URL, { total, page, pageSize }: PageInfo) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  if (page <= pageCount) return null;

  const next = new URL(url);
  if (pageCount === 1) next.searchParams.delete("page");
  else next.searchParams.set("page", String(pageCount));

  return `${next.pathname}${next.search}`;
}
