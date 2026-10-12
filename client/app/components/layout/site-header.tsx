import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Link } from "react-router";
import { SiteNavigation } from "./site-navigation";
import { ThemeToggle } from "../theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#45403a] bg-[#151515] text-[#f2ede4]">
      <div className="mx-auto flex min-h-24 w-full max-w-screen-2xl items-center justify-between gap-4 px-6 py-3 lg:gap-5 lg:px-8 2xl:gap-6 2xl:px-12">
        {/* Shop branding and desktop navigation */}
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4 2xl:gap-6">
          <Link
            to="/"
            className="flex w-28 shrink-0 items-center sm:w-32 2xl:w-36"
            aria-label="As Above Tattoo SLC home"
          >
            <img
              src="/images/logos/stacked-shop-name-transparent.png"
              alt="As Above Tattoo SLC"
              className="block max-h-16 w-full object-contain"
            />
          </Link>

          <div className="hidden min-w-0 lg:block">
            <SiteNavigation />
          </div>
        </div>

        {/* Desktop utility controls */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex 2xl:gap-3">
          <a
            href="https://www.instagram.com/asabovetattooslc/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="inline-flex size-9 items-center justify-center text-[#c5a15b] transition-colors hover:text-[#ddbd7b] 2xl:size-10"
          >
            <FaInstagram className="size-5" aria-hidden="true" />
          </a>

          <a
            href="https://www.facebook.com/AsAboveTattooSLC"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="inline-flex size-9 items-center justify-center text-[#c5a15b] transition-colors hover:text-[#ddbd7b] 2xl:size-10"
          >
            <FaFacebook className="size-5" aria-hidden="true" />
          </a>

          <Link
            to="/shop/cart"
            aria-label="Shopping cart"
            className="inline-flex size-9 items-center justify-center text-[#b8afa3] 2xl:size-10"
          >
            <ShoppingCart className="size-5" aria-hidden="true" />
          </Link>

          <ThemeToggle />

          <Link
            to="/booking"
            className="inline-flex border border-[#c5a15b] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a15b] transition-colors hover:bg-[#c5a15b] hover:text-[#151515] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ddbd7b]"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile and tablet navigation */}
        <div className="lg:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              className="inline-flex size-10 items-center justify-center rounded-md border border-[#45403a] bg-transparent text-[#f2ede4] transition-colors hover:bg-[#2d2a27] hover:text-[#ddbd7b]"
            >
              <span className="text-xl" aria-hidden="true">
                ☰
              </span>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="overflow-y-auto border-[#45403a] bg-[#151515] text-[#f2ede4]"
            >
              <SheetHeader>
                <SheetTitle>
                  <Link
                    to="/"
                    aria-label="As Above Tattoo SLC home"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <img
                      src="/images/logos/stacked-shop-name-transparent.png"
                      alt="As Above Tattoo SLC"
                      className="block max-h-20 w-36 max-w-full object-contain"
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="px-4 pb-8">
                <SiteNavigation orientation="vertical" onNavigate={() => setIsMenuOpen(false)} />

                <Link
                  to="/booking"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-8 inline-flex border border-[#c5a15b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a15b] transition-colors hover:bg-[#c5a15b] hover:text-[#151515]"
                >
                  Book Now
                </Link>

                <div className="mt-8 flex items-center gap-5 border-t border-[#45403a] pt-6">
                  <a
                    href="https://www.instagram.com/asabovetattooslc/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="inline-flex size-10 items-center justify-center text-[#c5a15b] transition-colors hover:text-[#ddbd7b]"
                  >
                    <FaInstagram className="size-5" aria-hidden="true" />
                  </a>

                  <a
                    href="https://www.facebook.com/AsAboveTattooSLC"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="inline-flex size-9 items-center justify-center text-[#c5a15b] transition-colors hover:text-[#ddbd7b] 2xl:size-10"
                  >
                    <FaFacebook className="size-5" aria-hidden="true" />
                  </a>

                  <Link
                    to="/shop/cart"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Shopping cart"
                    className="inline-flex size-9 items-center justify-center text-[#b8afa3] 2xl:size-10"
                  >
                    <ShoppingCart className="size-5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-6 border-t border-[#45403a] pt-6">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#b8afa3]">
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
