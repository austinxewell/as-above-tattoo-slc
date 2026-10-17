import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import type { Request, Response } from "express";
import { useCSRFPrevention } from "@graphql-yoga/plugin-csrf-prevention";
import { getCurrentUser } from "./auth/session.js";
import { connectToDatabase } from "./db/connect.js";
import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/schema.js";
import type { GraphQLContext } from "./graphql/context.js";
import { getClientIp } from "./security/netlify-proxy.js";
import { requireNetlifyProxy } from "./security/netlify-proxy.js";

const app = express();

app.set("trust proxy", 1);

const PORT = Number(process.env.PORT) || 4000;

app.use(cookieParser());

const yoga = createYoga<
  { req: Request; res: Response },
  Pick<GraphQLContext, "currentUser" | "clientIp">
>({
  schema,
  context: async ({ req }) => {
    const [currentUser, clientIp] = await Promise.all([getCurrentUser(req), getClientIp(req)]);
    return { currentUser, clientIp };
  },
  plugins: [useCSRFPrevention({ requestHeaders: ["x-graphql-yoga-csrf"] })],
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Tattoo shop API is running!",
  });
});

await connectToDatabase();

app.use("/graphql", requireNetlifyProxy);
app.use("/graphql", (req, res) => yoga(req, res, { req, res }));

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
