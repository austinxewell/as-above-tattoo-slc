import { ArtistModel } from "../models/artist.js";
import { UserModel } from "../models/user.js";
import { users } from "./data/users.js";
import * as argon2 from "argon2";

export async function seedUsers() {
  const artists = await ArtistModel.find({}, { slug: 1 });
  const artistIds = new Map(artists.map((artist) => [artist.slug, artist._id]));

  const seedPassword = process.env.SEED_USER_PASSWORD;
  const passwordHash = seedPassword ? await argon2.hash(seedPassword) : undefined;

  for (const { artistSlug, ...user } of users) {
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
