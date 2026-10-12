import type { Route } from "./+types/home";
import { Hero } from "~/components/home/hero";
import { PortfolioPreview } from "~/components/home/portfolio-preview";
import { AboutPreview } from "~/components/home/about-preview";
import { ArtistsPreview } from "~/components/home/artists-preview";
import { StudioProcess } from "~/components/home/studio-process";

// Mock Data:
import homeData from "~/mocks/home.json";

export function meta() {
  return [
    { title: "As Above Tattoo | Custom Tattoo Studio in Salt Lake City" },
    {
      name: "description",
      content:
        "Discover custom tattoo art at As Above Tattoo in Salt Lake City, Utah. Explore our artists, portfolio, and booking options.",
    },
  ] satisfies Route.MetaDescriptors;
}

export default function Home() {
  return (
    <>
      <Hero />
      <PortfolioPreview portfolio={homeData.portfolio} />
      <AboutPreview about={homeData.about} />
      <ArtistsPreview artists={homeData.artists} />
      <StudioProcess />
    </>
  );
}
