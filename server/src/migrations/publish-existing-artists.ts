import "dotenv/config";
import mongoose from "mongoose";
import { connectToDatabase } from "../db/connect.js";
import { ArtistModel } from "../models/artist.js";

const isLocal = /127\.0\.0\.1|localhost/.test(process.env.MONGO_URL ?? "");

if (!isLocal && !process.argv.includes("--allow-remote")) {
  console.error(
    "Refusing to migrate a non-local database. Re-run with --allow-remote if you're sure.",
  );
  process.exit(1);
}

await connectToDatabase();

const result = await ArtistModel.updateMany(
  { isPublished: { $exists: false } },
  { $set: { isPublished: true } },
);

console.log(`Marked ${result.modifiedCount} existing artist(s) as published.`);

await mongoose.disconnect();
