import { ArtistModel } from "../models/artist.js";
import { artists } from "./data/artists.js";

export async function seedArtists() {
  for (const artist of artists) {
    await ArtistModel.findOneAndUpdate({ slug: artist.slug }, artist, {
      upsert: true,
      runValidators: true,
    });
  }
}
