import type { Route } from "./+types/booking";
import { Link } from "react-router";
import { ArrowDown } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { cn } from "~/lib/utils";
import { graphqlRequest } from "~/lib/graphql";
import type { Artist } from "~/components/artists/artist-list";
import { buttonVariants } from "~/components/ui/button";
import { PageHeader } from "~/components/shared/page-header";
import { BookingForm } from "~/components/booking/booking-form";

const BOOKING_QUERY = /* GraphQL */ `
  query Booking {
    artists {
      slug
      name
      isBooking
      instagram
    }
    bookingContent {
      intro
      steps {
        id
        title
        description
      }
      whyRequest
      disclaimer
    }
  }
`;

const BOOKING_ARTIST_QUERY = /* GraphQL */ `
  query BookingArtist($slug: String!) {
    artist(slug: $slug) {
      name
      instagram
    }
  }
`;

type BookingContentStepsValue = {
  id: string;
  title: string;
  description: string;
};

type BookingContent = {
  intro: string;
  steps: BookingContentStepsValue[];
  whyRequest: string;
  disclaimer: string;
};

export function meta() {
  return [
    { title: "Book a Tattoo | As Above Tattoo" },
    {
      name: "description",
      content:
        "Request a custom tattoo with an artist at As Above Tattoo in Salt Lake City. Share your idea and your artist will reach out to schedule.",
    },
  ] satisfies Route.MetaDescriptors;
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { artists, bookingContent } = await graphqlRequest<{
    artists: Pick<Artist, "slug" | "name" | "isBooking" | "instagram">[];
    bookingContent: BookingContent;
  }>(BOOKING_QUERY, undefined, request.signal);

  return { artists, bookingContent };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  console.log("Booking request:", Object.fromEntries(formData));

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const placement = String(formData.get("placement") ?? "").trim();
  const size = String(formData.get("size") ?? "");
  const idea = String(formData.get("idea") ?? "").trim();

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Please enter a valid email address.";
  if (!placement) errors.placement = "Let us know where you'd like the tattoo.";
  if (!size) errors.size = "Please choose an approximate size.";
  if (idea.length < 20)
    errors.idea = "Tell us a bit more about your idea (at least a sentence or two).";

  if (Object.keys(errors).length > 0) {
    return { ok: false as const, errors };
  }

  // TODO: send to the API, which emails the artist and saves it for the admin portal.
  await new Promise((resolve) => setTimeout(resolve, 800));

  // ORIGINAL: restore once booking requests are emailed to artists.
  // return { ok: true as const, name };
  // TEMPORARY: tells the user which artist to message on Instagram instead.
  const { artist } = await graphqlRequest<{
    artist: Pick<Artist, "name" | "instagram"> | null;
  }>(BOOKING_ARTIST_QUERY, { slug: String(formData.get("artist") ?? "") }, request.signal);

  return {
    ok: true as const,
    name,
    artist: artist?.instagram ? { name: artist.name, instagram: artist.instagram } : null,
  };
}

export default function Booking({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <>
      <section
        className="relative isolate overflow-hidden px-6 py-24 md:px-[6.2vw] md:py-32"
        aria-labelledby="booking-title"
      >
        <img
          src="/images/logos/booking-badge.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-4 -right-10 -z-10 w-[26rem] rotate-12 opacity-[0.18] dark:opacity-[0.07]"
        />

        <PageHeader
          eyebrow="Booking"
          title="Request a tattoo"
          titleId="booking-title"
          description={loaderData.bookingContent.intro}
        />

        <Link
          to="#request"
          className={cn(buttonVariants({ variant: "brand", size: "cta" }), "mt-10")}
        >
          Start your booking request
          <ArrowDown className="size-4" strokeWidth={1.5} />
        </Link>

        <ol className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
          {loaderData.bookingContent.steps.map((step, index) => (
            <li key={step.id} className="bg-background p-8">
              <span className="font-display text-3xl text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-6 text-sm font-semibold uppercase tracking-[0.2em]">
                {step.title}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 max-w-2xl">
          <p className="font-display text-xl leading-snug md:text-2xl">
            {loaderData.bookingContent.whyRequest}
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground/80 italic">
            {loaderData.bookingContent.disclaimer}
          </p>
        </div>
      </section>

      <section
        id="request"
        className="scroll-mt-28 bg-surface px-6 py-24 md:px-[6.2vw] md:py-32"
        aria-labelledby="request-title"
      >
        <h2
          id="request-title"
          className="font-display text-4xl uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl"
        >
          Your request
        </h2>

        {/* TEMPORARY: remove once booking requests are emailed to artists. */}
        <div className="mt-8 max-w-3xl border border-accent/40 bg-background p-6">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">
            Online requests coming soon
          </p>
          <p className="mt-3 leading-7">
            Requests sent through this form aren't delivered yet. For now, message your artist
            directly on Instagram:
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {loaderData.artists
              .filter((artist) => artist.instagram)
              .map((artist) => (
                <li key={artist.slug}>
                  <a
                    href={`https://www.instagram.com/${artist.instagram}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border-b border-accent pb-0.5 text-sm transition-colors hover:text-accent"
                  >
                    <FaInstagram className="size-4" aria-hidden="true" />
                    {artist.name} · @{artist.instagram}
                    {!artist.isBooking && (
                      <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                        Books closed
                      </span>
                    )}
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <div className="mt-12 max-w-3xl">
          {actionData?.ok ? (
            <>
              {/* ORIGINAL: restore once booking requests are emailed to artists.
              <p className="font-display text-2xl leading-snug md:text-3xl">
                Thanks, {actionData.name}. Your request is on its way, and your artist will reach
                out soon.
              </p>
              */}

              {/* TEMPORARY: requests aren't delivered yet, so point them to Instagram. */}
              <div>
                <p className="font-display text-2xl leading-snug md:text-3xl">
                  Thanks, {actionData.name}. Online requests aren't being delivered yet, so this one
                  wasn't sent.
                </p>
                <p className="mt-4 leading-7 text-muted-foreground">
                  {actionData.artist ? (
                    <>
                      Please message {actionData.artist.name} on Instagram at{" "}
                      <a
                        href={`https://www.instagram.com/${actionData.artist.instagram}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="border-b border-accent text-foreground"
                      >
                        @{actionData.artist.instagram}
                      </a>{" "}
                      with your idea.
                    </>
                  ) : (
                    "Please message one of our artists on Instagram using the links above."
                  )}
                </p>
              </div>
            </>
          ) : (
            <BookingForm artists={loaderData.artists} />
          )}
        </div>
      </section>
    </>
  );
}
