import type { Route } from "./+types/staff";
import { cn } from "~/lib/utils";
import { fetchStaff, handleStaffAction } from "~/lib/staff";
import { StaffRow, staffColumns } from "~/components/portal/staff/staff-row";
import { AddPersonDialog } from "~/components/portal/staff/add-person-dialog";

export function meta() {
  return [{ title: "Staff | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { staff: await fetchStaff(request.signal) };
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

      <div
        aria-hidden="true"
        className={cn(
          "mt-10 hidden gap-6 border-b border-border pb-3 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground md:grid",
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
          <StaffRow key={member.id} member={member} />
        ))}
      </ul>
    </section>
  );
}
