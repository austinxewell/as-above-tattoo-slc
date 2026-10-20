import type { Route } from "./+types/staff";
import { Check } from "lucide-react";
import { cn } from "~/lib/utils";
import { fetchStaff, handleStaffAction } from "~/lib/staff";
import { currentUserContext } from "~/lib/current-user";
import { StaffRow, staffColumns } from "~/components/portal/staff/staff-row";
import { AddPersonDialog } from "~/components/portal/staff/add-person-dialog";

export function meta() {
  return [{ title: "Staff | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request, context }: Route.ClientLoaderArgs) {
  const me = context.get(currentUserContext);
  const removed = new URL(request.url).searchParams.get("removed");
  return { staff: await fetchStaff(request.signal), myId: me.id, removed };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleStaffAction(request);
}

export default function AdminStaff({ loaderData }: Route.ComponentProps) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl uppercase">Staff</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Everyone who can log in to the portal. Invite new people, resend invites, and give staff
            an artist profile.
          </p>
        </div>
        <AddPersonDialog triggerLabel="Add person" />
      </div>

      {loaderData.removed && (
        <p role="status" className="mt-6 inline-flex items-center gap-1.5 text-sm text-success">
          <Check className="size-4" strokeWidth={2} aria-hidden="true" />
          {loaderData.removed} was removed.
        </p>
      )}

      <div
        aria-hidden="true"
        className={cn(
          "mt-10 hidden gap-6 border-b border-border bg-background pt-3 pb-3 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground md:sticky md:top-0 md:z-10 md:grid",
          staffColumns,
        )}
      >
        <span>Person</span>
        <span>Role</span>
        <span>Login</span>
        <span>Artist profile</span>
        <span className="text-right">Actions</span>
      </div>

      <ul className="mt-6 border-t border-border md:mt-0 md:border-t-0">
        {loaderData.staff.map((member) => (
          <StaffRow key={member.id} member={member} isSelf={member.id === loaderData.myId} />
        ))}
      </ul>
    </section>
  );
}
