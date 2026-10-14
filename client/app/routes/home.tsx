import type { Route } from "./+types/home";
import { graphqlRequest } from "~/lib/graphql";
import type { Artist } from "~/components/artists/artist-list";
import { Hero } from "~/components/home/hero";
import { PortfolioPreview } from "~/components/home/portfolio-preview";
import { AboutPreview } from "~/components/home/about-preview";
import { ArtistsPreview } from "~/components/home/artists-preview";
import { StudioProcess } from "~/components/home/studio-process";

const HOME_QUERY = /* GraphQL */ `
  query Home {
    about {
      heading
      body
      values {
        id
        title
        description
      }
    }
    artists {
      id
      name
      slug
      specialties
      imgUrl
    }
    pieces(featured: true, first: 50) {
      items {
        id
        style
        imgUrl
        artist {
          name
        }
      }
    }
  }
`;

type About = {
  heading: string;
  body: string;
  values: { id: string; title: string; description: string }[];
};

type HomeArtist = Pick<Artist, "id" | "name" | "slug" | "specialties" | "imgUrl">;

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
  const { about, artists, pieces } = await graphqlRequest<{
    about: About;
    artists: HomeArtist[];
    pieces: { items: { id: string; style: string; imgUrl: string; artist: { name: string } }[] };
  }>(HOME_QUERY, undefined, request.signal);

  return { about, artists, portfolio: pieces.items };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Hero />
      <PortfolioPreview portfolio={loaderData.portfolio} />
      <AboutPreview about={loaderData.about} />
      <ArtistsPreview artists={loaderData.artists} />
      <StudioProcess />
    </>
  );
}
