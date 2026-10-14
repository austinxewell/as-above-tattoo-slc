import { Schema, model, type InferSchemaType } from "mongoose";

const pricingFactorAndPolicyValueSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
});

const pricingFaqValueSchema = new Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
});

const pricingSchema = new Schema(
  {
    intro: { type: String, required: true, trim: true },
    shopMinimum: { type: String, required: true, trim: true },
    factors: { type: [pricingFactorAndPolicyValueSchema], default: [] },
    policies: { type: [pricingFactorAndPolicyValueSchema], default: [] },
    faqs: { type: [pricingFaqValueSchema], default: [] },
  },
  { timestamps: true },
);

export type Pricing = InferSchemaType<typeof pricingSchema>;

export const PricingModel = model("Pricing", pricingSchema);
