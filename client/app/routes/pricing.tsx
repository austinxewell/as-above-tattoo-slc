import type { Route } from "./+types/pricing";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { graphqlRequest } from "~/lib/graphql";
import type { Artist } from "~/components/artists/artist-list";
import { PageHeader } from "~/components/shared/page-header";

const PRICING_QUERY = /* GraphQL */ `
  query Pricing {
    artists {
      slug
      name
      isBooking
      booking {
        minimum
        rate
        deposit
      }
    }
    pricing {
      intro
      shopMinimum
      factors {
        id
        title
        description
      }
      policies {
        id
        title
        description
      }
      faqs {
        id
        question
        answer
      }
    }
  }
`;

type PricingArtist = Pick<Artist, "slug" | "name" | "isBooking"> & {
  booking: { minimum: string; rate: string; deposit: string };
};

type PricingFactorAndPolicyValue = {
  id: string;
  title: string;
  description: string;
};

type PricingFaqValue = {
  id: string;
  question: string;
  answer: string;
};

type PricingData = {
  intro: string;
  shopMinimum: string;
  factors: PricingFactorAndPolicyValue[];
  policies: PricingFactorAndPolicyValue[];
  faqs: PricingFaqValue[];
};

export function meta() {
  return [
    { title: "Pricing | As Above Tattoo" },
    {
      name: "description",
      content:
        "How custom tattoo pricing works at As Above Tattoo in Salt Lake City, with rates by artist, deposits, and shop policies.",
    },
  ] satisfies Route.MetaDescriptors;
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { artists, pricing } = await graphqlRequest<{
    artists: PricingArtist[];
    pricing: PricingData;
  }>(PRICING_QUERY, undefined, request.signal);

  const artistRates = artists.map((artist) => ({
    slug: artist.slug,
    name: artist.name,
    isBooking: artist.isBooking,
    minimum: artist.booking.minimum,
    rate: artist.booking.rate,
    deposit: artist.booking.deposit,
  }));

  return { pricing, artistRates };
}

export default function Pricing({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <section
        className="relative isolate overflow-hidden px-6 py-24 md:px-[6.2vw] md:py-32"
        aria-labelledby="pricing-title"
      >
        <img
          src="/images/logos/tarot-card-transparent.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-4 -right-10 -z-10 w-[20rem] opacity-[0.18] dark:opacity-[0.07] -rotate-20"
        />

        <PageHeader
          eyebrow="Pricing"
          title="What it costs"
          titleId="pricing-title"
          description={loaderData.pricing.intro}
        />

        <p className="mt-8 inline-flex items-baseline gap-3 border border-accent/40 px-5 py-3">
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">
            Shop minimum
          </span>
          <span className="font-display text-2xl">{loaderData.pricing.shopMinimum}</span>
        </p>
      </section>

      <section
        className="bg-surface px-6 py-24 md:px-[6.2vw] md:py-32"
        aria-labelledby="factors-title"
      >
        <div className="grid gap-14 lg:grid-cols-[1fr_2fr] lg:gap-24">
          <div>
            <h2
              id="factors-title"
              className="font-display text-4xl uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl"
            >
              What affects the price
            </h2>
            <p className="mt-6 max-w-sm leading-7 text-muted-foreground">
              Your artist will give you a quote once they know your idea, size, and placement.
            </p>
          </div>

          <dl>
            {loaderData.pricing.factors.map((factor, index) => (
              <div
                key={factor.id}
                className="grid gap-2 border-t border-border py-7 last:border-b sm:grid-cols-[12rem_1fr] sm:gap-8"
              >
                <dt className="flex items-baseline gap-4">
                  <span className="text-[0.65rem] tracking-[0.2em] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-2xl">{factor.title}</span>
                </dt>
                <dd className="leading-7 text-muted-foreground">{factor.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="px-6 py-24 md:px-[6.2vw] md:py-32" aria-labelledby="rates-title">
        <h2
          id="rates-title"
          className="font-display text-4xl uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl"
        >
          Rates by artist
        </h2>
        <p className="mt-6 max-w-md leading-7 text-muted-foreground">
          Each artist sets their own rates. Your final price depends on your design.
        </p>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">Minimum, hourly rate, and deposit for each artist</caption>
            <thead>
              <tr className="border-b border-accent/40 text-[0.65rem] uppercase tracking-[0.2em] text-accent">
                <th scope="col" className="py-4 pr-6 font-medium">
                  Artist
                </th>
                <th scope="col" className="py-4 pr-6 font-medium">
                  Minimum
                </th>
                <th scope="col" className="py-4 pr-6 font-medium">
                  Rate
                </th>
                <th scope="col" className="py-4 font-medium">
                  Deposit
                </th>
              </tr>
            </thead>
            <tbody>
              {loaderData.artistRates.map((artist) => (
                <tr key={artist.slug} className="border-b border-border align-top">
                  <th scope="row" className="py-5 pr-6 font-normal">
                    <Link
                      to={`/artists/${artist.slug}`}
                      className="font-display text-xl transition-colors hover:text-accent"
                    >
                      {artist.name}
                    </Link>
                    {!artist.isBooking && (
                      <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                        Books closed
                      </span>
                    )}
                  </th>
                  <td className="py-5 pr-6">{artist.minimum}</td>
                  <td className="py-5 pr-6">{artist.rate}</td>
                  <td className="py-5 text-muted-foreground">{artist.deposit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        className="bg-surface px-6 py-24 md:px-[6.2vw] md:py-32"
        aria-labelledby="policies-title"
      >
        <h2
          id="policies-title"
          className="font-display text-4xl uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl"
        >
          Shop policies
        </h2>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {loaderData.pricing.policies.map((policy) => (
            <li key={policy.id} className="border border-border bg-background p-8">
              <h3 className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">
                {policy.title}
              </h3>
              <p className="mt-4 leading-7">{policy.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-6 py-24 md:px-[6.2vw] md:py-32" aria-labelledby="faq-title">
        <h2
          id="faq-title"
          className="font-display text-4xl uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl"
        >
          Questions
        </h2>

        <div className="mt-12 max-w-3xl">
          {loaderData.pricing.faqs.map((faq) => (
            <details key={faq.id} className="group border-t border-border last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl md:text-2xl [&::-webkit-details-marker]:hidden">
                {faq.question}
                <Plus
                  className="size-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-2xl pb-6 leading-7 text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
