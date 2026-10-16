import type { Request, Response } from "express";
import type { getCurrentUser } from "../auth/session.js";

export type GraphQLContext = {
  req: Request;
  res: Response;
  currentUser: Awaited<ReturnType<typeof getCurrentUser>>;
};
