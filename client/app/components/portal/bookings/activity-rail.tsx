import { useLayoutEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { BookingActivity, BookingWithActivity } from "~/lib/bookings";
import { ActivityEntry } from "./activity-entry";
import { NoteForm } from "./note-form";

function ActivityList({ entries }: { entries: BookingActivity[] }) {
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [entries.length]);

  return (
    <div
      ref={listRef}
      className="max-h-[min(24rem,60vh)] overflow-y-auto px-5 py-4 xl:max-h-none xl:min-h-0 xl:flex-1"
    >
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notes yet. Write the first one below.</p>
      ) : (
        <ol className="grid gap-4">
          {entries.map((entry) => (
            <ActivityEntry key={entry.id} entry={entry} />
          ))}
        </ol>
      )}
    </div>
  );
}

export function ActivityRail({ booking }: { booking: BookingWithActivity }) {
  const received: BookingActivity = {
    id: "received",
    type: "event",
    text: "Request received",
    authorName: "Website",
    createdAt: booking.createdAt,
  };

  const tabs = [
    {
      value: "notes",
      label: "Notes",
      entries: booking.activity.filter((entry) => entry.type === "note"),
    },
    {
      value: "updates",
      label: "Updates",
      entries: [received, ...booking.activity.filter((entry) => entry.type === "event")],
    },
    { value: "all", label: "All", entries: [received, ...booking.activity] },
  ];

  return (
    <aside
      aria-labelledby="activity-heading"
      className="flex flex-col border border-border bg-surface xl:sticky xl:top-6 xl:h-[min(44rem,calc(100vh-3rem))]"
    >
      <h2 id="activity-heading" className="sr-only">
        Activity
      </h2>

      <Tabs defaultValue="notes" className="min-h-0 flex-1 gap-0">
        <TabsList
          variant="line"
          className="w-full justify-start gap-5 border-b border-border px-5 pt-4 group-data-horizontal/tabs:h-auto"
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-none px-0 pb-3 text-[0.65rem] uppercase tracking-[0.2em] after:bg-accent data-active:text-foreground"
            >
              {tab.label}
              <span className="text-accent tabular-nums">{tab.entries.length}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="xl:flex xl:min-h-0 xl:flex-col">
            <ActivityList entries={tab.entries} />
          </TabsContent>
        ))}
      </Tabs>

      <NoteForm />
    </aside>
  );
}
