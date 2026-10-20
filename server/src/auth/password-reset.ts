import type { Types } from "mongoose";
import { PasswordResetModel } from "../models/password-reset.js";
import { generateToken, hashToken } from "./tokens.js";

export const RESET_MINUTES = 30;
export const INVITE_DAYS = 7;

export async function createPasswordReset(userId: Types.ObjectId, minutes = RESET_MINUTES) {
  await PasswordResetModel.deleteMany({ user: userId });

  const token = generateToken();
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

  await PasswordResetModel.create({ tokenHash: hashToken(token), user: userId, expiresAt });

  return token;
}

export async function consumePasswordReset(token: string) {
  const reset = await PasswordResetModel.findOneAndDelete({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  });

  return reset?.user ?? null;
}
