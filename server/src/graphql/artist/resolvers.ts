import { GraphQLError } from "graphql";
import type { Types } from "mongoose";
import { ArtistModel } from "../../models/artist.js";
import { PieceModel } from "../../models/piece.js";
import { getPublishingStandards } from "../../models/site-settings.js";
import { publishChecklist } from "./checklist.js";
import { requireRole, requireUser } from "../../auth/guards.js";
import type { GraphQLContext } from "../context.js";
import { deleteImageFile } from "../../images/imagekit.js";
import { artistImage } from "../validate.js";
import { cleanArtistInput, type ArtistUpdateInput } from "./validate.js";

function notFound(): never {
  throw new GraphQLError("That artist doesn't exist.", { extensions: { code: "NOT_FOUND" } });
}

async function editableArtist(user: ReturnType<typeof requireUser>, slug: string) {
  const artist = await ArtistModel.findOne({ slug });
  if (!artist) notFound();

  if (user.role !== "admin" && !user.artist?.equals(artist._id)) {
    throw new GraphQLError("You can only change your own profile.", {
      extensions: { code: "FORBIDDEN" },
    });
  }

  return artist;
}

function publicOrder() {
  return ArtistModel.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: 1 });
}

async function nextSortOrder() {
  const last = await ArtistModel.findOne({ isPublished: true, sortOrder: { $ne: null } }).sort({
    sortOrder: -1,
  });
  return (last?.sortOrder ?? -1) + 1;
}

export const artistResolvers = {
  Query: {
    artists: (
      _parent: unknown,
      { includeUnpublished }: { includeUnpublished?: boolean | null },
      context: GraphQLContext,
    ) => {
      const showAll = includeUnpublished === true && context.currentUser?.role === "admin";
      return ArtistModel.find(showAll ? {} : { isPublished: true }).sort({
        sortOrder: 1,
        createdAt: 1,
      });
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
      const artist = await editableArtist(requireUser(context), slug);
      const previousFileId = artist.fileId;
      artist.set(cleanArtistInput(input));

      if (input.fileId) {
        artist.set(await artistImage(artist.slug, "profile", input.fileId));
      }

      await artist.save();

      if (previousFileId && previousFileId !== artist.fileId) {
        await deleteImageFile(previousFileId);
      }

      return artist;
    },
    publishArtist: async (
      _parent: unknown,
      { slug }: { slug: string },
      context: GraphQLContext,
    ) => {
      const artist = await editableArtist(requireUser(context), slug);
      if (artist.isPublished) return artist;

      const checklist = await publishChecklist(artist, await getPublishingStandards());
      const missing = checklist
        .filter((item) => !item.done)
        .map((item) => item.label.toLowerCase());

      if (missing.length > 0) {
        throw new GraphQLError(`Finish the checklist first: ${missing.join(", ")}.`, {
          extensions: { code: "FAILED_PRECONDITION" },
        });
      }

      artist.isPublished = true;
      artist.sortOrder = await nextSortOrder();
      await artist.save();

      return artist;
    },
    unpublishArtist: async (
      _parent: unknown,
      { slug }: { slug: string },
      context: GraphQLContext,
    ) => {
      requireRole(context, "admin");
      const artist = await ArtistModel.findOne({ slug });
      if (!artist) notFound();

      artist.isPublished = false;
      await artist.save();
      return artist;
    },
    moveArtist: async (
      _parent: unknown,
      { slug, direction }: { slug: string; direction: "up" | "down" },
      context: GraphQLContext,
    ) => {
      requireRole(context, "admin");

      const artists = await publicOrder();
      const from = artists.findIndex((artist) => artist.slug === slug);

      if (from === -1) {
        throw new GraphQLError("Only published artists have a place in the public order.", {
          extensions: { code: "FAILED_PRECONDITION" },
        });
      }

      const to = direction === "up" ? from - 1 : from + 1;
      if (to < 0 || to >= artists.length) return artists;

      [artists[from], artists[to]] = [artists[to], artists[from]];

      await ArtistModel.bulkWrite(
        artists.map((artist, index) => ({
          updateOne: { filter: { _id: artist._id }, update: { $set: { sortOrder: index } } },
        })),
      );

      return publicOrder();
    },
  },
  Artist: {
    pieceCount: (artist: { _id: Types.ObjectId }) =>
      PieceModel.countDocuments({ artist: artist._id }),
    publishChecklist: async (artist: Parameters<typeof publishChecklist>[0]) =>
      publishChecklist(artist, await getPublishingStandards()),
  },
};
