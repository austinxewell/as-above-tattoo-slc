import * as argon2 from "argon2";
import { ArtistModel } from "../models/artist.js";
import { UserModel } from "../models/user.js";
import { users } from "./data/users.js";
import { readFile } from "node:fs/promises";
import type { SeedUser } from "./data/users.js";

export async function seedUsers() {
  const artists = await ArtistModel.find({}, { slug: 1 });
  const artistIds = new Map(artists.map((artist) => [artist.slug, artist._id]));

  const seedPassword = process.env.SEED_USER_PASSWORD;
  const passwordHash = seedPassword ? await argon2.hash(seedPassword) : undefined;

  const usersFile = process.env.SEED_USERS_FILE;
  const seedUsers: SeedUser[] = usersFile ? JSON.parse(await readFile(usersFile, "utf8")) : users;

  for (const { artistSlug, ...user } of seedUsers) {
    const artist = artistSlug ? artistIds.get(artistSlug) : undefined;

    if (artistSlug && !artist) {
      throw new Error(`No artist with slug "${artistSlug}". Seed artists first.`);
    }

    await UserModel.findOneAndUpdate(
      { email: user.email },
      { ...user, ...(artist && { artist }), ...(passwordHash && { passwordHash }) },
      { upsert: true, runValidators: true },
    );
  }
}
