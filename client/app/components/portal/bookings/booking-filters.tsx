import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { SearchField } from "~/components/shared/search-field";
import { FilterTabs, type FilterOption } from "./filter-tabs";
import { ViewSwitch } from "./view-switch";

type BookingFiltersProps = {
  assignmentOptions: FilterOption[];
  statusOptions: FilterOption[];
  viewCounts: { active: number; archived: number };
  total: number;
};

const headingClasses = "text-[0.65rem] uppercase tracking-[0.2em] text-accent";
const clearClasses =
  "border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em]";

export function BookingFilters({
  assignmentOptions,
  statusOptions,
  viewCounts,
  total,
}: BookingFiltersProps) {
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = ["view", "q", "for", "status"].filter((param) =>
    searchParams.has(param),
  ).length;

  return (
    <>
      <div className="mt-6 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="inline-flex items-center gap-2 border border-border px-4 py-2 text-[0.65rem] uppercase tracking-[0.15em]">
            <SlidersHorizontal className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
            Filters{activeCount > 0 && ` (${activeCount})`}
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="max-h-[85svh] overflow-y-auto bg-background text-foreground"
          >
            <SheetHeader>
              <SheetTitle>Filter requests</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-6 px-4 pb-4">
              <div>
                <p className={headingClasses}>View</p>
                <div className="mt-3">
                  <ViewSwitch counts={viewCounts} />
                </div>
              </div>

              <SearchField label="Search clients" placeholder="Client name or email" />

              <div>
                <p className={headingClasses}>Artist</p>
                <div className="mt-3">
                  <FilterTabs param="for" label="Filter by artist" options={assignmentOptions} />
                </div>
              </div>

              <div>
                <p className={headingClasses}>Status</p>
                <div className="mt-3">
                  <FilterTabs param="status" label="Filter by status" options={statusOptions} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-border p-4">
              {activeCount > 0 && (
                <Link to="." preventScrollReset className={clearClasses}>
                  Clear all
                </Link>
              )}
              <Button
                variant="brand"
                size="cta"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                Show {total} {total === 1 ? "request" : "requests"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:block">
        <SearchField
          label="Search clients"
          placeholder="Client name or email"
          className="mt-8 max-w-md"
        />
        <div className="mt-10">
          <FilterTabs param="for" label="Filter by artist" options={assignmentOptions} />
        </div>

        <div className="mt-6">
          <FilterTabs param="status" label="Filter by status" options={statusOptions} />
        </div>

        {activeCount > 0 && (
          <Link to="." preventScrollReset className={`mt-6 inline-block ${clearClasses}`}>
            Clear all filters
          </Link>
        )}
      </div>
    </>
  );
}
