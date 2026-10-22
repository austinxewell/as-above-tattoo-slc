import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Link } from "react-router";
import { SiteNavigation } from "./site-navigation";
import { ThemeToggle } from "../theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { MenuTrigger } from "../shared/menu-trigger";
import { AppearanceSection } from "../shared/appearance-section";
import { facebookUrl, instagramUrl, type ShopDetails } from "~/lib/shop";

export function SiteHeader({ shop }: { shop?: ShopDetails | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="dark sticky top-0 z-50 border-b border-border bg-background text-foreground print:hidden">
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
          {shop && (
            <>
              <a
                href={instagramUrl(shop.instagram)}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex size-9 items-center justify-center text-accent transition-colors hover:text-accent-hover 2xl:size-10"
              >
                <FaInstagram className="size-5" aria-hidden="true" />
              </a>

              <a
                href={facebookUrl(shop.facebook)}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex size-9 items-center justify-center text-accent transition-colors hover:text-accent-hover 2xl:size-10"
              >
                <FaFacebook className="size-5" aria-hidden="true" />
              </a>
            </>
          )}

          <Link
            to="/shop/cart"
            aria-label="Shopping cart"
            className="inline-flex size-9 items-center justify-center text-muted-foreground 2xl:size-10"
          >
            <ShoppingCart className="size-5" aria-hidden="true" />
          </Link>

          <ThemeToggle />

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

        {/* Mobile and tablet navigation */}
        <div className="lg:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <MenuTrigger label="Open navigation menu" />

            <SheetContent
              side="right"
              className="dark overflow-y-auto border-border bg-background text-foreground"
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
                  className={cn(
                    buttonVariants({ variant: "brand", size: "cta" }),
                    "mt-8 text-xs text-accent",
                  )}
                >
                  Book Now
                </Link>

                <div className="mt-8 flex items-center gap-5 border-t border-border pt-6">
                  {shop && (
                    <>
                      <a
                        href={instagramUrl(shop.instagram)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Instagram"
                        className="inline-flex size-10 items-center justify-center text-accent transition-colors hover:text-accent-hover"
                      >
                        <FaInstagram className="size-5" aria-hidden="true" />
                      </a>

                      <a
                        href={facebookUrl(shop.facebook)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Facebook"
                        className="inline-flex size-9 items-center justify-center text-accent transition-colors hover:text-accent-hover 2xl:size-10"
                      >
                        <FaFacebook className="size-5" aria-hidden="true" />
                      </a>
                    </>
                  )}

                  <Link
                    to="/shop/cart"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Shopping cart"
                    className="inline-flex size-9 items-center justify-center text-muted-foreground 2xl:size-10"
                  >
                    <ShoppingCart className="size-5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <AppearanceSection />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
