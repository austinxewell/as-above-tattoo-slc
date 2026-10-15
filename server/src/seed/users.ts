import { ArtistModel } from "../models/artist.js";
import { UserModel } from "../models/user.js";
import { users } from "./data/users.js";

export async function seedUsers() {
  const artists = await ArtistModel.find({}, { slug: 1 });
  const artistIds = new Map(artists.map((artist) => [artist.slug, artist._id]));

  for (const { artistSlug, ...user } of users) {
    const artist = artistSlug ? artistIds.get(artistSlug) : undefined;

    if (artistSlug && !artist) {
      throw new Error(`No artist with slug "${artistSlug}". Seed artists first.`);
    }

    await UserModel.findOneAndUpdate({ email: user.email }, artist ? { ...user, artist } : user, {
      upsert: true,
      runValidators: true,
    });
  }
}
