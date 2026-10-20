import { GraphQLError } from "graphql";
import type { Types } from "mongoose";
import { ArtistModel } from "../../models/artist.js";
import { PieceModel } from "../../models/piece.js";
import { requireUser } from "../../auth/guards.js";
import type { GraphQLContext } from "../context.js";
import { cleanArtistInput, type ArtistUpdateInput } from "./validate.js";

export const artistResolvers = {
  Query: {
    artists: (
      _parent: unknown,
      { includeUnpublished }: { includeUnpublished?: boolean | null },
      context: GraphQLContext,
    ) => {
      const showAll = includeUnpublished === true && context.currentUser?.role === "admin";
      return ArtistModel.find(showAll ? {} : { isPublished: true }).sort({ createdAt: 1 });
    },
    artist: async (_parent: unknown, { slug }: { slug: string }, context: GraphQLContext) => {
      const artist = await ArtistModel.findOne({ slug });
      if (!artist) return null;
      if (artist.isPublished) return artist;

      const user = context.currentUser;
      const canSeeDraft = user?.role === "admin" || Boolean(user?.artist?.equals(artist._id));
      return canSeeDraft ? artist : null;
    },
  },
  Mutation: {
    updateArtist: async (
      _parent: unknown,
      { slug, input }: { slug: string; input: ArtistUpdateInput },
      context: GraphQLContext,
    ) => {
      const user = requireUser(context);
      const artist = await ArtistModel.findOne({ slug });

      if (!artist) {
        throw new GraphQLError("That artist doesn't exist.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const isOwnProfile = Boolean(user.artist?.equals(artist._id));

      if (user.role !== "admin" && !isOwnProfile) {
        throw new GraphQLError("You can only edit your own profile.", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      artist.set(cleanArtistInput(input));
      await artist.save();
      return artist;
    },
  },
  Artist: {
    pieceCount: (artist: { _id: Types.ObjectId }) =>
      PieceModel.countDocuments({ artist: artist._id }),
  },
};
