import { graphqlRequest, GraphQLRequestError } from "~/lib/graphql";
import type { PortfolioPiece } from "~/components/portfolio/portfolio-gallery";

export type ManagedPiece = PortfolioPiece & {
  isFeatured: boolean;
  artist: PortfolioPiece["artist"] & { isPublished: boolean };
};

const PIECE_FIELDS = /* GraphQL */ `
  fragment ManagedPieceFields on Piece {
    id
    imgUrl
    style
    tags
    isFeatured
    artist {
      id
      slug
      name
      isPublished
    }
  }
`;

const MANAGED_PORTFOLIO_QUERY = /* GraphQL */ `
  query ManagedPortfolio(
    $mine: Boolean
    $artist: String
    $style: String
    $search: String
    $after: String
  ) {
    portfolioPieces(mine: $mine, artist: $artist, style: $style, search: $search, after: $after) {
      items {
        ...ManagedPieceFields
      }
      nextCursor
    }
    portfolioStyles(mine: $mine)
    shopStyles: portfolioStyles(shopWide: true)
  }
  ${PIECE_FIELDS}
`;

export type PortfolioParams = {
  mine?: boolean;
  artist: string | null;
  style: string | null;
  search: string | null;
  after: string | null;
};

export function readPortfolioParams(url: URL): PortfolioParams {
  return {
    artist: url.searchParams.get("artist"),
    style: url.searchParams.get("style"),
    search: url.searchParams.get("q"),
    after: url.searchParams.get("after"),
  };
}

export async function fetchManagedPortfolio(params: PortfolioParams, signal?: AbortSignal) {
  const { portfolioPieces, portfolioStyles, shopStyles } = await graphqlRequest<{
    portfolioPieces: { items: ManagedPiece[]; nextCursor: string | null };
    portfolioStyles: string[];
    shopStyles: string[];
  }>(MANAGED_PORTFOLIO_QUERY, params, signal);

  return {
    pieces: portfolioPieces.items,
    nextCursor: portfolioPieces.nextCursor,
    styles: portfolioStyles,
    shopStyles,
  };
}

const CREATE_PIECE_MUTATION = /* GraphQL */ `
  mutation CreatePiece($artist: String!, $input: PieceInput!) {
    createPiece(artist: $artist, input: $input) {
      ...ManagedPieceFields
    }
  }
  ${PIECE_FIELDS}
`;

const UPDATE_PIECE_MUTATION = /* GraphQL */ `
  mutation UpdatePiece($id: ID!, $input: PieceInput!) {
    updatePiece(id: $id, input: $input) {
      ...ManagedPieceFields
    }
  }
  ${PIECE_FIELDS}
`;

const SET_PIECE_FEATURED_MUTATION = /* GraphQL */ `
  mutation SetPieceFeatured($id: ID!, $featured: Boolean!) {
    setPieceFeatured(id: $id, featured: $featured) {
      ...ManagedPieceFields
    }
  }
  ${PIECE_FIELDS}
`;

const DELETE_PIECE_MUTATION = /* GraphQL */ `
  mutation DeletePiece($id: ID!) {
    deletePiece(id: $id)
  }
`;

const portfolioIntents = ["create", "update", "feature", "unfeature", "delete"] as const;
export type PortfolioIntent = (typeof portfolioIntents)[number];

function isPortfolioIntent(value: unknown): value is PortfolioIntent {
  return portfolioIntents.includes(value as PortfolioIntent);
}

export type PortfolioActionResult = {
  intent: PortfolioIntent | null;
  ok: boolean;
  error: string | null;
  field: string | null;
  piece: ManagedPiece | null;
};

function readPieceInput(formData: FormData) {
  return {
    fileId: String(formData.get("fileId") ?? "") || null,
    style: String(formData.get("style") ?? ""),
    tags: formData.getAll("tags").map(String),
  };
}

export async function handlePortfolioAction(
  request: Request,
  ownSlug?: string,
): Promise<PortfolioActionResult> {
  const formData = await request.formData();
  const rawIntent = formData.get("intent");
  const intent = isPortfolioIntent(rawIntent) ? rawIntent : null;
  const id = String(formData.get("id") ?? "");

  try {
    let piece: ManagedPiece | null = null;

    if (intent === "create") {
      const artist = ownSlug ?? String(formData.get("artist") ?? "");

      if (!artist) {
        return {
          intent,
          ok: false,
          error: "Choose whose portfolio this is for.",
          field: "artist",
          piece: null,
        };
      }

      ({ createPiece: piece } = await graphqlRequest<{ createPiece: ManagedPiece }>(
        CREATE_PIECE_MUTATION,
        { artist, input: readPieceInput(formData) },
        request.signal,
      ));
    } else if (intent === "update") {
      ({ updatePiece: piece } = await graphqlRequest<{ updatePiece: ManagedPiece }>(
        UPDATE_PIECE_MUTATION,
        { id, input: readPieceInput(formData) },
        request.signal,
      ));
    } else if (intent === "feature" || intent === "unfeature") {
      ({ setPieceFeatured: piece } = await graphqlRequest<{ setPieceFeatured: ManagedPiece }>(
        SET_PIECE_FEATURED_MUTATION,
        { id, featured: intent === "feature" },
        request.signal,
      ));
    } else if (intent === "delete") {
      await graphqlRequest(DELETE_PIECE_MUTATION, { id }, request.signal);
    } else {
      return { intent, ok: false, error: "That change isn't supported.", field: null, piece: null };
    }

    return { intent, ok: true, error: null, field: null, piece };
  } catch (error) {
    return {
      intent,
      ok: false,
      error: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      field: error instanceof GraphQLRequestError ? (error.field ?? null) : null,
      piece: null,
    };
  }
}

const MY_PORTFOLIO_STATUS_QUERY = /* GraphQL */ `
  query MyPortfolioStatus {
    me {
      artist {
        isPublished
        publishChecklist {
          key
          current
          goal
        }
      }
    }
  }
`;

type StatusItem = { key: string; current: number | null; goal: number | null };

export async function fetchMyPortfolioStatus(signal?: AbortSignal) {
  const { me } = await graphqlRequest<{
    me: { artist: { isPublished: boolean; publishChecklist: StatusItem[] } | null } | null;
  }>(MY_PORTFOLIO_STATUS_QUERY, undefined, signal);

  const artist = me?.artist;
  if (!artist) return null;

  const pieces = artist.publishChecklist.find((item) => item.key === "pieces");

  return {
    isPublished: artist.isPublished,
    pieceCount: pieces?.current ?? 0,
    piecesGoal: pieces?.goal ?? null,
  };
}
