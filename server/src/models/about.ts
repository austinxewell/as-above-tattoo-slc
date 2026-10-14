import { Schema, model, type InferSchemaType } from "mongoose";

const aboutValueSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
});

const aboutSchema = new Schema(
  {
    heading: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    values: { type: [aboutValueSchema], default: [] },
  },
  { timestamps: true },
);

export type About = InferSchemaType<typeof aboutSchema>;

export const AboutModel = model("About", aboutSchema);
