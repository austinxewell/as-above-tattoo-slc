import * as argon2 from "argon2";
import { GraphQLError } from "graphql";
import type { CookieOptions } from "express";
import type { GraphQLContext } from "../context.js";
import { ArtistModel } from "../../models/artist.js";
import { UserModel } from "../../models/user.js";
import { SESSION_COOKIE, createSession, deleteSession } from "../../auth/session.js";
import { createRateLimiter } from "../../security/rate-limit.js";
import { createPasswordReset, consumePasswordReset } from "../../auth/password-reset.js";
import { SessionModel } from "../../models/session.js";
import { sendEmail } from "../../email/send-email.js";
import { passwordResetEmail } from "../../email/account-email.js";

const INVALID_LOGIN = "Incorrect email or password.";
const isLoginRateLimited = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });
const isResetRateLimited = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 });
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 256;

let dummyHash: Promise<string> | undefined;
function getDummyHash() {
  dummyHash ??= argon2.hash("not-a-real-password");
  return dummyHash;
}

function cookieOptions(context: GraphQLContext): CookieOptions {
  return { httpOnly: true, secure: context.req.secure, sameSite: "lax", path: "/" };
}

export const authResolvers = {
  Query: {
    me: (_parent: unknown, _args: unknown, context: GraphQLContext) => context.currentUser,
  },

  Mutation: {
    login: async (
      _parent: unknown,
      { email, password }: { email: string; password: string },
      context: GraphQLContext,
    ) => {
      if (isLoginRateLimited(context.clientIp)) {
        throw new GraphQLError("Too many login attempts. Please wait a few minutes and try again.");
      }

      const user = await UserModel.findOne({ email: email.trim().toLowerCase() }).select(
        "+passwordHash",
      );

      const valid = await argon2.verify(user?.passwordHash ?? (await getDummyHash()), password);

      if (!user || !user.passwordHash || !valid) {
        throw new GraphQLError(INVALID_LOGIN);
      }

      const { token, expiresAt } = await createSession(user._id);
      context.res.cookie(SESSION_COOKIE, token, { ...cookieOptions(context), expires: expiresAt });

      return user;
    },

    logout: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      const token: unknown = context.req.cookies?.[SESSION_COOKIE];
      if (typeof token === "string") await deleteSession(token);

      context.res.clearCookie(SESSION_COOKIE, cookieOptions(context));
      return true;
    },

    requestPasswordReset: async (
      _parent: unknown,
      { email }: { email: string },
      context: GraphQLContext,
    ) => {
      if (isResetRateLimited(context.clientIp)) {
        throw new GraphQLError("Too many reset requests. Please wait a few minutes and try again.");
      }

      const user = await UserModel.findOne({ email: email.trim().toLowerCase() });

      if (user) {
        const token = await createPasswordReset(user._id);
        const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

        void sendEmail({
          to: [user.email],
          ...passwordResetEmail({ name: user.name, link }),
        }).catch((error) => console.error("Password reset email failed:", error));
      }

      return true;
    },

    resetPassword: async (
      _parent: unknown,
      { token, newPassword }: { token: string; newPassword: string },
    ) => {
      if (newPassword.length < MIN_PASSWORD_LENGTH || newPassword.length > MAX_PASSWORD_LENGTH) {
        throw new GraphQLError(`Your password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      }

      const userId = await consumePasswordReset(token);
      if (!userId) {
        throw new GraphQLError(
          "This reset link is invalid or has expired. Please request a new one.",
        );
      }

      const passwordHash = await argon2.hash(newPassword);
      await UserModel.updateOne({ _id: userId }, { passwordHash });
      await SessionModel.deleteMany({ user: userId });

      return true;
    },
  },

  CurrentUser: {
    artist: (user: { artist?: unknown }) =>
      user.artist ? ArtistModel.findById(user.artist) : null,
  },
};
