import { createHmac, randomUUID } from "node:crypto";
import { GraphQLError } from "graphql";
import { requireUser } from "../../auth/guards.js";
import { ArtistModel } from "../../models/artist.js";
import type { GraphQLContext } from "../context.js";
import { artistFolder, type ArtistImageKind } from "../../images/imagekit.js";

type ImageKind = "PORTFOLIO" | "PROFILE";

const folderNames: Record<ImageKind, ArtistImageKind> = {
  PORTFOLIO: "portfolio",
  PROFILE: "profile",
};

// ImageKit rejects an expire more than an hour out; 10 minutes covers a slow upload.
const EXPIRE_SECONDS = 10 * 60;

export const imageUploadResolvers = {
  Mutation: {
    createImageUpload: async (
      _parent: unknown,
      { artist: slug, kind }: { artist: string; kind: ImageKind },
      context: GraphQLContext,
    ) => {
      const user = requireUser(context);
      const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
      const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

      if (!publicKey || !privateKey) {
        console.error("createImageUpload: IMAGEKIT_PUBLIC_KEY or IMAGEKIT_PRIVATE_KEY is not set.");
        throw new GraphQLError("Image uploads aren't set up yet. Please tell an admin.");
      }

      const artist = await ArtistModel.findOne({ slug }, { slug: 1 });

      if (!artist) {
        throw new GraphQLError("That artist doesn't exist.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (user.role !== "admin" && !user.artist?.equals(artist._id)) {
        throw new GraphQLError("You can only upload images for your own profile.", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      const token = randomUUID();
      const expire = Math.floor(Date.now() / 1000) + EXPIRE_SECONDS;
      const signature = createHmac("sha1", privateKey)
        .update(token + expire)
        .digest("hex");

      return {
        token,
        expire,
        signature,
        publicKey,
        folder: artistFolder(artist.slug, folderNames[kind]),
      };
    },
  },
};
