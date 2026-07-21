import { expandedDestinations } from "@/data/expandedDestinations";

export type TransitType = "S" | "U" | "RE" | "RB" | "Bus" | "Tram";

export type Coordinate = [number, number];

export type RouteStop = {
  name: string;
  coordinates: Coordinate;
};

export type RouteOption = {
  id: string;
  type: TransitType;
  line: string;
  label: string;
  duration: string;
  stops: RouteStop[];
  geometry: Coordinate[];
};

export type Destination = {
  slug: string;
  name: string;
  state: string;
  summary: string;
  categories: string[];
  tripTypes: string[];
  durationMin: number;
  time: string;
  transfers: string;
  lat: number;
  lng: number;
  image?: string;
  routeOptions: RouteOption[];
};

const berlinHbf: RouteStop = {
  name: "Berlin Hbf",
  coordinates: [52.5251, 13.3694],
};

function makeRoute(
  id: string,
  type: TransitType,
  line: string,
  label: string,
  duration: string,
  stops: RouteStop[],
): RouteOption {
  return {
    id,
    type,
    line,
    label,
    duration,
    stops,
    geometry: stops.map((stop) => stop.coordinates),
  };
}

function destinationImage(slug: string) {
  return `/destinations/${slug}.jpg`;
}

export const destinations: Destination[] = [
  {
    slug: "potsdam",
    name: "Potsdam",
    state: "Brandenburg",
    summary: "Palaces, gardens, lakes, and one of the easiest trips from Berlin.",
    categories: ["City", "Architecture", "History", "Lakes"],
    tripTypes: ["Half-Day", "Day Trip"],
    durationMin: 35,
    time: "35 min",
    transfers: "Direct or 0-1",
    lat: 52.3906,
    lng: 13.0645,
    image: destinationImage("potsdam"),
    routeOptions: [
      makeRoute("potsdam-re1", "RE", "RE1", "Fast regional route", "35 min", [
        berlinHbf,
        { name: "Berlin Zoologischer Garten", coordinates: [52.5072, 13.3323] },
        { name: "Berlin-Wannsee", coordinates: [52.421, 13.1798] },
        { name: "Potsdam Hbf", coordinates: [52.3917, 13.0667] },
      ]),
      makeRoute("potsdam-s7", "S", "S7", "Frequent S-Bahn route", "45-55 min", [
        berlinHbf,
        { name: "Friedrichstraße", coordinates: [52.5203, 13.3869] },
        { name: "Zoologischer Garten", coordinates: [52.5069, 13.3328] },
        { name: "Charlottenburg", coordinates: [52.5047, 13.3033] },
        { name: "Wannsee", coordinates: [52.421, 13.1798] },
        { name: "Babelsberg", coordinates: [52.3919, 13.0922] },
        { name: "Potsdam Hbf", coordinates: [52.3917, 13.0667] },
      ]),
    ],
  },
  {
    slug: "oranienburg",
    name: "Oranienburg",
    state: "Brandenburg",
    summary: "A close northern trip with palace grounds, river walks, and history.",
    categories: ["City", "History", "Rivers"],
    tripTypes: ["Half-Day", "Day Trip"],
    durationMin: 35,
    time: "35 min",
    transfers: "Direct",
    lat: 52.7536,
    lng: 13.2367,
    image: destinationImage("oranienburg"),
    routeOptions: [
      makeRoute("oranienburg-s1", "S", "S1", "Direct northern S-Bahn route", "35-50 min", [
        berlinHbf,
        { name: "Berlin Gesundbrunnen", coordinates: [52.5486, 13.3889] },
        { name: "Wittenau", coordinates: [52.5965, 13.3369] },
        { name: "Frohnau", coordinates: [52.6333, 13.2908] },
        { name: "Oranienburg", coordinates: [52.7544, 13.2494] },
      ]),
    ],
  },
  {
    slug: "werder-havel",
    name: "Werder (Havel)",
    state: "Brandenburg",
    summary: "A calm island town with water, orchards, cafés, and lake views.",
    categories: ["Lakes", "Rivers", "Nature", "City"],
    tripTypes: ["Half-Day", "Day Trip"],
    durationMin: 45,
    time: "45 min",
    transfers: "Direct or 1",
    lat: 52.3787,
    lng: 12.934,
    image: destinationImage("werder-havel"),
    routeOptions: [
      makeRoute("werder-re1", "RE", "RE1", "Regional route west of Berlin", "45 min", [
        berlinHbf,
        { name: "Berlin-Wannsee", coordinates: [52.421, 13.1798] },
        { name: "Potsdam Hbf", coordinates: [52.3917, 13.0667] },
        { name: "Werder (Havel)", coordinates: [52.3926, 12.9285] },
      ]),
    ],
  },
  {
    slug: "brandenburg-havel",
    name: "Brandenburg an der Havel",
    state: "Brandenburg",
    summary: "Historic streets, river scenery, churches, and relaxed old-town energy.",
    categories: ["City", "Rivers", "History", "Architecture"],
    tripTypes: ["Day Trip"],
    durationMin: 55,
    time: "55 min",
    transfers: "Direct",
    lat: 52.4125,
    lng: 12.5316,
    image: destinationImage("brandenburg-havel"),
    routeOptions: [
      makeRoute("brandenburg-re1", "RE", "RE1", "Direct regional route west", "55-65 min", [
        berlinHbf,
        { name: "Potsdam Hbf", coordinates: [52.3917, 13.0667] },
        { name: "Werder (Havel)", coordinates: [52.3926, 12.9285] },
        { name: "Brandenburg Hbf", coordinates: [52.4, 12.55] },
      ]),
    ],
  },
  {
    slug: "beelitz-heilstaetten",
    name: "Beelitz-Heilstätten",
    state: "Brandenburg",
    summary: "Forest paths, historic sanatorium architecture, and a treetop walk.",
    categories: ["Architecture", "History", "Nature", "Hiking"],
    tripTypes: ["Half-Day", "Day Trip"],
    durationMin: 45,
    time: "45 min",
    transfers: "Direct or 1",
    lat: 52.2667,
    lng: 12.9167,
    image: destinationImage("beelitz-heilstaetten"),
    routeOptions: [
      makeRoute("beelitz-re7", "RE", "RE7", "Regional route south-west", "45-55 min", [
        berlinHbf,
        { name: "Berlin-Wannsee", coordinates: [52.421, 13.1798] },
        { name: "Michendorf", coordinates: [52.3138, 13.0257] },
        { name: "Beelitz-Heilstätten", coordinates: [52.2667, 12.9167] },
      ]),
    ],
  },
  {
    slug: "bad-belzig",
    name: "Bad Belzig",
    state: "Brandenburg",
    summary: "A small spa town with castle views, forests, and relaxed walks.",
    categories: ["Wellness", "Hiking", "History", "Nature"],
    tripTypes: ["Day Trip"],
    durationMin: 70,
    time: "1h 10m",
    transfers: "Direct",
    lat: 52.1416,
    lng: 12.5927,
    image: destinationImage("bad-belzig"),
    routeOptions: [
      makeRoute("bad-belzig-re7", "RE", "RE7", "Regional route to spa town", "1h 10m", [
        berlinHbf,
        { name: "Michendorf", coordinates: [52.3138, 13.0257] },
        { name: "Beelitz-Heilstätten", coordinates: [52.2667, 12.9167] },
        { name: "Bad Belzig", coordinates: [52.1416, 12.5927] },
      ]),
    ],
  },
  {
    slug: "bad-saarow",
    name: "Bad Saarow",
    state: "Brandenburg",
    summary: "Lake Scharmützelsee, wellness, swimming spots, and peaceful weekends.",
    categories: ["Lakes", "Wellness", "Nature"],
    tripTypes: ["Day Trip", "Weekend Trip"],
    durationMin: 75,
    time: "1h 15m",
    transfers: "1",
    lat: 52.2833,
    lng: 14.0667,
    image: destinationImage("bad-saarow"),
    routeOptions: [
      makeRoute("bad-saarow-re1-rb35", "RE", "RE1 + RB35", "Regional route with transfer", "1h 15m", [
        berlinHbf,
        { name: "Berlin Ostkreuz", coordinates: [52.5031, 13.4694] },
        { name: "Fürstenwalde (Spree)", coordinates: [52.3607, 14.0616] },
        { name: "Bad Saarow", coordinates: [52.2833, 14.0667] },
      ]),
    ],
  },
  {
    slug: "frankfurt-oder",
    name: "Frankfurt (Oder)",
    state: "Brandenburg",
    summary: "Riverfront city on the Polish border with bridges and cultural stops.",
    categories: ["City", "Rivers", "History"],
    tripTypes: ["Day Trip"],
    durationMin: 70,
    time: "1h 10m",
    transfers: "Direct",
    lat: 52.3414,
    lng: 14.5506,
    image: destinationImage("frankfurt-oder"),
    routeOptions: [
      makeRoute("frankfurt-oder-re1", "RE", "RE1", "Direct eastern regional route", "1h 10m", [
        berlinHbf,
        { name: "Berlin Ostkreuz", coordinates: [52.5031, 13.4694] },
        { name: "Erkner", coordinates: [52.4253, 13.7496] },
        { name: "Fürstenwalde (Spree)", coordinates: [52.3607, 14.0616] },
        { name: "Frankfurt (Oder)", coordinates: [52.3375, 14.5471] },
      ]),
    ],
  },
  {
    slug: "eberswalde",
    name: "Eberswalde",
    state: "Brandenburg",
    summary: "Forests, canals, industrial heritage, and access to nature north of Berlin.",
    categories: ["Nature", "Rivers", "Hiking", "History"],
    tripTypes: ["Half-Day", "Day Trip"],
    durationMin: 35,
    time: "35 min",
    transfers: "Direct",
    lat: 52.8349,
    lng: 13.8195,
    image: destinationImage("eberswalde"),
    routeOptions: [
      makeRoute("eberswalde-re3", "RE", "RE3", "Regional north-east route", "35-45 min", [
        berlinHbf,
        { name: "Berlin Gesundbrunnen", coordinates: [52.5486, 13.3889] },
        { name: "Bernau bei Berlin", coordinates: [52.6798, 13.5895] },
        { name: "Eberswalde Hbf", coordinates: [52.8349, 13.8195] },
      ]),
    ],
  },
  {
    slug: "chorin",
    name: "Chorin",
    state: "Brandenburg",
    summary: "A famous monastery setting surrounded by quiet forest landscapes.",
    categories: ["Architecture", "History", "Nature", "Hiking"],
    tripTypes: ["Day Trip"],
    durationMin: 55,
    time: "55 min",
    transfers: "Direct or 1",
    lat: 52.9,
    lng: 13.8667,
    image: destinationImage("chorin"),
    routeOptions: [
      makeRoute("chorin-re3", "RE", "RE3", "Regional route past Eberswalde", "55-65 min", [
        berlinHbf,
        { name: "Berlin Gesundbrunnen", coordinates: [52.5486, 13.3889] },
        { name: "Eberswalde Hbf", coordinates: [52.8349, 13.8195] },
        { name: "Chorin", coordinates: [52.901, 13.871] },
      ]),
    ],
  },
  {
    slug: "angermuende",
    name: "Angermünde",
    state: "Brandenburg",
    summary: "Gateway to the Uckermark with lakes, old-town charm, and nature routes.",
    categories: ["Lakes", "Nature", "Hiking", "City"],
    tripTypes: ["Day Trip", "Weekend Trip"],
    durationMin: 65,
    time: "1h 05m",
    transfers: "Direct",
    lat: 53.0147,
    lng: 13.9996,
    image: destinationImage("angermuende"),
    routeOptions: [
      makeRoute("angermuende-re3", "RE", "RE3", "Uckermark gateway route", "1h 05m", [
        berlinHbf,
        { name: "Bernau bei Berlin", coordinates: [52.6798, 13.5895] },
        { name: "Eberswalde Hbf", coordinates: [52.8349, 13.8195] },
        { name: "Angermünde", coordinates: [53.0147, 13.9996] },
      ]),
    ],
  },
  {
    slug: "templin",
    name: "Templin",
    state: "Brandenburg",
    summary: "A walled town in the Uckermark with lakes, spa options, and cycling.",
    categories: ["Lakes", "Wellness", "Nature", "History"],
    tripTypes: ["Day Trip", "Weekend Trip"],
    durationMin: 115,
    time: "1h 55m",
    transfers: "1",
    lat: 53.1187,
    lng: 13.5022,
    image: destinationImage("templin"),
    routeOptions: [
      makeRoute("templin-re3-rb63", "RE", "RE3 + RB63", "Regional route with branch transfer", "1h 55m", [
        berlinHbf,
        { name: "Bernau bei Berlin", coordinates: [52.6798, 13.5895] },
        { name: "Eberswalde Hbf", coordinates: [52.8349, 13.8195] },
        { name: "Templin Stadt", coordinates: [53.1187, 13.5022] },
      ]),
    ],
  },
  {
    slug: "neustrelitz",
    name: "Neustrelitz",
    state: "Mecklenburg-Vorpommern",
    summary: "A relaxed lake-country town close to the Müritz National Park region.",
    categories: ["Lakes", "Nature", "Hiking", "City"],
    tripTypes: ["Day Trip", "Weekend Trip"],
    durationMin: 75,
    time: "1h 15m",
    transfers: "Direct",
    lat: 53.3622,
    lng: 13.0639,
    image: destinationImage("neustrelitz"),
    routeOptions: [
      makeRoute("neustrelitz-re5", "RE", "RE5", "Northern lake-country route", "1h 15m", [
        berlinHbf,
        { name: "Berlin Gesundbrunnen", coordinates: [52.5486, 13.3889] },
        { name: "Oranienburg", coordinates: [52.7544, 13.2494] },
        { name: "Neustrelitz Hbf", coordinates: [53.3622, 13.0639] },
      ]),
    ],
  },
  {
    slug: "waren-mueritz",
    name: "Waren (Müritz)",
    state: "Mecklenburg-Vorpommern",
    summary: "Lake Müritz, harbor walks, swimming, cycling, and national park access.",
    categories: ["Lakes", "Nature", "Hiking"],
    tripTypes: ["Day Trip", "Weekend Trip"],
    durationMin: 105,
    time: "1h 45m",
    transfers: "Direct or 1",
    lat: 53.5167,
    lng: 12.6833,
    image: destinationImage("waren-mueritz"),
    routeOptions: [
      makeRoute("waren-re5", "RE", "RE5", "Mecklenburg lake route", "1h 45m", [
        berlinHbf,
        { name: "Oranienburg", coordinates: [52.7544, 13.2494] },
        { name: "Neustrelitz Hbf", coordinates: [53.3622, 13.0639] },
        { name: "Waren (Müritz)", coordinates: [53.5167, 12.6833] },
      ]),
    ],
  },
  {
    slug: "luebbenau",
    name: "Lübbenau",
    state: "Brandenburg",
    summary: "Spreewald canals, punting boats, cycling, and green weekend escapes.",
    categories: ["Rivers", "Nature", "Hiking"],
    tripTypes: ["Day Trip", "Weekend Trip"],
    durationMin: 75,
    time: "1h 15m",
    transfers: "Direct",
    lat: 51.8667,
    lng: 13.9667,
    image: destinationImage("luebbenau"),
    routeOptions: [
      makeRoute("luebbenau-re2", "RE", "RE2", "Spreewald regional route", "1h 15m", [
        berlinHbf,
        { name: "Berlin Ostkreuz", coordinates: [52.5031, 13.4694] },
        { name: "Königs Wusterhausen", coordinates: [52.3, 13.6333] },
        { name: "Lübbenau (Spreewald)", coordinates: [51.8667, 13.9667] },
      ]),
    ],
  },
  {
    slug: "luebben",
    name: "Lübben",
    state: "Brandenburg",
    summary: "A quieter Spreewald base with canals, parks, and easy nature access.",
    categories: ["Rivers", "Nature", "Hiking"],
    tripTypes: ["Day Trip"],
    durationMin: 65,
    time: "1h 05m",
    transfers: "Direct",
    lat: 51.9381,
    lng: 13.8889,
    image: destinationImage("luebben"),
    routeOptions: [
      makeRoute("luebben-re2", "RE", "RE2", "Direct Spreewald route", "1h 05m", [
        berlinHbf,
        { name: "Königs Wusterhausen", coordinates: [52.3, 13.6333] },
        { name: "Brand Tropical Islands", coordinates: [52.038, 13.748] },
        { name: "Lübben (Spreewald)", coordinates: [51.9381, 13.8889] },
      ]),
    ],
  },
  {
    slug: "cottbus",
    name: "Cottbus",
    state: "Brandenburg",
    summary: "A southern Brandenburg city with parks, culture, and Branitz connections.",
    categories: ["City", "Architecture", "History", "Nature"],
    tripTypes: ["Day Trip"],
    durationMin: 85,
    time: "1h 25m",
    transfers: "Direct",
    lat: 51.7563,
    lng: 14.3329,
    image: destinationImage("cottbus"),
    routeOptions: [
      makeRoute("cottbus-re2", "RE", "RE2", "Southern Brandenburg route", "1h 25m", [
        berlinHbf,
        { name: "Königs Wusterhausen", coordinates: [52.3, 13.6333] },
        { name: "Lübbenau (Spreewald)", coordinates: [51.8667, 13.9667] },
        { name: "Cottbus Hbf", coordinates: [51.7563, 14.3329] },
      ]),
    ],
  },
  {
    slug: "leipzig",
    name: "Leipzig",
    state: "Saxony",
    summary: "Music, cafés, lakes nearby, museums, and one of the best city escapes.",
    categories: ["City", "History", "Architecture"],
    tripTypes: ["Day Trip", "Weekend Trip"],
    durationMin: 165,
    time: "2h 45m",
    transfers: "Regional route varies",
    lat: 51.3397,
    lng: 12.3731,
    image: destinationImage("leipzig"),
    routeOptions: [
      makeRoute("leipzig-regional", "RE", "RE + S", "Regional-only route", "2h 45m+", [
        berlinHbf,
        { name: "Lutherstadt Wittenberg", coordinates: [51.8667, 12.65] },
        { name: "Bitterfeld", coordinates: [51.6236, 12.3236] },
        { name: "Leipzig Hbf", coordinates: [51.3455, 12.3822] },
      ]),
    ],
  },
  {
    slug: "dresden",
    name: "Dresden",
    state: "Saxony",
    summary: "Baroque architecture, riverfront views, museums, and weekend-trip potential.",
    categories: ["City", "Architecture", "History", "Rivers"],
    tripTypes: ["Day Trip", "Weekend Trip"],
    durationMin: 190,
    time: "3h 10m",
    transfers: "Regional route varies",
    lat: 51.0504,
    lng: 13.7373,
    image: destinationImage("dresden"),
    routeOptions: [
      makeRoute("dresden-regional", "RE", "RE", "Regional-only route", "3h 10m+", [
        berlinHbf,
        { name: "Elsterwerda", coordinates: [51.4606, 13.5206] },
        { name: "Coswig", coordinates: [51.1267, 13.5833] },
        { name: "Dresden Hbf", coordinates: [51.0406, 13.7319] },
      ]),
    ],
  },
  {
    slug: "rostock",
    name: "Rostock",
    state: "Mecklenburg-Vorpommern",
    summary: "Northern city energy, harbor walks, and access to the Baltic Sea.",
    categories: ["Coast", "City", "Rivers"],
    tripTypes: ["Weekend Trip", "Multi Day Trip"],
    durationMin: 160,
    time: "2h 40m",
    transfers: "Regional route varies",
    lat: 54.0924,
    lng: 12.0991,
    image: destinationImage("rostock"),
    routeOptions: [
      makeRoute("rostock-re5", "RE", "RE5", "Regional route to the Baltic", "2h 40m", [
        berlinHbf,
        { name: "Oranienburg", coordinates: [52.7544, 13.2494] },
        { name: "Neustrelitz Hbf", coordinates: [53.3622, 13.0639] },
        { name: "Rostock Hbf", coordinates: [54.078, 12.1327] },
      ]),
    ],
  },
  {
    slug: "warnemuende",
    name: "Warnemünde",
    state: "Mecklenburg-Vorpommern",
    summary: "Baltic beach, lighthouse, harbor promenade, and seaside weekend feeling.",
    categories: ["Coast", "Nature", "Rivers"],
    tripTypes: ["Weekend Trip", "Multi Day Trip"],
    durationMin: 185,
    time: "3h 05m",
    transfers: "1",
    lat: 54.176,
    lng: 12.086,
    image: destinationImage("warnemuende"),
    routeOptions: [
      makeRoute("warnemuende-re5-s", "RE", "RE5 + S", "Baltic beach route", "3h 05m", [
        berlinHbf,
        { name: "Neustrelitz Hbf", coordinates: [53.3622, 13.0639] },
        { name: "Rostock Hbf", coordinates: [54.078, 12.1327] },
        { name: "Warnemünde", coordinates: [54.176, 12.086] },
      ]),
    ],
  },
  {
    slug: "schwerin",
    name: "Schwerin",
    state: "Mecklenburg-Vorpommern",
    summary: "A lakeside palace city for a beautiful regional weekend escape.",
    categories: ["Lakes", "Architecture", "History", "City"],
    tripTypes: ["Weekend Trip", "Multi Day Trip"],
    durationMin: 225,
    time: "3h 45m",
    transfers: "Regional route varies",
    lat: 53.6355,
    lng: 11.4012,
    image: destinationImage("schwerin"),
    routeOptions: [
      makeRoute("schwerin-regional", "RE", "RE", "Regional route to Schwerin", "3h 45m", [
        berlinHbf,
        { name: "Wittenberge", coordinates: [53.0, 11.75] },
        { name: "Ludwigslust", coordinates: [53.3297, 11.4977] },
        { name: "Schwerin Hbf", coordinates: [53.6355, 11.4012] },
      ]),
    ],
  },
  ...expandedDestinations,
];
