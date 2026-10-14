export type MethodStageValue = {
  timeframe: string;
  title: string;
  steps: string[];
};

export type AfterCareMethodValue = {
  slug: string;
  name: string;
  description: string;
  stages: MethodStageValue[];
};

export type AfterCare = {
  intro: string;
  disclaimer: string;
  methods: AfterCareMethodValue[];
  dos: string[];
  donts: string[];
  warningSigns: string[];
};

export const afterCare: AfterCare = {
  intro:
    "A tattoo is an open wound for the first few weeks. How you care for it now decides how it looks for years. Your artist will tell you which method they used. Follow the matching steps below.",
  disclaimer:
    "These are general guidelines. Always follow the specific instructions your artist gives you, and contact a doctor if you're worried about how your tattoo is healing.",
  methods: [
    {
      slug: "standard",
      name: "Standard wrap",
      description:
        "Your tattoo was covered with a plastic wrap or absorbent bandage when you left the shop.",
      stages: [
        {
          timeframe: "First 2–4 hours",
          title: "Leave the wrap on",
          steps: [
            "Keep the wrap on for 2–4 hours, or as long as your artist told you.",
            "Wash your hands before removing it, then peel it off slowly.",
          ],
        },
        {
          timeframe: "Days 1–3",
          title: "Wash and protect",
          steps: [
            "Wash gently 2–3 times a day with lukewarm water and fragrance-free soap, using clean fingertips only.",
            "Pat dry with a clean paper towel and let it air dry for 10–15 minutes.",
            "Apply a very thin layer of aftercare ointment or fragrance-free lotion. It should look slightly shiny, not greasy.",
            "Some oozing of clear fluid, ink, and blood is normal.",
          ],
        },
        {
          timeframe: "Days 4–14",
          title: "Peeling and itching",
          steps: [
            "Your tattoo will flake and peel like a sunburn. Let it come off on its own.",
            "Keep washing 1–2 times a day and use fragrance-free lotion 2–3 times a day.",
            "If it itches, lightly tap or slap the area. Never scratch.",
          ],
        },
        {
          timeframe: "Weeks 2–4",
          title: "Finishing up",
          steps: [
            "The surface may look cloudy or shiny for a while. This is normal and clears as the skin settles.",
            "Keep moisturizing daily. Deeper layers of skin can take 4–6 weeks to fully heal.",
          ],
        },
      ],
    },
    {
      slug: "adhesive-film",
      name: "Adhesive film (Saniderm / Second Skin)",
      description:
        "Your tattoo was covered with a clear, breathable adhesive film, such as Saniderm or Second Skin.",
      stages: [
        {
          timeframe: "First 24 hours",
          title: "Leave the first film on",
          steps: [
            "Keep the first film on for up to 24 hours.",
            "Fluid, ink, and plasma collecting under the film is normal and helps the tattoo heal.",
            "If the seal breaks and fluid leaks out, remove the film and switch to the standard wrap steps.",
          ],
        },
        {
          timeframe: "After 24 hours",
          title: "Replace the film",
          steps: [
            "Remove the first film in a warm shower. Peel it back slowly and low against the skin, in the direction of hair growth.",
            "Wash with lukewarm water and fragrance-free soap, pat dry, and let it air dry for 10–15 minutes.",
            "If your artist gave you a second film, apply it to clean, completely dry skin.",
          ],
        },
        {
          timeframe: "Days 2–6",
          title: "Let it work",
          steps: [
            "Leave the second film on for 3–5 days. Don't keep it on for more than 6 days.",
            "You can shower normally with the film on. Just avoid soaking it.",
            "If you see a rash, small bumps, or intense itching under the film, remove it. You may be sensitive to the adhesive.",
          ],
        },
        {
          timeframe: "After removal",
          title: "Switch to standard care",
          steps: [
            "Remove the final film in the shower the same way as the first.",
            "Wash gently, then follow the standard wrap steps from Days 4–14 onward, using a thin layer of fragrance-free lotion.",
          ],
        },
      ],
    },
  ],
  dos: [
    "Wash your hands before touching your tattoo",
    "Use fragrance-free soap and lotion",
    "Wear loose, clean clothing over the area",
    "Sleep on clean sheets",
    "Use SPF 30+ sunscreen once it's fully healed",
  ],
  donts: [
    "Don't soak it in baths, pools, hot tubs, or the ocean for 2–3 weeks",
    "Don't expose it to direct sun or tanning beds while healing",
    "Don't pick, scratch, or peel flaking skin",
    "Don't apply thick layers of ointment",
    "Don't shave over the tattoo until it's healed",
  ],
  warningSigns: [
    "Redness or swelling that spreads or gets worse after day 3",
    "Pain that increases instead of easing",
    "Skin that feels hot to the touch",
    "Yellow or green discharge, or a bad smell",
    "Red streaks spreading out from the tattoo",
    "Fever or chills",
    "A rash, raised bumps, or intense itching that won't settle",
  ],
};
