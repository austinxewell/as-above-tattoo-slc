import { ArtistModel } from "../models/artist.js";
import { PieceModel } from "../models/piece.js";
import { pieces } from "./data/pieces.js";

export async function seedPieces() {
  const artists = await ArtistModel.find({}, { slug: 1 });
  const artistIds = new Map(artists.map((artist) => [artist.slug, artist._id]));

  for (const { artistSlug, ...piece } of pieces) {
    const artist = artistIds.get(artistSlug);

    if (!artist) {
      throw new Error(`No artist with slug "${artistSlug}". Seed artists first.`);
    }

    await PieceModel.findOneAndUpdate(
      { imgUrl: piece.imgUrl },
      { ...piece, artist },
      { upsert: true, runValidators: true },
    );
  }
}
