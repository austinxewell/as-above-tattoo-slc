import type { Route } from "./+types/after-care";
import { useRouteLoaderData, useSearchParams } from "react-router";
import { graphqlRequest } from "~/lib/graphql";
import { facebookUrl, formatPhone, instagramUrl } from "~/lib/shop";
import type { clientLoader as siteLayoutLoader } from "~/layouts/site-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Check, X, TriangleAlert, Printer } from "lucide-react";
import { PageHeader } from "~/components/shared/page-header";
import { HealingTimeline } from "~/components/after-care/healing-timeline";

const contactLinkClasses =
  "border-b border-accent text-foreground transition-colors hover:text-accent-hover";

const AFTER_CARE_QUERY = /* GraphQL */ `
  query AfterCare {
    afterCare {
      intro
      disclaimer
      methods {
        id
        slug
        name
        description
        stages {
          id
          timeframe
          title
          steps
        }
      }
      dos
      donts
      warningSigns
    }
  }
`;

type MethodStageValue = {
  id: string;
  timeframe: string;
  title: string;
  steps: string[];
};

type AfterCareMethodValue = {
  id: string;
  slug: string;
  name: string;
  description: string;
  stages: MethodStageValue[];
};

type AfterCareData = {
  intro: string;
  disclaimer: string;
  methods: AfterCareMethodValue[];
  dos: string[];
  donts: string[];
  warningSigns: string[];
};

export function meta() {
  return [
    { title: "After Care | As Above Tattoo" },
    {
      name: "description",
      content:
        "How to care for your new tattoo, with healing timelines for standard wraps and adhesive film like Saniderm.",
    },
  ] satisfies Route.MetaDescriptors;
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { afterCare } = await graphqlRequest<{
    afterCare: AfterCareData;
  }>(AFTER_CARE_QUERY, undefined, request.signal);

  return { afterCare };
}

export default function AfterCare({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const shop = useRouteLoaderData<typeof siteLayoutLoader>("layouts/site-layout")?.shop;
  const { methods } = loaderData.afterCare;
  const activeMethod =
    methods.find((method) => method.slug === searchParams.get("method")) ?? methods[0];

  return (
    <>
      <section
        className="relative isolate overflow-hidden px-6 py-24 md:px-[6.2vw] md:py-32"
        aria-labelledby="after-care-title"
      >
        <img
          src="/images/logos/after-care-badge.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-4 -right-10 -z-10 w-[26rem] rotate-12 opacity-[0.18] dark:opacity-[0.07]"
        />

        <PageHeader
          eyebrow="Healing guide"
          title="After care"
          titleId="after-care-title"
          description={loaderData.afterCare.intro}
        />

        <p className="mt-6 max-w-md text-sm leading-6 text-muted-foreground/80 italic">
          {loaderData.afterCare.disclaimer}
        </p>

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-8 inline-flex items-center gap-3 border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em] print:hidden"
        >
          <Printer className="size-4" strokeWidth={1.5} aria-hidden="true" />
          Print these instructions
        </button>

        <Tabs
          value={activeMethod.slug}
          onValueChange={(value) =>
            setSearchParams({ method: String(value) }, { replace: true, preventScrollReset: true })
          }
          className="mt-16"
        >
          <TabsList
            variant="line"
            className="w-full items-stretch justify-start gap-8 border-b border-border group-data-horizontal/tabs:h-auto"
          >
            {methods.map((method) => (
              <TabsTrigger
                key={method.slug}
                value={method.slug}
                className="min-w-0 shrink justify-start h-auto items-start text-left px-0 pb-4 text-[0.65rem] uppercase tracking-[0.2em] whitespace-normal after:bg-accent data-active:text-accent"
              >
                {method.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {methods.map((method) => (
            <TabsContent key={method.slug} value={method.slug} className="mt-10">
              <p className="max-w-md leading-7 text-muted-foreground">{method.description}</p>

              <HealingTimeline stages={method.stages} />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section
        className="bg-surface px-6 py-24 md:px-[6.2vw] md:py-32 break-inside-avoid print:py-8"
        aria-labelledby="dos-donts-title"
      >
        <h2
          id="dos-donts-title"
          className="font-display text-4xl uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl"
        >
          Do's and don'ts
        </h2>

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="break-inside-avoid">
            <h3 className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">Do</h3>
            <ul className="mt-6 flex flex-col">
              {loaderData.afterCare.dos.map((item) => (
                <li
                  key={item}
                  className="flex gap-4 border-t border-border py-4 leading-7 last:border-b"
                >
                  <Check className="mt-1.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="break-inside-avoid">
            <h3 className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              Don't
            </h3>
            <ul className="mt-6 flex flex-col">
              {loaderData.afterCare.donts.map((item) => (
                <li
                  key={item}
                  className="flex gap-4 border-t border-border py-4 leading-7 last:border-b"
                >
                  <X className="mt-1.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-[6.2vw] md:py-32" aria-labelledby="warning-signs-title">
        <div className="border border-destructive/50 bg-destructive/5 p-8 md:p-12 break-inside-avoid">
          <div className="flex items-center gap-3 text-destructive">
            <TriangleAlert className="size-5 shrink-0" aria-hidden="true" />
            <h2
              id="warning-signs-title"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.2em]"
            >
              When to get help
            </h2>
          </div>

          <p className="mt-6 max-w-2xl font-display text-2xl leading-snug md:text-3xl">
            Contact a doctor if you notice any of these signs of infection or an allergic reaction.
          </p>

          <ul className="mt-8 grid gap-x-12 gap-y-3 md:grid-cols-2">
            {loaderData.afterCare.warningSigns.map((sign) => (
              <li key={sign} className="flex gap-3 leading-7">
                <span className="text-destructive" aria-hidden="true">
                  &mdash;
                </span>
                {sign}
              </li>
            ))}
          </ul>

          <p className="mt-10 border-t border-destructive/30 pt-6 text-sm leading-6 text-muted-foreground">
            Fever, chills, or red streaks spreading from the tattoo need medical attention right
            away.
            {shop && (
              <>
                {" "}
                For other healing questions, contact the shop at{" "}
                <a href={`tel:${shop.phone}`} className={contactLinkClasses}>
                  {formatPhone(shop.phone)}
                </a>
                , on{" "}
                <a
                  href={instagramUrl(shop.instagram)}
                  target="_blank"
                  rel="noreferrer"
                  className={contactLinkClasses}
                >
                  Instagram
                </a>
                {shop.email ? ", " : " or "}
                <a
                  href={facebookUrl(shop.facebook)}
                  target="_blank"
                  rel="noreferrer"
                  className={contactLinkClasses}
                >
                  Facebook
                </a>
                {shop.email && (
                  <>
                    , or by email at{" "}
                    <a href={`mailto:${shop.email}`} className={contactLinkClasses}>
                      {shop.email}
                    </a>
                  </>
                )}
                .
              </>
            )}
          </p>
        </div>
      </section>
    </>
  );
}
