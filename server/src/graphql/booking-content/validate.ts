import { invalid, requiredText } from "../validate.js";

type Step = { title: string; description: string };

export type BookingContentInput = {
  intro?: string | null;
  steps?: Step[] | null;
  whyRequest?: string | null;
  disclaimer?: string | null;
};

const MAX_STEPS = 6;

export function cleanBookingContentInput(input: BookingContentInput) {
  const changes: {
    intro?: string;
    steps?: Step[];
    whyRequest?: string;
    disclaimer?: string;
  } = {};

  if ("intro" in input) changes.intro = requiredText("intro", "Intro", input.intro, 300);

  if ("steps" in input) {
    const steps = input.steps ?? [];
    if (steps.length > MAX_STEPS) invalid("steps", `You can add up to ${MAX_STEPS} steps.`);

    changes.steps = steps.map((step) => ({
      title: requiredText("steps", "Each step's title", step.title, 60),
      description: requiredText("steps", "Each step's description", step.description, 300),
    }));
  }

  if ("whyRequest" in input) {
    changes.whyRequest = requiredText("whyRequest", "Why a request", input.whyRequest, 600);
  }

  if ("disclaimer" in input) {
    changes.disclaimer = requiredText("disclaimer", "Disclaimer", input.disclaimer, 400);
  }

  return changes;
}
