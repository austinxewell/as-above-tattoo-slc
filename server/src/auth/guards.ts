import { GraphQLError } from "graphql";
import type { GraphQLContext } from "../graphql/context.js";

type Role = "admin" | "artist";

export function requireUser(context: GraphQLContext) {
  if (!context.currentUser) {
    throw new GraphQLError("You need to log in to do that.", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  return context.currentUser;
}

export function requireRole(context: GraphQLContext, ...roles: Role[]) {
  const user = requireUser(context);

  if (!roles.includes(user.role)) {
    throw new GraphQLError("You don't have permission to do that.", {
      extensions: { code: "FORBIDDEN" },
    });
  }

  return user;
}
