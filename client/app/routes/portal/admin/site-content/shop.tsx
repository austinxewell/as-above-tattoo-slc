import { useState } from "react";
import type { Route } from "./+types/shop";
import {
  addressLines,
  facebookUrl,
  fetchShopDetails,
  formatPhone,
  groupHours,
  handleShopAction,
  instagramUrl,
} from "~/lib/shop";
import { ProofGroup } from "~/components/portal/artist-profile/proof-row";
import { EditableRow } from "~/components/portal/artist-profile/editable-row";
import { TextEditForm } from "~/components/portal/artist-profile/text-edit-form";
import { AddressEditForm } from "~/components/portal/site-content/address-edit-form";
import { HoursEditForm } from "~/components/portal/site-content/hours-edit-form";
import { PublicPageLink } from "~/components/portal/site-content/public-page-link";

type TextField = "phone" | "email" | "instagram" | "facebook";
type EditingState = { field: string; draft: string } | null;

const linkClasses = "border-b border-accent transition-colors hover:text-accent-hover";

export function meta() {
  return [{ title: "Shop | Site content | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { shop: await fetchShopDetails(request.signal) };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleShopAction(request);
}

export default function SiteContentShop({ loaderData }: Route.ComponentProps) {
  const { shop } = loaderData;
  const [editing, setEditing] = useState<EditingState>(null);
  const close = () => setEditing(null);

  const draftFor: Record<TextField, string> = {
    phone: formatPhone(shop.phone),
    email: shop.email ?? "",
    instagram: shop.instagram,
    facebook: shop.facebook,
  };

  function rowProps(field: string, draft = "") {
    return {
      isEditing: editing?.field === field,
      onEdit: () => setEditing({ field, draft }),
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
      <div className="flex justify-end">
        <PublicPageLink to="/" label="View home page" />
      </div>

      <div className="mt-8 grid gap-10">
        <ProofGroup title="Location">
          <EditableRow
            mark="i."
            label="Address"
            {...rowProps("address")}
            editor={<AddressEditForm shop={shop} onClose={close} />}
          >
            <address className="leading-7 not-italic">
              {addressLines(shop).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </EditableRow>
        </ProofGroup>

        <ProofGroup title="Contact">
          <EditableRow
            mark="ii."
            label="Phone"
            {...rowProps("phone", draftFor.phone)}
            editor={
              <TextEditForm
                label="Phone"
                maxLength={20}
                hint="Any format, e.g. (385) 378-3438"
                {...textProps("phone")}
              />
            }
          >
            <a href={`tel:${shop.phone}`} className={linkClasses}>
              {formatPhone(shop.phone)}
            </a>
          </EditableRow>

          <EditableRow
            mark="iii."
            label="Email"
            {...rowProps("email", draftFor.email)}
            editor={
              <TextEditForm
                label="Email"
                maxLength={254}
                hint="Optional. Leave empty to hide it"
                {...textProps("email")}
              />
            }
          >
            {shop.email ? (
              <a href={`mailto:${shop.email}`} className={linkClasses}>
                {shop.email}
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">
                Not set. It's hidden on the site until you add one.
              </span>
            )}
          </EditableRow>

          <EditableRow
            mark="iv."
            label="Instagram"
            {...rowProps("instagram", draftFor.instagram)}
            editor={
              <TextEditForm
                label="Instagram"
                maxLength={100}
                hint="Handle or profile link"
                {...textProps("instagram")}
              />
            }
          >
            <a
              href={instagramUrl(shop.instagram)}
              target="_blank"
              rel="noreferrer"
              className={linkClasses}
            >
              @{shop.instagram}
            </a>
          </EditableRow>

          <EditableRow
            mark="v."
            label="Facebook"
            {...rowProps("facebook", draftFor.facebook)}
            editor={
              <TextEditForm
                label="Facebook"
                maxLength={100}
                hint="Page name or link"
                {...textProps("facebook")}
              />
            }
          >
            <a
              href={facebookUrl(shop.facebook)}
              target="_blank"
              rel="noreferrer"
              className={linkClasses}
            >
              facebook.com/{shop.facebook}
            </a>
          </EditableRow>
        </ProofGroup>

        <ProofGroup title="Hours">
          <EditableRow
            mark="vi."
            label="Opening hours"
            {...rowProps("hours")}
            editor={<HoursEditForm hours={shop.hours} onClose={close} />}
          >
            <dl className="grid gap-1 text-sm">
              {groupHours(shop.hours).map((group) => (
                <div key={group.days} className="flex gap-4">
                  <dt className="w-20 shrink-0 uppercase tracking-widest">{group.days}</dt>
                  <dd className="text-muted-foreground">{group.hours}</dd>
                </div>
              ))}
            </dl>
          </EditableRow>
        </ProofGroup>
      </div>
    </div>
  );
}
