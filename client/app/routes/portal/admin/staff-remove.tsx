import { useState } from "react";
import { data, Link, redirect } from "react-router";
import { ArrowLeft } from "lucide-react";
import type { Route } from "./+types/staff-remove";
import { currentUserContext } from "~/lib/current-user";
import { fetchHandoff, fetchStaff, removeArtistProfile, removeUser } from "~/lib/staff";
import { handleBookingAction } from "~/lib/bookings";
import { RemovalSummary, type RemovalScope } from "~/components/portal/staff/removal-summary";
import { RemovalScopePicker } from "~/components/portal/staff/removal-scope";
import { HandoffList } from "~/components/portal/staff/handoff-list";
import { RemovalConfirm } from "~/components/portal/staff/removal-confirm";
import { RemovalStep } from "~/components/portal/staff/removal-step";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: `Remove ${loaderData?.member.name ?? "person"} | Portal` },
    { name: "robots", content: "noindex" },
  ];
}

export async function clientLoader({ params, request, context }: Route.ClientLoaderArgs) {
  const me = context.get(currentUserContext);
  const staff = await fetchStaff(request.signal);
  const member = staff.find((person) => person.id === params.id);

  if (!member) throw data("Not found", { status: 404 });

  const handoff = member.artist ? await fetchHandoff(member.artist.slug, request.signal) : null;

  return { member, isSelf: member.id === me.id, handoff };
}

export async function clientAction({ params, request }: Route.ClientActionArgs) {
  const formData = await request.clone().formData();
  const intent = formData.get("intent");

  if (intent === "remove-user" || intent === "remove-profile") {
    const name = String(formData.get("name") ?? "");

    try {
      if (intent === "remove-user") {
        await removeUser(params.id, request.signal);
      } else {
        await removeArtistProfile(String(formData.get("slug") ?? ""), request.signal);
      }
    } catch (error) {
      return {
        intent,
        error: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      };
    }

    const removed = intent === "remove-profile" ? `${name}'s artist profile` : name;
    throw redirect(`/portal/admin/staff?removed=${encodeURIComponent(removed)}`);
  }

  return handleBookingAction(request);
}

export default function StaffRemove({ loaderData, actionData }: Route.ComponentProps) {
  const { member, isSelf, handoff } = loaderData;
  const isAdminArtist = member.role === "admin" && member.artist !== null;
  const [scope, setScope] = useState<RemovalScope>(isAdminArtist ? "profile" : "person");
  const firstName = member.name.split(" ")[0];
  const title =
    scope === "profile" ? `Remove ${firstName}'s artist profile` : `Remove ${member.name}`;
  const isLocked = Boolean(handoff && handoff.openTotal > 0);

  const steps = [isAdminArtist && "scope", handoff && "handoff", "confirm"].filter(Boolean);
  const stepNumber = (step: string) => (steps.length > 1 ? steps.indexOf(step) + 1 : undefined);

  return (
    <section>
      <Link
        to="/portal/admin/staff"
        className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent-hover"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
        Staff
      </Link>

      {isSelf ? (
        <>
          <h1 className="mt-8 font-display text-3xl uppercase text-balance">
            You can't remove yourself
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">Ask another admin to remove you.</p>
        </>
      ) : (
        <>
          <h1 className="mt-8 font-display text-3xl uppercase text-balance">{title}</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            This can't be undone.
            {handoff && " Hand off their open requests first, then confirm."}
          </p>

          <div className="mt-8 border-b border-border">
            {isAdminArtist && (
              <RemovalStep
                id="scope-heading"
                step={stepNumber("scope")}
                title="What to remove"
                hint={`Choose whether ${firstName} keeps their admin login.`}
              >
                <RemovalScopePicker firstName={firstName} value={scope} onChange={setScope} />
              </RemovalStep>
            )}

            {handoff && (
              <RemovalStep
                id="handoff-heading"
                step={stepNumber("handoff")}
                title="Hand off open requests"
                hint="Reassign each request to another artist or to No preference, or archive it."
              >
                <HandoffList
                  requests={handoff.openRequests}
                  total={handoff.openTotal}
                  reassignTo={handoff.reassignTo}
                />
              </RemovalStep>
            )}

            <RemovalStep
              id="confirm-heading"
              step={stepNumber("confirm")}
              title="Review and confirm"
              hint={
                isLocked
                  ? "Available once every open request is handed off."
                  : "This can't be undone."
              }
            >
              <RemovalSummary member={member} scope={scope} handoff={handoff} />
              <RemovalConfirm
                confirmName={member.name}
                buttonLabel={title}
                intent={scope === "profile" ? "remove-profile" : "remove-user"}
                slug={member.artist?.slug}
                locked={isLocked}
                error={
                  actionData?.intent === "remove-user" || actionData?.intent === "remove-profile"
                    ? actionData.error
                    : null
                }
              />
            </RemovalStep>
          </div>
        </>
      )}
    </section>
  );
}
