import { useSearchParams } from "react-router";
import { cn } from "~/lib/utils";
import {
  Pagination as PaginationNav,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

type PaginationProps = {
  total: number;
  page: number;
  pageSize: number;
  label?: string;
  className?: string;
};

function pageItems(page: number, pageCount: number): (number | "gap")[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  const items: (number | "gap")[] = [1];

  if (start > 2) items.push("gap");
  for (let number = start; number <= end; number++) items.push(number);
  if (end < pageCount - 1) items.push("gap");

  items.push(pageCount);
  return items;
}

const activeClasses =
  "border-accent bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:border-accent dark:bg-accent dark:hover:bg-accent";
const disabledClasses = "pointer-events-none opacity-40";

export function Pagination({
  total,
  page,
  pageSize,
  label = "Pagination",
  className,
}: PaginationProps) {
  const [searchParams] = useSearchParams();
  const pageCount = Math.ceil(total / pageSize);

  if (pageCount <= 1) return null;

  function linkFor(target: number) {
    const next = new URLSearchParams(searchParams);
    if (target === 1) next.delete("page");
    else next.set("page", String(target));
    const query = next.toString();
    return query ? `?${query}` : ".";
  }

  const isFirst = page === 1;
  const isLast = page === pageCount;

  return (
    <PaginationNav aria-label={label} className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to={linkFor(Math.max(page - 1, 1))}
            aria-disabled={isFirst || undefined}
            tabIndex={isFirst ? -1 : undefined}
            className={cn("rounded-none", isFirst && disabledClasses)}
          />
        </PaginationItem>

        {pageItems(page, pageCount).map((item, index) => (
          <PaginationItem key={item === "gap" ? `gap-${index}` : item}>
            {item === "gap" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                to={linkFor(item)}
                isActive={item === page}
                aria-label={`Page ${item}`}
                className={cn("rounded-none tabular-nums", item === page && activeClasses)}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            to={linkFor(Math.min(page + 1, pageCount))}
            aria-disabled={isLast || undefined}
            tabIndex={isLast ? -1 : undefined}
            className={cn("rounded-none", isLast && disabledClasses)}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationNav>
  );
}
