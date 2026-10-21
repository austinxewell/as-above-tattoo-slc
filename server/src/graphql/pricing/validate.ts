import { invalid, requiredText } from "../validate.js";

type TitledItem = { title: string; description: string };
type FaqItem = { question: string; answer: string };

export type PricingInput = {
  intro?: string | null;
  shopMinimum?: string | null;
  factors?: TitledItem[] | null;
  policies?: TitledItem[] | null;
  faqs?: FaqItem[] | null;
};

function titledList(
  field: "factors" | "policies",
  noun: string,
  items: TitledItem[] | null | undefined,
) {
  const list = items ?? [];
  if (list.length > 10) invalid(field, `You can add up to 10 ${field}.`);

  return list.map((item) => ({
    title: requiredText(field, `Each ${noun}'s title`, item.title, 40),
    description: requiredText(field, `Each ${noun}'s description`, item.description, 300),
  }));
}

function faqList(items: FaqItem[] | null | undefined) {
  const list = items ?? [];
  if (list.length > 12) invalid("faqs", "You can add up to 12 questions.");

  return list.map((item) => ({
    question: requiredText("faqs", "Each question", item.question, 120),
    answer: requiredText("faqs", "Each answer", item.answer, 600),
  }));
}

export function cleanPricingInput(input: PricingInput) {
  const changes: {
    intro?: string;
    shopMinimum?: string;
    factors?: TitledItem[];
    policies?: TitledItem[];
    faqs?: FaqItem[];
  } = {};

  if ("intro" in input) changes.intro = requiredText("intro", "Intro", input.intro, 500);
  if ("shopMinimum" in input) {
    changes.shopMinimum = requiredText("shopMinimum", "Shop minimum", input.shopMinimum, 20);
  }
  if ("factors" in input) changes.factors = titledList("factors", "factor", input.factors);
  if ("policies" in input) changes.policies = titledList("policies", "policy", input.policies);
  if ("faqs" in input) changes.faqs = faqList(input.faqs);

  return changes;
}
