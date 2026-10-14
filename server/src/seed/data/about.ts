export type AboutValue = {
  id: number;
  title: string;
  description: string;
};

export type About = {
  heading: string;
  body: string;
  values: AboutValue[];
};

export const about: About = {
  heading: "A Higher Standard of Tattooing",
  body: "As Above Tattoo is a Salt Lake City tattoo studio built around artistic expression, thoughtful craftsmanship, and a commitment to doing things right. We believe a great tattoo is about more than the finished piece. It's about the entire experience, from the first conversation to the final result. Whether you're bringing a fully realized idea or working with an artist to develop something entirely your own, our goal is to create meaningful, lasting work in a space where you feel comfortable, respected, and confident in your choice.",
  values: [
    {
      id: 1,
      title: "Cleanliness",
      description:
        "Your health comes first. We maintain rigorous hygiene standards, use proper sterilization practices, and keep our workspace clean and professional.",
    },
    {
      id: 2,
      title: "Comfort",
      description:
        "Getting tattooed is a personal experience. We want you to feel welcome, heard, and comfortable throughout the entire process.",
    },
    {
      id: 3,
      title: "Artistry",
      description:
        "Every tattoo deserves intention and attention to detail. We value individual expression, thoughtful design, and craftsmanship that stands the test of time.",
    },
    {
      id: 4,
      title: "Quality",
      description:
        "We take pride in the work we put into the world. From the initial design to the finished tattoo, we focus on precision, consistency, and results you'll be proud to wear.",
    },
  ],
};
