import { useState } from "react";
import {
  isProfileTextField,
  type ArtistProfile,
  type ProfileTextField,
} from "~/lib/artist-profile";
import { ProofGroup } from "./proof-row";
import { ProfilePreview } from "./profile-preview";
import { BooksToggle } from "./books-toggle";
import { EditableRow } from "./editable-row";
import { TextEditForm } from "./text-edit-form";
import { ListEditForm } from "./list-edit-form";
import { BookingEditForm } from "./booking-edit-form";
import { PublishPanel } from "./publish-panel";
import { ArtistPhoto } from "~/components/shared/artist-photo";

const quietClasses = "text-sm text-muted-foreground";

type EditableField = ProfileTextField | "specialties" | "prices" | "notes";
type EditingState = { field: EditableField; draft: string } | null;

export function ArtistProfileEditor({
  artist,
  eyebrow = "My Profile",
  canUnpublish = false,
}: {
  artist: ArtistProfile;
  eyebrow?: string;
  canUnpublish?: boolean;
}) {
  const [editing, setEditing] = useState<EditingState>(null);
  const previewArtist =
    editing && isProfileTextField(editing.field)
      ? { ...artist, [editing.field]: editing.draft }
      : artist;

  const close = () => setEditing(null);

  function rowProps(field: EditableField) {
    return {
      isEditing: editing?.field === field,
      onEdit: () =>
        setEditing({ field, draft: isProfileTextField(field) ? (artist[field] ?? "") : "" }),
    };
  }

  function textProps(field: ProfileTextField) {
    return {
      field,
      draft: editing?.field === field ? editing.draft : "",
      onDraftChange: (draft: string) => setEditing({ field, draft }),
      onClose: close,
    };
  }

  const { minimum, rate, deposit, availability, notes } = artist.booking;

  return (
    <article>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl uppercase leading-none md:text-5xl">
            {artist.name}
          </h1>
        </div>
        <BooksToggle isBooking={artist.isBooking} />
      </header>

      <PublishPanel
        isPublished={artist.isPublished}
        checklist={artist.publishChecklist}
        canUnpublish={canUnpublish}
      />

      <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid min-w-0 content-start gap-10">
          <ProofGroup title="About You">
            <EditableRow
              mark="i."
              label="Name"
              {...rowProps("name")}
              editor={
                <TextEditForm
                  label="Name"
                  maxLength={60}
                  hint="Your page link stays the same"
                  {...textProps("name")}
                />
              }
            >
              {artist.name}
            </EditableRow>

            <EditableRow
              mark="ii."
              label="Photo"
              {...rowProps("imgUrl")}
              editor={
                <TextEditForm
                  label="Photo"
                  inputType="url"
                  maxLength={2048}
                  hint="Paste an https:// address for an image"
                  {...textProps("imgUrl")}
                />
              }
            >
              <div className="flex items-center gap-4">
                <ArtistPhoto
                  src={artist.imgUrl}
                  alt=""
                  compact
                  className="size-14 shrink-0 border border-border"
                />

                <p className={`min-w-0 break-all ${quietClasses}`}>
                  {artist.imgUrl || "No photo yet"}
                </p>
              </div>
            </EditableRow>

            <EditableRow
              mark="iii."
              label="Specialties"
              {...rowProps("specialties")}
              editor={
                <ListEditForm
                  label="Specialties"
                  itemLabel="specialty"
                  intent="specialties"
                  name="specialties"
                  maxItems={10}
                  maxLength={40}
                  placeholder="e.g. Fine line"
                  initialItems={artist.specialties}
                  onClose={close}
                />
              }
            >
              {artist.specialties.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {artist.specialties.map((specialty) => (
                    <li
                      key={specialty}
                      className="border border-border px-2.5 py-0.5 text-[0.62rem] uppercase tracking-[0.15em]"
                    >
                      {specialty}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className={quietClasses}>None added</span>
              )}
            </EditableRow>

            <EditableRow
              mark="iv."
              label="Bio"
              {...rowProps("bio")}
              editor={<TextEditForm label="Bio" multiline maxLength={1500} {...textProps("bio")} />}
            >
              <p className="max-w-prose whitespace-pre-line leading-7">{artist.bio}</p>
            </EditableRow>

            <EditableRow
              mark="v."
              label="Statement"
              {...rowProps("statement")}
              editor={
                <TextEditForm
                  label="Statement"
                  multiline
                  maxLength={400}
                  hint="Shown as a quote on your page"
                  {...textProps("statement")}
                />
              }
            >
              <p className="max-w-prose font-display italic leading-snug">
                &ldquo;{artist.statement}&rdquo;
              </p>
            </EditableRow>

            <EditableRow
              mark="vi."
              label="Instagram"
              {...rowProps("instagram")}
              editor={
                <TextEditForm
                  label="Instagram"
                  maxLength={30}
                  hint="Just your handle, without the @"
                  {...textProps("instagram")}
                />
              }
            >
              {artist.instagram ? (
                `@${artist.instagram}`
              ) : (
                <span className={quietClasses}>Not added</span>
              )}
            </EditableRow>
          </ProofGroup>

          <ProofGroup title="Booking Details">
            <EditableRow
              mark="vii."
              label="Prices & dates"
              {...rowProps("prices")}
              editor={<BookingEditForm booking={artist.booking} onClose={close} />}
            >
              <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[auto_minmax(0,1fr)]">
                {[
                  ["Minimum", minimum],
                  ["Rate", rate],
                  ["Deposit", deposit],
                  ["Availability", availability],
                ].map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground sm:pt-1">
                      {label}
                    </dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </EditableRow>

            <EditableRow
              mark="viii."
              label="Notes"
              {...rowProps("notes")}
              editor={
                <ListEditForm
                  label="Booking notes"
                  itemLabel="note"
                  intent="booking"
                  name="notes"
                  maxItems={8}
                  maxLength={200}
                  placeholder="e.g. No cover-ups"
                  initialItems={notes}
                  hidden={{ minimum, rate, deposit, availability }}
                  onClose={close}
                />
              }
            >
              {notes.length > 0 ? (
                <ul className="grid list-disc gap-1.5 pl-5 marker:text-accent">
                  {notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              ) : (
                <span className={quietClasses}>No notes</span>
              )}
            </EditableRow>
          </ProofGroup>
        </div>

        <ProfilePreview artist={previewArtist} />
      </div>
    </article>
  );
}
