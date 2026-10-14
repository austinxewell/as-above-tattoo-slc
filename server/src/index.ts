import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectToDatabase } from "./db/connect.js";
import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/schema.js";

const app = express();

const PORT = Number(process.env.PORT) || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

const yoga = createYoga({ schema });

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Tattoo shop API is running!",
  });
});

await connectToDatabase();

app.use("/graphql", yoga);

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
