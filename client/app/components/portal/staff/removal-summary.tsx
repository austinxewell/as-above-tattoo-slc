import type { Handoff, StaffMember } from "~/lib/staff";

export type RemovalScope = "person" | "profile";

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

type RemovalSummaryProps = {
  member: StaffMember;
  scope: RemovalScope;
  handoff: Handoff | null;
};

export function RemovalSummary({ member, scope, handoff }: RemovalSummaryProps) {
  const firstName = member.name.split(" ")[0];

  const removed = [
    ...(scope === "person" ? [`${firstName}'s login, and any pending invite or reset links`] : []),
    ...(member.artist && handoff
      ? [
          "Their artist page",
          handoff.pieceCount > 0
            ? `All ${plural(handoff.pieceCount, "portfolio piece")}`
            : "Their portfolio (it has no pieces yet)",
        ]
      : []),
  ];

  const kept = [
    ...(member.artist && handoff && handoff.archivedCount > 0
      ? [
          `${plural(handoff.archivedCount, "archived request")}, labelled “Formerly ${member.artist.name}”`,
        ]
      : []),
    "Notes and updates they wrote, with their name on them",
    ...(scope === "profile" ? [`${firstName}'s admin login`] : []),
  ];

  return (
    <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      <div>
        <h2 className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">What gets removed</h2>
        <ul className="mt-2.5 list-disc space-y-1 pl-5 text-sm">
          {removed.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">What stays</h2>
        <ul className="mt-2.5 list-disc space-y-1 pl-5 text-sm">
          {kept.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
