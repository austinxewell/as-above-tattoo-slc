export type BookingValue = {
  minimum: string;
  rate: string;
  deposit: string;
  availability: string;
  notes: string[];
};

export type Artist = {
  slug: string;
  name: string;
  specialties: string[];
  bio: string;
  imgUrl: string;
  instagram?: string;
  isBooking: boolean;
  isPublished: boolean;
  statement: string;
  booking: BookingValue;
};

export const artists: Artist[] = [
  {
    slug: "taylor-goble",
    name: "Taylor Goble",
    specialties: ["Realism, Illustrative"],
    bio: "Taylor works in delicate fine line and botanical pieces, with a soft spot for realism. Every design is drawn to sit naturally with the body and age well over time.",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLdQzdpnfC6Ja9zoWGGopJVga7qcWPkxAYmGBYy-7VZg&s=10",
    instagram: "tdatattooist",
    isBooking: true,
    isPublished: true,
    statement:
      "I want every piece to feel like it grew there. Fine line work should look delicate on day one and still read clearly years from now.",
    booking: {
      minimum: "$120",
      rate: "$160/hr",
      deposit: "$75, non-refundable, goes toward your tattoo",
      availability: "Booking now through the end of next month",
      notes: [
        "No cover-ups",
        "No hand, neck, or face tattoos as a first tattoo",
        "Botanical and fine line pieces preferred",
      ],
    },
  },
  {
    slug: "jeff-cusack",
    name: "Jeff Cusack",
    specialties: ["Traditional", "Neo traditional"],
    bio: "Jeff is rooted in bold lines and solid color. His traditional and neo traditional work is built to read clearly from across the room and hold up for decades.",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgPGOzKyFTHwsmbqW4JgLiLUMbMtCCLEWuesnRypcnEg&s=10",
    instagram: "jeff.cusack",
    isBooking: true,
    isPublished: true,
    statement:
      "Bold will hold. I tattoo the classics because they look as good in twenty years as they do the day you walk out.",
    booking: {
      minimum: "$100",
      rate: "$150/hr",
      deposit: "$50, non-refundable, goes toward your tattoo",
      availability: "Booking 4–6 weeks out",
      notes: [
        "Walk-ins welcome when the schedule allows",
        "Happy to rework or cover older traditional pieces",
        "No fine line or micro realism",
      ],
    },
  },
  {
    slug: "angel",
    name: "Angel",
    specialties: ["Blackwork", "Dark art"],
    bio: "Angel creates heavy blackwork and dark, surreal imagery. Expect strong contrast, unusual subjects, and pieces that feel like they came out of a dream.",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3_yaOP8dpWX_rrOdLKbgfSdo4JOzmgbdFJecmNMlPWg&s=10",
    instagram: "angeltattooslc",
    isBooking: false,
    isPublished: true,
    statement:
      "I draw the things that live in the dark corners of your mind and give them a place to stay.",
    booking: {
      minimum: "$150",
      rate: "$180/hr",
      deposit: "$100, non-refundable, goes toward your tattoo",
      availability: "Books closed. Next opening announced on Instagram",
      notes: [
        "Large-scale and custom pieces only",
        "No color work",
        "No name or lettering-only tattoos",
      ],
    },
  },
  {
    slug: "chuy-mendoza",
    name: "Chuy Mendoza",
    specialties: ["Fine line"],
    bio: "Chuy specializes in clean, minimal fine line work. These pieces are small in scale but precise, perfect for a first tattoo or a subtle addition to a collection.",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5q3C90DEqav6Fi4xk96yOECEZLdOOsAURcGx-QK3h_Q&s=10",
    instagram: "chuy_caliart27",
    isBooking: true,
    isPublished: false,
    statement:
      "Small tattoos still deserve big intention. I love helping people get their first piece and making it feel easy.",
    booking: {
      minimum: "$80",
      rate: "$140/hr",
      deposit: "$50, non-refundable, goes toward your tattoo",
      availability: "Booking 2–3 weeks out",
      notes: ["Great for first tattoos", "Small to medium pieces only", "No cover-ups"],
    },
  },
];
