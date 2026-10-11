import { useState } from "react";
import { Link } from "react-router";
import { SiteNavigation } from "./site-navigation";
import { ThemeToggle } from "../theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-[#151515] text-[#f2ede4]">
      <div className="relative mx-auto flex min-h-20 w-full max-w-screen-2xl items-center justify-between gap-8 px-6 lg:px-10 xl:px-14 2xl:px-16">
        <Link
          to="/"
          className="w-64 shrink-0 md:w-80 xl:w-96"
          aria-label="As Above Tattoo SLC home"
        >
          <img
            src="/images/logos/shop-name-transparent.png"
            alt="As Above Tattoo SLC"
            className="block h-auto w-full object-contain"
          />
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
          <SiteNavigation />
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <ThemeToggle />

          <a
            href="#booking"
            className="border border-[#c5a15b] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a15b] transition-colors hover:bg-[#c5a15b] hover:text-[#151515]"
          >
            Book Now
          </a>
        </div>

        <div className="lg:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              className="inline-flex size-9 items-center justify-center rounded-md border border-[#45403a] bg-transparent text-[#f2ede4] transition-colors hover:bg-[#2d2a27] hover:text-[#ddbd7b]"
            >
              <span className="text-xl" aria-hidden="true">
                ☰
              </span>
            </SheetTrigger>

            <SheetContent side="right" className="border-[#45403a] bg-[#151515] text-[#f2ede4]">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    to="/"
                    aria-label="As Above Tattoo SLC home"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <img
                      src="/images/logos/shop-name-transparent.png"
                      alt="As Above Tattoo SLC"
                      className="block h-auto w-52 max-w-full object-contain"
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="px-4">
                <SiteNavigation orientation="vertical" onNavigate={() => setIsMenuOpen(false)} />

                <a
                  href="#booking"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-8 inline-flex border border-[#c5a15b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a15b] transition-colors hover:bg-[#c5a15b] hover:text-[#151515]"
                >
                  Book Now
                </a>

                <div className="mt-8 border-t border-[#45403a] pt-6">
                  <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#b8afa3]">
                    Appearance
                  </p>
                  <ThemeToggle showLabel />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
