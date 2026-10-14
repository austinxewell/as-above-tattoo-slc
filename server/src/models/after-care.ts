import { Schema, model, type InferSchemaType } from "mongoose";

const methodStageValueSchema = new Schema({
  timeframe: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  steps: { type: [String], default: [] },
});

const afterCareMethodValueSchema = new Schema({
  slug: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  stages: { type: [methodStageValueSchema], default: [] },
});

const afterCareSchema = new Schema(
  {
    intro: { type: String, required: true, trim: true },
    disclaimer: { type: String, required: true, trim: true },
    methods: { type: [afterCareMethodValueSchema], default: [] },
    dos: { type: [String], default: [] },
    donts: { type: [String], default: [] },
    warningSigns: { type: [String], default: [] },
  },
  { timestamps: true },
);

export type AfterCare = InferSchemaType<typeof afterCareSchema>;

export const AfterCareModel = model("AfterCare", afterCareSchema);
