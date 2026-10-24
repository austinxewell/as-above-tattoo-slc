import { Schema, model, type InferSchemaType } from "mongoose";

const pieceSchema = new Schema(
  {
    imgUrl: { type: String, required: true, trim: true },
    fileId: { type: String, trim: true, unique: true, sparse: true },
    style: { type: String, required: true, trim: true, lowercase: true },
    artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true, index: true },
    tags: { type: [{ type: String, trim: true, lowercase: true }], default: [] },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export type Piece = InferSchemaType<typeof pieceSchema>;
export const PieceModel = model("Piece", pieceSchema);
