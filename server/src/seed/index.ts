import "dotenv/config";
import mongoose from "mongoose";
import { connectToDatabase } from "../db/connect.js";
import { seedAbout } from "./about.js";
import { seedArtists } from "./artists.js";
import { seedPieces } from "./pieces.js";

// Order matters: seed anything another collection references first.
const seeders = {
  about: seedAbout,
  artists: seedArtists,
  pieces: seedPieces,
};

const isLocal = /127\.0\.0\.1|localhost/.test(process.env.MONGO_URL ?? "");

if (!isLocal && !process.argv.includes("--allow-remote")) {
  console.error(
    "Refusing to seed a non-local database. Re-run with --allow-remote if you're sure.",
  );
  process.exit(1);
}

await connectToDatabase();

type SeederName = keyof typeof seeders;

const requested = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const names = (requested.length > 0 ? requested : Object.keys(seeders)) as SeederName[];

const unknown = names.filter((name) => !(name in seeders));
if (unknown.length > 0) {
  console.error(
    `Unknown seeder(s): ${unknown.join(", ")}. Available: ${Object.keys(seeders).join(", ")}`,
  );
  process.exit(1);
}

for (const name of names) {
  await seeders[name]();
  console.log(`Seeded ${name}`);
}

await mongoose.disconnect();
