import { Schema, model, type InferSchemaType } from "mongoose";

const passwordResetSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true },
);

export type PasswordReset = InferSchemaType<typeof passwordResetSchema>;
export const PasswordResetModel = model("PasswordReset", passwordResetSchema);
