import { useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import type { Route } from "./+types/booking";
import { fetchBookingContent, handleBookingContentAction } from "~/lib/booking-content";
import { ProofGroup } from "~/components/portal/artist-profile/proof-row";
import { EditableRow } from "~/components/portal/artist-profile/editable-row";
import { TextEditForm } from "~/components/portal/artist-profile/text-edit-form";
import { StatusDot } from "~/components/portal/status-dot";
import { PairListEditForm } from "~/components/portal/site-content/pair-list-edit-form";

type TextField = "intro" | "whyRequest" | "disclaimer";
type EditingState = { field: TextField | "steps"; draft: string } | null;

export function meta() {
  return [{ title: "Booking | Site content | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return fetchBookingContent(request.signal);
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleBookingContentAction(request);
}

export default function SiteContentBooking({ loaderData }: Route.ComponentProps) {
  const { bookingContent: content, bookingRequestsEnabled } = loaderData;
  const [editing, setEditing] = useState<EditingState>(null);
  const close = () => setEditing(null);

  function rowProps(field: TextField) {
    return {
      isEditing: editing?.field === field,
      onEdit: () => setEditing({ field, draft: content[field] }),
    };
  }

  function textProps(field: TextField) {
    return {
      field,
      draft: editing?.field === field ? editing.draft : "",
      onDraftChange: (draft: string) => setEditing({ field, draft }),
      onClose: close,
    };
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <StatusDot tone={bookingRequestsEnabled ? "success" : "muted"}>
            {bookingRequestsEnabled ? "Online booking is on" : "Online booking is off"}
          </StatusDot>
          <span aria-hidden="true" className="text-muted-foreground">
            ·
          </span>
          <Link
            to="/portal/admin/site-content/settings"
            className="text-accent underline-offset-4 hover:underline"
          >
            Change in Settings
          </Link>
        </p>

        <Link
          to="/booking"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-accent underline-offset-4 hover:underline"
        >
          View booking page
          <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </Link>
      </div>

      <div className="mt-8 grid gap-10">
        <ProofGroup title="How Booking Works">
          <EditableRow
            mark="i."
            label="Intro"
            {...rowProps("intro")}
            editor={
              <TextEditForm label="Intro" multiline maxLength={300} {...textProps("intro")} />
            }
          >
            <p className="max-w-prose whitespace-pre-line leading-7">{content.intro}</p>
          </EditableRow>

          <EditableRow
            mark="ii."
            label="Steps"
            isEditing={editing?.field === "steps"}
            onEdit={() => setEditing({ field: "steps", draft: "" })}
            editor={
              <PairListEditForm
                intent="steps"
                label="Steps"
                noun="Step"
                max={6}
                first={{
                  name: "title",
                  label: "Title",
                  placeholder: "Title, e.g. Send your request",
                  maxLength: 60,
                }}
                second={{
                  name: "description",
                  label: "Description",
                  placeholder: "What happens in this step",
                  maxLength: 300,
                }}
                initialItems={content.steps.map((step) => ({
                  first: step.title,
                  second: step.description,
                }))}
                onClose={close}
              />
            }
          >
            {content.steps.length > 0 ? (
              <ol className="grid gap-3">
                {content.steps.map((step, index) => (
                  <li key={step.id} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3">
                    <span className="font-display text-lg text-accent tabular-nums">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-display text-lg text-accent">{step.title}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <span className="text-sm text-muted-foreground">No steps yet</span>
            )}
          </EditableRow>
        </ProofGroup>

        <ProofGroup title="Before Clients Request">
          <EditableRow
            mark="iii."
            label="Why a request"
            {...rowProps("whyRequest")}
            editor={
              <TextEditForm
                label="Why a request"
                multiline
                maxLength={600}
                hint="Why booking starts with a request instead of a calendar"
                {...textProps("whyRequest")}
              />
            }
          >
            <p className="max-w-prose whitespace-pre-line leading-7">{content.whyRequest}</p>
          </EditableRow>

          <EditableRow
            mark="iv."
            label="Disclaimer"
            {...rowProps("disclaimer")}
            editor={
              <TextEditForm
                label="Disclaimer"
                multiline
                maxLength={400}
                {...textProps("disclaimer")}
              />
            }
          >
            <p className="max-w-prose whitespace-pre-line leading-7">{content.disclaimer}</p>
          </EditableRow>
        </ProofGroup>
      </div>
    </div>
  );
}
