export type PricingFactorAndPolicyValue = {
  title: string;
  description: string;
};

export type PricingFaqValue = {
  question: string;
  answer: string;
};

export type Pricing = {
  intro: string;
  shopMinimum: string;
  factors: PricingFactorAndPolicyValue[];
  policies: PricingFactorAndPolicyValue[];
  faqs: PricingFaqValue[];
};

export const pricing: Pricing = {
  intro:
    "Every tattoo is drawn custom, so there's no fixed price list. Your price depends on the design, your artist, and how long it takes. Here's how it works.",
  shopMinimum: "$100",
  factors: [
    {
      title: "Size",
      description:
        "Larger pieces take more time to draw and tattoo. Size is the biggest single factor in your price.",
    },
    {
      title: "Detail",
      description:
        "Fine line work, shading, and intricate patterns take longer than bold, simple designs of the same size.",
    },
    {
      title: "Placement",
      description:
        "Some areas, like ribs, hands, and feet, are harder to tattoo and can take longer to get right.",
    },
    {
      title: "Color",
      description: "Color work usually takes more time to saturate the color than black and grey.",
    },
    {
      title: "Sessions",
      description:
        "Large pieces like sleeves and back pieces are done over several sessions and priced per session.",
    },
  ],
  policies: [
    {
      title: "Deposits",
      description:
        "A non-refundable deposit is required to book. It goes toward the final cost of your tattoo.",
    },
    {
      title: "Cancellations",
      description:
        "Give at least 48 hours' notice to reschedule and keep your deposit. Late cancellations or no-shows forfeit the deposit.",
    },
    {
      title: "Touch-ups",
      description:
        "One free touch-up within 3 months, as long as you followed the after care instructions.",
    },
    {
      title: "Payment",
      description: "We accept cash and all major cards. Payment is due at the end of each session.",
    },
  ],
  faqs: [
    {
      question: "Can I get a quote over Instagram?",
      answer:
        "We can give a rough estimate if you send your idea, size, and placement. Your final price is confirmed at your consultation.",
    },
    {
      question: "Is there a shop minimum?",
      answer:
        "Yes. Every tattoo has a shop minimum that covers setup, sterile supplies, and cleanup, no matter how small the design.",
    },
    {
      question: "Do I need to tip?",
      answer:
        "Tips are never required but always appreciated. Most clients tip between 15% and 20%.",
    },
    {
      question: "Do you charge for drawing the design?",
      answer: "No. Design time is included in the price of your tattoo.",
    },
    {
      question: "Can I bring a friend?",
      answer:
        "One guest 18 or older is welcome during your session, as long as there's room in the studio.",
    },
  ],
};
