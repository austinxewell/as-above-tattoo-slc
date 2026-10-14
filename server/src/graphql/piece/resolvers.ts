import { ArtistModel } from "../../models/artist.js";
import { PieceModel } from "../../models/piece.js";
import { isValidObjectId } from "mongoose";

type PiecesArgs = {
  artist?: string | null;
  style?: string | null;
  search?: string | null;
  first?: number | null;
  after?: string | null;
  featured?: boolean | null;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const pieceResolvers = {
  Query: {
    pieces: async (_parent: unknown, args: PiecesArgs) => {
      const filter: Record<string, unknown> = {};

      if (args.artist) {
        const artist = await ArtistModel.findOne({ slug: args.artist }, { _id: 1 });
        if (!artist) return { items: [], nextCursor: null };
        filter.artist = artist._id;
      }

      if (args.style) {
        filter.style = args.style;
      }

      if (args.featured != null) {
        filter.isFeatured = args.featured;
      }

      if (args.search?.trim()) {
        const pattern = new RegExp(escapeRegex(args.search.trim()), "i");
        const matchingArtists = await ArtistModel.find({ name: pattern }, { _id: 1 });

        filter.$or = [
          { style: pattern },
          { tags: pattern },
          { artist: { $in: matchingArtists.map((artist) => artist._id) } },
        ];
      }

      const limit = Math.min(args.first ?? 12, 50);

      if (args.after) {
        if (!isValidObjectId(args.after)) throw new Error("Invalid cursor.");
        filter._id = { $lt: args.after };
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
    },
    pieceStyles: async () => {
      const styles = await PieceModel.distinct("style");
      return styles.sort();
    },
  },
};
