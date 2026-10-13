import { Link } from "react-router";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { ShoppingCart } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const footerLinks = [
  { label: "Home", to: "/" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Artists", to: "/artists" },
  { label: "After Care", to: "/after-care" },
  { label: "Pricing", to: "/pricing" },
  { label: "Shop", to: "/shop" },
];

export function SiteFooter() {
  return (
    <footer className="dark border-t border-border bg-background text-foreground print:hidden">
      <div className="mx-auto w-full max-w-screen-2xl px-6 py-12 lg:px-10 lg:py-16 xl:px-14 2xl:px-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-start lg:grid-cols-3 lg:gap-16">
          {/* Shop branding */}
          <div className="space-y-4">
            <Link to="/" aria-label="As Above Tattoo SLC home" className="inline-block max-w-full">
              <img
                src="/images/logos/shop-name-transparent.png"
                alt="As Above Tattoo SLC"
                className="block h-auto w-72 max-w-full object-contain"
              />
            </Link>

            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              Art that stays with you. Explore the artists, discover the work, and start planning
              your next tattoo.
            </p>

            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/asabovetattooslc/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex size-9 items-center justify-center text-accent transition-colors hover:text-accent-hover 2xl:size-10"
              >
                <FaInstagram className="size-5" aria-hidden="true" />
              </a>

              <a
                href="https://www.facebook.com/AsAboveTattooSLC"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex size-9 items-center justify-center text-accent transition-colors hover:text-accent-hover 2xl:size-10"
              >
                <FaFacebook className="size-5" aria-hidden="true" />
              </a>

              <Link
                to="/shop/cart"
                aria-label="Shopping cart"
                className="inline-flex size-9 items-center justify-center text-muted-foreground 2xl:size-10"
              >
                <ShoppingCart className="size-5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation" className="space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Explore
            </h2>

            <ul className="flex flex-col items-start gap-4">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm uppercase tracking-widest text-foreground/75 transition-colors hover:text-accent-hover"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Booking call to action */}
          <div className="space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Ready for your next tattoo?
            </h2>

            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              Have an idea in mind? Take the next step toward making it a reality.
            </p>

            <Link
              to="/booking"
              className={cn(
                buttonVariants({ variant: "brand", size: "cta" }),
                "px-6 text-xs text-accent",
              )}
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <p>&copy; {new Date().getFullYear()} As Above Tattoo SLC. All rights reserved.</p>

            <p>
              Website crafted by{" "}
              <Link
                to="https://auewellify.dev"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-accent transition-colors hover:text-accent-hover"
              >
                AuEwellify
              </Link>
            </p>
          </div>

          <p className="uppercase tracking-[0.15em]">Made for the art. Built to last.</p>
        </div>
      </div>
    </footer>
  );
}
