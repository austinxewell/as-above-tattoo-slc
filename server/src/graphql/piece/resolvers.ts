import { GraphQLError } from "graphql";
import { isValidObjectId } from "mongoose";
import { ArtistModel } from "../../models/artist.js";
import { PieceModel } from "../../models/piece.js";
import { requireRole, requireUser } from "../../auth/guards.js";
import type { GraphQLContext } from "../context.js";
import { cleanPieceInput, type PieceInput } from "./validate.js";

type PageArgs = {
  first?: number | null;
  after?: string | null;
};

type NarrowArgs = {
  style?: string | null;
  search?: string | null;
};

type PiecesArgs = PageArgs &
  NarrowArgs & {
    artist?: string | null;
    featured?: boolean | null;
  };

type PortfolioArgs = PageArgs &
  NarrowArgs & {
    mine?: boolean | null;
    artist?: string | null;
  };

type PieceFilter = Record<string, unknown>;

const emptyPage = { items: [], nextCursor: null };

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function publishedArtistIds() {
  const artists = await ArtistModel.find({ isPublished: true }).select("_id");
  return artists.map((artist) => artist._id);
}

// Adds the style filter and the keyword search. `artistScope` limits which
// artists' names the search may match (published only on the public site).
async function narrowPieces(
  filter: PieceFilter,
  { style, search }: NarrowArgs,
  artistScope: PieceFilter,
) {
  if (style) {
    filter.style = style;
  }

  const term = search?.trim();

  if (term) {
    const pattern = new RegExp(escapeRegex(term), "i");
    const matchingArtists = await ArtistModel.find({ ...artistScope, name: pattern }, { _id: 1 });

    filter.$or = [
      { style: pattern },
      { tags: pattern },
      { artist: { $in: matchingArtists.map((artist) => artist._id) } },
    ];
  }
}

// Newest first, cursor-paged by _id.
async function pagePieces(filter: PieceFilter, { first, after }: PageArgs) {
  const limit = Math.min(first ?? 12, 50);

  if (after) {
    if (!isValidObjectId(after)) throw new GraphQLError("Invalid cursor.");
    filter._id = { $lt: after };
  }

  const items = await PieceModel.find(filter)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .populate("artist");

  const hasMore = items.length > limit;
  const page = hasMore ? items.slice(0, limit) : items;

  return {
    items: page,
    nextCursor: hasMore ? String(page[page.length - 1]._id) : null,
  };
}

function notFound(): never {
  throw new GraphQLError("That piece doesn't exist.", { extensions: { code: "NOT_FOUND" } });
}

async function editablePiece(user: ReturnType<typeof requireUser>, id: string) {
  const piece = isValidObjectId(id) ? await PieceModel.findById(id) : null;
  if (!piece) notFound();

  if (user.role !== "admin" && !user.artist?.equals(piece.artist)) {
    throw new GraphQLError("You can only change your own pieces.", {
      extensions: { code: "FORBIDDEN" },
    });
  }

  return piece;
}

export const pieceResolvers = {
  Query: {
    pieces: async (_parent: unknown, args: PiecesArgs) => {
      const filter: PieceFilter = {};

      if (args.artist) {
        const artist = await ArtistModel.findOne(
          { slug: args.artist, isPublished: true },
          { _id: 1 },
        );
        if (!artist) return emptyPage;
        filter.artist = artist._id;
      } else {
        filter.artist = { $in: await publishedArtistIds() };
      }

      if (args.featured != null) {
        filter.isFeatured = args.featured;
      }

      await narrowPieces(filter, args, { isPublished: true });
      return pagePieces(filter, args);
    },
    pieceStyles: async () => {
      const publishedIds = await publishedArtistIds();
      const styles = await PieceModel.distinct("style", { artist: { $in: publishedIds } });
      return styles.sort();
    },
    portfolioPieces: async (_parent: unknown, args: PortfolioArgs, context: GraphQLContext) => {
      const user = requireUser(context);
      const filter: PieceFilter = {};

      if (args.mine || user.role !== "admin") {
        if (!user.artist) return emptyPage;
        filter.artist = user.artist;
      } else if (args.artist) {
        const artist = await ArtistModel.findOne({ slug: args.artist }, { _id: 1 });
        if (!artist) return emptyPage;
        filter.artist = artist._id;
      }

      await narrowPieces(filter, args, {});
      return pagePieces(filter, args);
    },
    portfolioStyles: async (
      _parent: unknown,
      { mine, shopWide }: { mine?: boolean | null; shopWide?: boolean | null },
      context: GraphQLContext,
    ) => {
      const user = requireUser(context);

      if (shopWide || (user.role === "admin" && !mine)) {
        return (await PieceModel.distinct("style")).sort();
      }

      if (!user.artist) return [];
      return (await PieceModel.distinct("style", { artist: user.artist })).sort();
    },
  },
  Mutation: {
    createPiece: async (
      _parent: unknown,
      { artist: slug, input }: { artist: string; input: PieceInput },
      context: GraphQLContext,
    ) => {
      const user = requireUser(context);
      const artist = await ArtistModel.findOne({ slug });

      if (!artist) {
        throw new GraphQLError("That artist doesn't exist.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (user.role !== "admin" && !user.artist?.equals(artist._id)) {
        throw new GraphQLError("You can only add pieces to your own portfolio.", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      const piece = await PieceModel.create({ ...cleanPieceInput(input), artist: artist._id });
      return piece.populate("artist");
    },
    updatePiece: async (
      _parent: unknown,
      { id, input }: { id: string; input: PieceInput },
      context: GraphQLContext,
    ) => {
      const piece = await editablePiece(requireUser(context), id);
      piece.set(cleanPieceInput(input));
      await piece.save();
      return piece.populate("artist");
    },
    setPieceFeatured: async (
      _parent: unknown,
      { id, featured }: { id: string; featured: boolean },
      context: GraphQLContext,
    ) => {
      requireRole(context, "admin");
      const piece = isValidObjectId(id) ? await PieceModel.findById(id) : null;
      if (!piece) notFound();

      piece.isFeatured = featured;
      await piece.save();
      return piece.populate("artist");
    },
    deletePiece: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      const piece = await editablePiece(requireUser(context), id);
      await piece.deleteOne();
      return true;
    },
  },
};
