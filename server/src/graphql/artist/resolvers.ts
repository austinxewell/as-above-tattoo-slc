import { ArtistModel } from "../../models/artist.js";

export const artistResolvers = {
  Query: {
    artists: () => ArtistModel.find().sort({ createdAt: 1 }),
    artist: (_parent: unknown, args: { slug: string }) => ArtistModel.findOne({ slug: args.slug }),
  },
};
