import { useState } from "react";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import {
  addressLines,
  facebookUrl,
  formatHours,
  formatPhone,
  groupHours,
  instagramUrl,
  mapsUrl,
  todaysHours,
  type ShopDetails,
} from "~/lib/shop";
import { SectionHeading } from "./section-heading";

const cellClasses = "flex flex-col bg-background p-8";
const titleClasses = "text-sm font-semibold uppercase tracking-[0.2em]";
const linkClasses =
  "inline-flex items-center gap-2 self-start border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em] transition-colors hover:text-accent-hover";

export function VisitStudio({ shop }: { shop: ShopDetails }) {
  // Read the clock once per visit, not on every render.
  const [now] = useState(() => new Date());
  const today = todaysHours(shop.hours, now);

  return (
    <section className="px-6 py-24 md:px-[6.2vw] md:py-32" aria-labelledby="visit-studio-title">
      <SectionHeading
        id="visit-studio-title"
        index="06"
        eyebrow="Visit"
        title="Visit the studio"
        description="Stop by, give us a call, or send a message. Here's where and when to find us."
      />

      <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-3">
        <div className={cellClasses}>
          <h3 className={titleClasses}>Address</h3>
          <address className="mt-3 text-sm leading-7 text-muted-foreground not-italic">
            {addressLines(shop).map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <a
            href={mapsUrl(shop)}
            target="_blank"
            rel="noreferrer"
            className={cn(linkClasses, "mt-auto pt-6")}
          >
            Get directions
            <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
        </div>

        <div className={cellClasses}>
          <h3 className={titleClasses}>Hours</h3>
          <p className="mt-3 font-display text-2xl uppercase text-accent">
            {today?.isOpen ? `Open today · ${formatHours(today)}` : "Closed today"}
          </p>
          <dl className="mt-4 grid gap-1 text-sm">
            {groupHours(shop.hours).map((group) => (
              <div key={group.days} className="flex gap-4">
                <dt className="w-20 shrink-0 uppercase tracking-widest text-foreground/75">
                  {group.days}
                </dt>
                <dd className="text-muted-foreground">{group.hours}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={cellClasses}>
          <h3 className={titleClasses}>Get in touch</h3>
          <a
            href={`tel:${shop.phone}`}
            className={cn(buttonVariants({ variant: "brand", size: "cta" }), "mt-4 self-start")}
          >
            <Phone className="size-4" strokeWidth={1.5} aria-hidden="true" />
            Call {formatPhone(shop.phone)}
          </a>

          <ul className="mt-auto flex flex-wrap gap-x-6 gap-y-3 pt-6">
            <li>
              <a
                href={instagramUrl(shop.instagram)}
                target="_blank"
                rel="noreferrer"
                className={linkClasses}
              >
                <FaInstagram className="size-3.5" aria-hidden="true" />@{shop.instagram}
              </a>
            </li>
            <li>
              <a
                href={facebookUrl(shop.facebook)}
                target="_blank"
                rel="noreferrer"
                className={linkClasses}
              >
                <FaFacebook className="size-3.5" aria-hidden="true" />
                Facebook
              </a>
            </li>
            {shop.email && (
              <li>
                <a href={`mailto:${shop.email}`} className={cn(linkClasses, "normal-case")}>
                  <Mail className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                  {shop.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
