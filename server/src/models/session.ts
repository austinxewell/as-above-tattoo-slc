import { Schema, model, type InferSchemaType } from "mongoose";

const sessionSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true },
);

export type Session = InferSchemaType<typeof sessionSchema>;
export const SessionModel = model("Session", sessionSchema);
