import { GraphQLError } from "graphql";
import { ArtistModel } from "../../models/artist.js";
import { requireUser } from "../../auth/guards.js";
import type { GraphQLContext } from "../context.js";
import { cleanArtistInput, type ArtistUpdateInput } from "./validate.js";

export const artistResolvers = {
  Query: {
    artists: () => ArtistModel.find().sort({ createdAt: 1 }),
    artist: (_parent: unknown, args: { slug: string }) => ArtistModel.findOne({ slug: args.slug }),
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
};
