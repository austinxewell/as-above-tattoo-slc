import { useState } from "react";
import type { Route } from "./+types/about";
import { fetchAbout, handleAboutAction } from "~/lib/about";
import { ProofGroup } from "~/components/portal/artist-profile/proof-row";
import { EditableRow } from "~/components/portal/artist-profile/editable-row";
import { TextEditForm } from "~/components/portal/artist-profile/text-edit-form";
import { PairListEditForm } from "~/components/portal/site-content/pair-list-edit-form";
import { AboutPreview } from "~/components/home/about-preview";

type TextField = "heading" | "body";
type EditingState = { field: TextField | "values"; draft: string } | null;

export function meta() {
  return [{ title: "About | Site content | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { about: await fetchAbout(request.signal) };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleAboutAction(request);
}

export default function SiteContentAbout({ loaderData }: Route.ComponentProps) {
  const { about } = loaderData;
  const [editing, setEditing] = useState<EditingState>(null);
  const close = () => setEditing(null);

  const preview =
    editing && editing.field !== "values" ? { ...about, [editing.field]: editing.draft } : about;

  function rowProps(field: TextField) {
    return {
      isEditing: editing?.field === field,
      onEdit: () => setEditing({ field, draft: about[field] }),
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
      <ProofGroup title="About the shop">
        <EditableRow
          mark="i."
          label="Heading"
          {...rowProps("heading")}
          editor={<TextEditForm label="Heading" maxLength={80} {...textProps("heading")} />}
        >
          <p className="font-display text-2xl uppercase leading-tight">{about.heading}</p>
        </EditableRow>

        <EditableRow
          mark="ii."
          label="Body"
          {...rowProps("body")}
          editor={<TextEditForm label="Body" multiline maxLength={1500} {...textProps("body")} />}
        >
          <p className="max-w-prose whitespace-pre-line leading-7">{about.body}</p>
        </EditableRow>

        <EditableRow
          mark="iii."
          label="Values"
          isEditing={editing?.field === "values"}
          onEdit={() => setEditing({ field: "values", draft: "" })}
          editor={
            <PairListEditForm
              intent="values"
              label="Values"
              noun="Value"
              max={8}
              first={{
                name: "title",
                label: "Title",
                placeholder: "Title, e.g. Cleanliness",
                maxLength: 40,
              }}
              second={{
                name: "description",
                label: "Description",
                placeholder: "A sentence or two about it",
                maxLength: 300,
              }}
              initialItems={about.values.map((value) => ({
                first: value.title,
                second: value.description,
              }))}
              onClose={close}
            />
          }
        >
          {about.values.length > 0 ? (
            <dl className="grid gap-3">
              {about.values.map((value) => (
                <div key={value.id}>
                  <dt className="font-display text-lg text-accent">{value.title}</dt>
                  <dd className="text-sm leading-6 text-muted-foreground">{value.description}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <span className="text-sm text-muted-foreground">No values yet</span>
          )}
        </EditableRow>
      </ProofGroup>

      <section aria-label="Preview" className="mt-12">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">Preview · home page</p>
        <div className="mt-3 overflow-hidden border border-border">
          <AboutPreview about={preview} />
        </div>
      </section>
    </div>
  );
}
