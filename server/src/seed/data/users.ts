export type SeedUser = {
  name: string;
  email: string;
  role: "admin" | "artist";
  artistSlug?: string;
};

export const users: SeedUser[] = [
  {
    name: "Taylor Goble",
    email: "taylor@auewellify.dev",
    role: "admin",
    artistSlug: "taylor-goble",
  },
  { name: "Shop Manager", email: "manager@auewellify.dev", role: "admin" },
  { name: "Jeff Cusack", email: "jeff@auewellify.dev", role: "artist", artistSlug: "jeff-cusack" },
  { name: "Angel", email: "angel@auewellify.dev", role: "artist", artistSlug: "angel" },
  {
    name: "Chuy Mendoza",
    email: "chuy@auewellify.dev",
    role: "artist",
    artistSlug: "chuy-mendoza",
  },
];
