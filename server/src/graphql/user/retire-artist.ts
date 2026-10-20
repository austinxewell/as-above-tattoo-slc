import { GraphQLError } from "graphql";
import type { Types } from "mongoose";
import { ArtistModel } from "../../models/artist.js";
import { BookingModel } from "../../models/booking.js";
import { PieceModel } from "../../models/piece.js";
import { UserModel } from "../../models/user.js";
import type { requireUser } from "../../auth/guards.js";
import { activityEvent } from "../booking/resolvers.js";

export async function retireArtist(
  artistId: Types.ObjectId,
  actor: ReturnType<typeof requireUser>,
) {
  const artist = await ArtistModel.findById(artistId);
  if (!artist) return;

  const openCount = await BookingModel.countDocuments({ artist: artist._id, archivedAt: null });

  if (openCount > 0) {
    throw new GraphQLError(
      `${artist.name} still has ${openCount} open request${openCount === 1 ? "" : "s"}. Reassign or archive them first.`,
      { extensions: { code: "FAILED_PRECONDITION" } },
    );
  }

  await BookingModel.updateMany(
    { artist: artist._id },
    {
      $set: { artist: null, formerArtistName: artist.name },
      $push: { activity: activityEvent(actor, `${artist.name} left the shop`) },
    },
  );
  await PieceModel.deleteMany({ artist: artist._id });
  await UserModel.updateMany({ artist: artist._id }, { $unset: { artist: 1 } });
  await artist.deleteOne();
}
