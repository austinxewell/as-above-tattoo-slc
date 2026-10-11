import express from "express";
import cors from "cors";
import "dotenv/config";
import { createYoga, createSchema } from "graphql-yoga";

const app = express();

const PORT = Number(process.env.PORT) || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        health: String!
      }
    `,
    resolvers: {
      Query: {
        health: () => "Tattoo shop API is running!",
      },
    },
  }),
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Tattoo shop API is running!",
  });
});

app.use("/graphql", yoga);

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
