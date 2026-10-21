import { slugify } from "../../models/artist.js";
import { invalid, requiredText, textList } from "../validate.js";

type StageInput = { timeframe: string; title: string; steps: string[] };
type MethodInput = {
  slug?: string | null;
  name: string;
  description: string;
  stages: StageInput[];
};

export type AfterCareInput = {
  intro?: string | null;
  disclaimer?: string | null;
  methods?: MethodInput[] | null;
  dos?: string[] | null;
  donts?: string[] | null;
  warningSigns?: string[] | null;
};

type ListField = "dos" | "donts" | "warningSigns";

const listLabels: Record<ListField, string> = {
  dos: "do's",
  donts: "don'ts",
  warningSigns: "warning signs",
};

function cleanMethods(methods: MethodInput[]) {
  if (methods.length === 0) invalid("methods", "Keep at least one healing method.");
  if (methods.length > 6) invalid("methods", "You can add up to 6 healing methods.");

  const usedSlugs = new Set<string>();

  return methods.map((method) => {
    const name = requiredText("methods", "Each method's name", method.name, 60);

    // Existing methods keep their slug so shared links like ?method=standard keep working.
    const base = slugify(method.slug || name) || "method";
    let slug = base;
    for (let n = 2; usedSlugs.has(slug); n += 1) slug = `${base}-${n}`;
    usedSlugs.add(slug);

    if (method.stages.length > 8) invalid("methods", `${name} can have up to 8 stages.`);

    return {
      slug,
      name,
      description: requiredText("methods", `${name}'s description`, method.description, 300),
      stages: method.stages.map((stage) => ({
        timeframe: requiredText("methods", "Each stage's timeframe", stage.timeframe, 40),
        title: requiredText("methods", "Each stage's title", stage.title, 60),
        steps: textList("methods", "steps in a stage", stage.steps, {
          maxItems: 8,
          maxLength: 200,
        }),
      })),
    };
  });
}

export function cleanAfterCareInput(input: AfterCareInput) {
  const changes: Record<string, unknown> = {};

  if ("intro" in input) changes.intro = requiredText("intro", "Intro", input.intro, 500);
  if ("disclaimer" in input) {
    changes.disclaimer = requiredText("disclaimer", "Disclaimer", input.disclaimer, 400);
  }
  if ("methods" in input) changes.methods = cleanMethods(input.methods ?? []);

  for (const field of ["dos", "donts", "warningSigns"] as const) {
    if (field in input) {
      changes[field] = textList(field, listLabels[field], input[field], {
        maxItems: 12,
        maxLength: 120,
      });
    }
  }

  return changes;
}
