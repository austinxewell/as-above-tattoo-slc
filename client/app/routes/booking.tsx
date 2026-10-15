import type { Route } from "./+types/booking";
import { Link, type ShouldRevalidateFunctionArgs } from "react-router";
import { ArrowDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { graphqlRequest } from "~/lib/graphql";
import type { Artist } from "~/components/artists/artist-list";
import { buttonVariants } from "~/components/ui/button";
import { PageHeader } from "~/components/shared/page-header";
import { BookingForm } from "~/components/booking/booking-form";
import { BookingSuccess } from "~/components/booking/booking-success";
import { InstagramNotice } from "~/components/booking/instagram-notice";

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
    bookingRequestsEnabled
  }
`;

const REQUEST_BOOKING_MUTATION = /* GraphQL */ `
  mutation RequestBooking($input: BookingRequestInput!) {
    requestBooking(input: $input)
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
  const { artists, bookingContent, bookingRequestsEnabled } = await graphqlRequest<{
    artists: Pick<Artist, "slug" | "name" | "isBooking" | "instagram">[];
    bookingContent: BookingContent;
    bookingRequestsEnabled: boolean;
  }>(BOOKING_QUERY, undefined, request.signal);

  return { artists, bookingContent, bookingRequestsEnabled };
}

export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (formMethod === "POST") return false;
  return defaultShouldRevalidate;
}

function toFormError(error: unknown) {
  if (error instanceof TypeError) {
    return "We couldn't reach our booking system. Check your connection and try again in a moment.";
  }

  if (
    error instanceof Error &&
    error.message !== "Unexpected error." &&
    !error.message.startsWith("API request failed")
  ) {
    return error.message;
  }

  return "Something went wrong on our end. Please try again in a moment.";
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

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

  const optional = (field: string) => String(formData.get(field) ?? "").trim() || null;
  const artist = String(formData.get("artist") ?? "");

  try {
    await graphqlRequest(
      REQUEST_BOOKING_MUTATION,
      {
        input: {
          artist: artist === "any" ? null : artist,
          name,
          email,
          phone: optional("phone"),
          placement,
          size,
          budget: optional("budget"),
          idea,
          availability: optional("availability"),
          website: optional("website"),
        },
      },
      request.signal,
    );
  } catch (error) {
    return { ok: false as const, errors: { form: toFormError(error) } };
  }

  return { ok: true as const, name };
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

        <div className="mt-12 max-w-3xl">
          {!loaderData.bookingRequestsEnabled ? (
            <InstagramNotice artists={loaderData.artists} />
          ) : actionData?.ok ? (
            <BookingSuccess name={actionData.name} />
          ) : (
            <BookingForm artists={loaderData.artists} />
          )}
        </div>
      </section>
    </>
  );
}
