import { GraphQLError } from "graphql";
import { isValidObjectId } from "mongoose";
import { ArtistModel, slugify } from "../../models/artist.js";
import { UserModel } from "../../models/user.js";
import { SessionModel } from "../../models/session.js";
import { PasswordResetModel } from "../../models/password-reset.js";
import { requireRole } from "../../auth/guards.js";
import type { GraphQLContext } from "../context.js";
import { emailInvite } from "../../auth/invite.js";
import { retireArtist } from "./retire-artist.js";

type CreateUserInput = {
  name: string;
  email: string;
  role: "admin" | "artist";
  withArtistProfile: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function invalid(field: string, message: string): never {
  throw new GraphQLError(message, { extensions: { code: "BAD_USER_INPUT", field } });
}

async function uniqueArtistSlug(name: string) {
  const base = slugify(name) || "artist";
  let slug = base;

  for (let suffix = 2; await ArtistModel.exists({ slug }); suffix++) {
    slug = `${base}-${suffix}`;
  }

  return slug;
}

async function createDraftProfile(name: string) {
  return ArtistModel.create({ name, slug: await uniqueArtistSlug(name) });
}

export const userResolvers = {
  Query: {
    users: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      requireRole(context, "admin");
      return UserModel.find().select("+passwordHash").sort({ createdAt: 1 });
    },
  },

  Mutation: {
    createUser: async (
      _parent: unknown,
      { input }: { input: CreateUserInput },
      context: GraphQLContext,
    ) => {
      const admin = requireRole(context, "admin");

      const name = input.name.trim();
      const email = input.email.trim().toLowerCase();

      if (!name) invalid("name", "Name can't be empty.");
      if (name.length > 60) invalid("name", "Name must be 60 characters or fewer.");
      if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
        invalid("email", "Enter a valid email address.");
      }
      if (await UserModel.exists({ email })) {
        invalid("email", "Someone on the team already uses that email.");
      }

      const user = await UserModel.create({ name, email, role: input.role });

      if (input.role === "artist" || input.withArtistProfile) {
        const artist = await createDraftProfile(name);
        user.artist = artist._id;
        await user.save();
      }

      try {
        await emailInvite(user, admin.name);
      } catch (error) {
        console.error(`Invite email to ${email} failed:`, error);
      }

      return user;
    },
    addArtistProfile: async (
      _parent: unknown,
      { userId }: { userId: string },
      context: GraphQLContext,
    ) => {
      requireRole(context, "admin");

      const user = isValidObjectId(userId)
        ? await UserModel.findById(userId).select("+passwordHash")
        : null;

      if (!user) {
        throw new GraphQLError("That person doesn't exist.", { extensions: { code: "NOT_FOUND" } });
      }

      if (user.artist) {
        throw new GraphQLError("This person already has an artist profile.");
      }

      const artist = await createDraftProfile(user.name);
      user.artist = artist._id;
      await user.save();

      return user;
    },
    sendInvite: async (
      _parent: unknown,
      { userId }: { userId: string },
      context: GraphQLContext,
    ) => {
      const admin = requireRole(context, "admin");

      const user = isValidObjectId(userId)
        ? await UserModel.findById(userId).select("+passwordHash")
        : null;

      if (!user) {
        throw new GraphQLError("That person doesn't exist.", { extensions: { code: "NOT_FOUND" } });
      }

      if (user.passwordHash) {
        throw new GraphQLError(
          "They've already set a password. They can use “Forgot password” on the login page.",
        );
      }

      await emailInvite(user, admin.name);
      return true;
    },
    removeArtistProfile: async (
      _parent: unknown,
      { slug }: { slug: string },
      context: GraphQLContext,
    ) => {
      const admin = requireRole(context, "admin");
      const artist = await ArtistModel.findOne({ slug });

      if (!artist) {
        throw new GraphQLError("That artist doesn't exist.", { extensions: { code: "NOT_FOUND" } });
      }

      const owner = await UserModel.findOne({ artist: artist._id });

      if (owner?.role === "artist") {
        throw new GraphQLError(
          `${owner.name} only has artist access, so remove the person instead of just the profile.`,
        );
      }

      await retireArtist(artist._id, admin);
      return true;
    },
    removeUser: async (
      _parent: unknown,
      { userId }: { userId: string },
      context: GraphQLContext,
    ) => {
      const admin = requireRole(context, "admin");
      const user = isValidObjectId(userId) ? await UserModel.findById(userId) : null;

      if (!user) {
        throw new GraphQLError("That person doesn't exist.", { extensions: { code: "NOT_FOUND" } });
      }

      if (user._id.equals(admin._id)) {
        throw new GraphQLError("You can't remove yourself. Ask another admin to do it.");
      }

      if (user.artist) {
        await retireArtist(user.artist, admin);
      }

      await Promise.all([
        SessionModel.deleteMany({ user: user._id }),
        PasswordResetModel.deleteMany({ user: user._id }),
      ]);
      await user.deleteOne();

      return true;
    },
  },

  StaffUser: {
    artist: (user: { artist?: unknown }) =>
      user.artist ? ArtistModel.findById(user.artist) : null,
    hasPassword: (user: { passwordHash?: string | null }) => Boolean(user.passwordHash),
  },
};
