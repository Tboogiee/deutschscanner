export type Destination = {
  slug: string;
  name: string;
  summary: string;
  coordinates: [number, number];
};

export const destinations: Destination[] = [
  {
    slug: "potsdam",
    name: "Potsdam",
    summary: "Palaces, lakes, gardens, and an easy regional trip from Berlin.",
    coordinates: [52.3906, 13.0645],
  },
  {
    slug: "brandenburg-an-der-havel",
    name: "Brandenburg an der Havel",
    summary: "Historic old town, river views, and relaxed day-trip energy.",
    coordinates: [52.4125, 12.5316],
  },
  {
    slug: "werder-havel",
    name: "Werder (Havel)",
    summary: "A small island town known for water, orchards, and calm views.",
    coordinates: [52.3787, 12.934],
  },
];