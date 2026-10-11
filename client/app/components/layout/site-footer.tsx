import { Link } from "react-router";

const footerLinks = [
  { label: "Home", to: "/" },
  { label: "Artists", to: "/artists" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "After Care", to: "/after-care" },
  { label: "Pricing", to: "/pricing" },
  { label: "Shop", to: "/shop" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#45403a] bg-[#151515] text-[#f2ede4]">
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

            <p className="max-w-sm text-sm leading-7 text-[#b8afa3]">
              Art that stays with you. Explore the artists, discover the work, and start planning
              your next tattoo.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation" className="space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a15b]">
              Explore
            </h2>

            <ul className="flex flex-col items-start gap-4">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm uppercase tracking-widest text-[#f2ede4]/75 transition-colors hover:text-[#ddbd7b]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Booking call to action */}
          <div className="space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a15b]">
              Ready for your next tattoo?
            </h2>

            <p className="max-w-sm text-sm leading-7 text-[#b8afa3]">
              Have an idea in mind? Take the next step toward making it a reality.
            </p>

            <a
              href="#booking"
              className="inline-flex border border-[#c5a15b] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a15b] transition-colors hover:bg-[#c5a15b] hover:text-[#151515] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ddbd7b]"
            >
              Book Now
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col gap-3 border-t border-[#45403a] pt-6 text-xs text-[#b8afa3] sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <p>&copy; {new Date().getFullYear()} As Above Tattoo SLC. All rights reserved.</p>

            <p>
              Website crafted by{" "}
              <Link
                to="https://auewellify.dev"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#c5a15b] transition-colors hover:text-[#ddbd7b]"
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
