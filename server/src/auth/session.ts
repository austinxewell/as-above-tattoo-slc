import { generateToken, hashToken } from "./tokens.js";
import type { Request } from "express";
import type { Types } from "mongoose";
import { SessionModel } from "../models/session.js";
import { UserModel } from "../models/user.js";

export const SESSION_COOKIE = "session";
export const SESSION_DAYS = 7;

export async function createSession(userId: Types.ObjectId) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await SessionModel.create({ tokenHash: hashToken(token), user: userId, expiresAt });

  return { token, expiresAt };
}

export async function getCurrentUser(req: Request) {
  const token: unknown = req.cookies?.[SESSION_COOKIE];
  if (typeof token !== "string") return null;

  const session = await SessionModel.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  });
  if (!session) return null;

  return UserModel.findById(session.user);
}

export async function deleteSession(token: string) {
  await SessionModel.deleteOne({ tokenHash: hashToken(token) });
}
