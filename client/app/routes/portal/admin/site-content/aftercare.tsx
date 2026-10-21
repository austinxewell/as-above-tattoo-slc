import { useState } from "react";
import { Plus } from "lucide-react";
import type { Route } from "./+types/aftercare";
import { fetchAfterCare, handleAfterCareAction, toMethodInput } from "~/lib/after-care";
import { ProofGroup } from "~/components/portal/artist-profile/proof-row";
import { EditableRow } from "~/components/portal/artist-profile/editable-row";
import { TextEditForm } from "~/components/portal/artist-profile/text-edit-form";
import { ListEditForm } from "~/components/portal/artist-profile/list-edit-form";
import { MethodEditForm } from "~/components/portal/site-content/method-edit-form";
import { MethodControls } from "~/components/portal/site-content/method-controls";
import { PublicPageLink } from "~/components/portal/site-content/public-page-link";

type TextField = "intro" | "disclaimer";
type ListField = "dos" | "donts" | "warningSigns";
type EditingState = { field: string; draft: string } | null;

const numerals = [
  "i.",
  "ii.",
  "iii.",
  "iv.",
  "v.",
  "vi.",
  "vii.",
  "viii.",
  "ix.",
  "x.",
  "xi.",
  "xii.",
];

const lists: { field: ListField; label: string; itemLabel: string; placeholder: string }[] = [
  {
    field: "dos",
    label: "Do's",
    itemLabel: "do",
    placeholder: "e.g. Wash gently with unscented soap",
  },
  {
    field: "donts",
    label: "Don'ts",
    itemLabel: "don't",
    placeholder: "e.g. Don't pick or scratch",
  },
  {
    field: "warningSigns",
    label: "Warning signs",
    itemLabel: "warning sign",
    placeholder: "e.g. Redness that spreads after day 3",
  },
];

export function meta() {
  return [{ title: "Aftercare | Site content | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { afterCare: await fetchAfterCare(request.signal) };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleAfterCareAction(request);
}

export default function SiteContentAftercare({ loaderData }: Route.ComponentProps) {
  const { afterCare } = loaderData;
  const [editing, setEditing] = useState<EditingState>(null);
  const close = () => setEditing(null);
  const methods = afterCare.methods.map(toMethodInput);
  let mark = 0;
  const nextMark = () => numerals[mark++] ?? "";

  function textProps(field: TextField) {
    return {
      field,
      draft: editing?.field === field ? editing.draft : "",
      onDraftChange: (draft: string) => setEditing({ field, draft }),
      onClose: close,
    };
  }

  function rowProps(field: string, draft = "") {
    return {
      isEditing: editing?.field === field,
      onEdit: () => setEditing({ field, draft }),
    };
  }

  return (
    <div className="mt-8">
      <div className="flex justify-end">
        <PublicPageLink to="/after-care" label="View aftercare page" />
      </div>

      <div className="mt-8 grid gap-10">
        <ProofGroup title="Overview">
          <EditableRow
            mark={nextMark()}
            label="Intro"
            {...rowProps("intro", afterCare.intro)}
            editor={
              <TextEditForm label="Intro" multiline maxLength={500} {...textProps("intro")} />
            }
          >
            <p className="max-w-prose whitespace-pre-line leading-7">{afterCare.intro}</p>
          </EditableRow>

          <EditableRow
            mark={nextMark()}
            label="Disclaimer"
            {...rowProps("disclaimer", afterCare.disclaimer)}
            editor={
              <TextEditForm
                label="Disclaimer"
                multiline
                maxLength={400}
                {...textProps("disclaimer")}
              />
            }
          >
            <p className="max-w-prose whitespace-pre-line leading-7">{afterCare.disclaimer}</p>
          </EditableRow>
        </ProofGroup>

        <ProofGroup title="Healing Methods">
          {afterCare.methods.map((method, index) => (
            <EditableRow
              key={method.id}
              mark={nextMark()}
              label={method.name}
              {...rowProps(`method-${method.id}`)}
              editor={<MethodEditForm methods={methods} index={index} onClose={close} />}
            >
              <p className="max-w-prose leading-7">{method.description}</p>
              <ol className="mt-3 grid gap-1.5">
                {method.stages.map((stage) => (
                  <li key={stage.id} className="text-sm">
                    <span className="text-accent">{stage.timeframe}</span>
                    <span className="text-muted-foreground"> · </span>
                    {stage.title}
                    <span className="text-muted-foreground">
                      {" "}
                      ({stage.steps.length} {stage.steps.length === 1 ? "step" : "steps"})
                    </span>
                  </li>
                ))}
              </ol>
              <MethodControls methods={methods} index={index} />
            </EditableRow>
          ))}

          <div className="border-t border-border py-4">
            {editing?.field === "new-method" ? (
              <MethodEditForm methods={methods} index={null} onClose={close} />
            ) : (
              <button
                type="button"
                onClick={() => setEditing({ field: "new-method", draft: "" })}
                disabled={methods.length >= 6}
                className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-accent disabled:text-muted-foreground"
              >
                <Plus className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                Add healing method
              </button>
            )}
          </div>
        </ProofGroup>

        <ProofGroup title="Do's, Don'ts and Warning Signs">
          {lists.map(({ field, label, itemLabel, placeholder }) => (
            <EditableRow
              key={field}
              mark={nextMark()}
              label={label}
              {...rowProps(field)}
              editor={
                <ListEditForm
                  label={label}
                  itemLabel={itemLabel}
                  intent={field}
                  name="items"
                  maxItems={12}
                  maxLength={120}
                  placeholder={placeholder}
                  initialItems={afterCare[field]}
                  onClose={close}
                />
              }
            >
              {afterCare[field].length > 0 ? (
                <ul className="grid list-disc gap-1.5 pl-5 marker:text-accent">
                  {afterCare[field].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-sm text-muted-foreground">None yet</span>
              )}
            </EditableRow>
          ))}
        </ProofGroup>
      </div>
    </div>
  );
}
