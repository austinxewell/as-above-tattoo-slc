import { useState, type ReactNode } from "react";
import type { Route } from "./+types/pricing";
import { fetchPricing, handlePricingAction } from "~/lib/pricing";
import { ProofGroup } from "~/components/portal/artist-profile/proof-row";
import { EditableRow } from "~/components/portal/artist-profile/editable-row";
import { TextEditForm } from "~/components/portal/artist-profile/text-edit-form";
import {
  PairListEditForm,
  type PairFieldSpec,
  type PairItem,
} from "~/components/portal/site-content/pair-list-edit-form";
import { PublicPageLink } from "~/components/portal/site-content/public-page-link";

type TextField = "intro" | "shopMinimum";
type ListField = "factors" | "policies" | "faqs";
type EditingState = { field: TextField | ListField; draft: string } | null;

const titleField: PairFieldSpec = {
  name: "title",
  label: "Title",
  placeholder: "Title",
  maxLength: 40,
};

const descriptionField: PairFieldSpec = {
  name: "description",
  label: "Description",
  placeholder: "A sentence or two about it",
  maxLength: 300,
};

export function meta() {
  return [{ title: "Pricing | Site content | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { pricing: await fetchPricing(request.signal) };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handlePricingAction(request);
}

function PairList({ items, empty }: { items: PairItem[]; empty: string }) {
  if (items.length === 0) {
    return <span className="text-sm text-muted-foreground">{empty}</span>;
  }

  return (
    <dl className="grid gap-3">
      {items.map((item, index) => (
        <div key={index}>
          <dt className="font-display text-lg text-accent">{item.first}</dt>
          <dd className="text-sm leading-6 text-muted-foreground">{item.second}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function SiteContentPricing({ loaderData }: Route.ComponentProps) {
  const { pricing } = loaderData;
  const [editing, setEditing] = useState<EditingState>(null);
  const close = () => setEditing(null);

  const factors = pricing.factors.map((item) => ({ first: item.title, second: item.description }));
  const policies = pricing.policies.map((item) => ({
    first: item.title,
    second: item.description,
  }));
  const faqs = pricing.faqs.map((item) => ({ first: item.question, second: item.answer }));

  function rowProps(field: TextField | ListField): {
    isEditing: boolean;
    onEdit: () => void;
  } {
    return {
      isEditing: editing?.field === field,
      onEdit: () =>
        setEditing({
          field,
          draft: field === "intro" || field === "shopMinimum" ? pricing[field] : "",
        }),
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

  function listEditor(
    field: ListField,
    label: string,
    noun: string,
    max: number,
    first: PairFieldSpec,
    second: PairFieldSpec,
    items: PairItem[],
  ): ReactNode {
    return (
      <PairListEditForm
        intent={field}
        label={label}
        noun={noun}
        max={max}
        first={first}
        second={second}
        initialItems={items}
        onClose={close}
      />
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-end">
        <PublicPageLink to="/pricing" label="View pricing page" />
      </div>

      <div className="mt-8 grid gap-10">
        <ProofGroup title="Overview">
          <EditableRow
            mark="i."
            label="Intro"
            {...rowProps("intro")}
            editor={
              <TextEditForm label="Intro" multiline maxLength={500} {...textProps("intro")} />
            }
          >
            <p className="max-w-prose whitespace-pre-line leading-7">{pricing.intro}</p>
          </EditableRow>

          <EditableRow
            mark="ii."
            label="Shop minimum"
            {...rowProps("shopMinimum")}
            editor={
              <TextEditForm
                label="Shop minimum"
                maxLength={20}
                hint="For example, $100"
                {...textProps("shopMinimum")}
              />
            }
          >
            <p className="font-display text-2xl">{pricing.shopMinimum}</p>
          </EditableRow>
        </ProofGroup>

        <ProofGroup title="What Affects Price">
          <EditableRow
            mark="iii."
            label="Factors"
            {...rowProps("factors")}
            editor={listEditor(
              "factors",
              "Factors",
              "Factor",
              10,
              { ...titleField, placeholder: "Title, e.g. Size" },
              descriptionField,
              factors,
            )}
          >
            <PairList items={factors} empty="No factors yet" />
          </EditableRow>
        </ProofGroup>

        <ProofGroup title="Shop Policies">
          <EditableRow
            mark="iv."
            label="Policies"
            {...rowProps("policies")}
            editor={listEditor(
              "policies",
              "Policies",
              "Policy",
              10,
              { ...titleField, placeholder: "Title, e.g. Deposits" },
              descriptionField,
              policies,
            )}
          >
            <PairList items={policies} empty="No policies yet" />
          </EditableRow>
        </ProofGroup>

        <ProofGroup title="Questions">
          <EditableRow
            mark="v."
            label="FAQs"
            {...rowProps("faqs")}
            editor={listEditor(
              "faqs",
              "FAQs",
              "Question",
              12,
              { name: "question", label: "Question", placeholder: "The question", maxLength: 120 },
              { name: "answer", label: "Answer", placeholder: "The answer", maxLength: 600 },
              faqs,
            )}
          >
            <PairList items={faqs} empty="No questions yet" />
          </EditableRow>
        </ProofGroup>
      </div>
    </div>
  );
}
