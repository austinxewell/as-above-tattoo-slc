import type { Route } from "./+types/booking";
import { Link } from "react-router";
import { ArrowDown } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { PageHeader } from "~/components/shared/page-header";
import { BookingForm } from "~/components/booking/booking-form";

// Mock Data:
import bookingData from "~/mocks/booking.json";
import artistsData from "~/mocks/artists.json";

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

export async function clientLoader() {
  const artists = artistsData.artists.map((artist) => ({
    slug: artist.slug,
    name: artist.name,
    isBooking: artist.isBooking,
  }));

  return { ...bookingData, artists };
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
          description={loaderData.intro}
        />

        <Link
          to="#request"
          className={cn(buttonVariants({ variant: "brand", size: "cta" }), "mt-10")}
        >
          Start your request
          <ArrowDown className="size-4" strokeWidth={1.5} />
        </Link>

        <ol className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
          {loaderData.steps.map((step, index) => (
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
          <p className="font-display text-xl leading-snug md:text-2xl">{loaderData.whyRequest}</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground/80 italic">
            {loaderData.disclaimer}
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
          {actionData?.ok ? (
            <p className="font-display text-2xl leading-snug md:text-3xl">
              Thanks, {actionData.name}. Your request is on its way, and your artist will reach out
              soon.
            </p>
          ) : (
            <BookingForm artists={loaderData.artists} />
          )}
        </div>
      </section>
    </>
  );
}
