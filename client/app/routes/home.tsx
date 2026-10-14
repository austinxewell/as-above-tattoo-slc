import type { Route } from "./+types/home";
import { graphqlRequest } from "~/lib/graphql";
import { Hero } from "~/components/home/hero";
import { PortfolioPreview } from "~/components/home/portfolio-preview";
import { AboutPreview } from "~/components/home/about-preview";
import { ArtistsPreview } from "~/components/home/artists-preview";
import { StudioProcess } from "~/components/home/studio-process";

// Mock Data:
import homeData from "~/mocks/home.json";

const ABOUT_QUERY = /* GraphQL */ `
  query About {
    about {
      heading
      body
      values {
        id
        title
        description
      }
    }
  }
`;

type About = {
  heading: string;
  body: string;
  values: { id: string; title: string; description: string }[];
};

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

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { about } = await graphqlRequest<{ about: About }>(ABOUT_QUERY, undefined, request.signal);
  return { about };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Hero />
      <PortfolioPreview portfolio={homeData.portfolio} />
      <AboutPreview about={loaderData.about} />
      <ArtistsPreview artists={homeData.artists} />
      <StudioProcess />
    </>
  );
}
