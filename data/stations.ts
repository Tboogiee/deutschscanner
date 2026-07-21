export type DepartureStation = {
  name: string;
  city: string;
  coordinates: readonly [number, number];
};

export const departureStations: DepartureStation[] = [
  { name: "Berlin Hbf", city: "Berlin", coordinates: [52.525589, 13.369549] },
  { name: "Berlin Ostkreuz", city: "Berlin", coordinates: [52.503, 13.4694] },
  { name: "Berlin Alexanderplatz", city: "Berlin", coordinates: [52.5219, 13.4132] },
  { name: "Berlin Südkreuz", city: "Berlin", coordinates: [52.475, 13.3653] },
  { name: "Berlin Gesundbrunnen", city: "Berlin", coordinates: [52.5486, 13.3889] },
  { name: "Berlin Zoologischer Garten", city: "Berlin", coordinates: [52.5072, 13.3323] },
  { name: "Berlin-Spandau", city: "Berlin", coordinates: [52.5347, 13.1973] },
  { name: "Potsdam Hbf", city: "Potsdam", coordinates: [52.3917, 13.0667] },
  { name: "Hamburg Hbf", city: "Hamburg", coordinates: [53.5528, 10.0067] },
  { name: "Bremen Hbf", city: "Bremen", coordinates: [53.0835, 8.8138] },
  { name: "Hannover Hbf", city: "Hannover", coordinates: [52.3773, 9.741] },
  { name: "Braunschweig Hbf", city: "Braunschweig", coordinates: [52.2522, 10.5402] },
  { name: "Wolfsburg Hbf", city: "Wolfsburg", coordinates: [52.4294, 10.7878] },
  { name: "Göttingen", city: "Göttingen", coordinates: [51.5369, 9.9261] },
  { name: "Osnabrück Hbf", city: "Osnabrück", coordinates: [52.2728, 8.0618] },
  { name: "Oldenburg (Oldb) Hbf", city: "Oldenburg", coordinates: [53.143, 8.2227] },
  { name: "Kiel Hbf", city: "Kiel", coordinates: [54.3149, 10.1315] },
  { name: "Lübeck Hbf", city: "Lübeck", coordinates: [53.8676, 10.6697] },
  { name: "Flensburg", city: "Flensburg", coordinates: [54.7747, 9.4369] },
  { name: "Westerland (Sylt)", city: "Westerland", coordinates: [54.9079, 8.3106] },
  { name: "Schwerin Hbf", city: "Schwerin", coordinates: [53.6348, 11.4084] },
  { name: "Rostock Hbf", city: "Rostock", coordinates: [54.0781, 12.131] },
  { name: "Magdeburg Hbf", city: "Magdeburg", coordinates: [52.1308, 11.6276] },
  { name: "Halle (Saale) Hbf", city: "Halle", coordinates: [51.477, 11.986] },
  { name: "Leipzig Hbf", city: "Leipzig", coordinates: [51.3455, 12.3822] },
  { name: "Dresden Hbf", city: "Dresden", coordinates: [51.0406, 13.732] },
  { name: "Cottbus Hbf", city: "Cottbus", coordinates: [51.7508, 14.3267] },
  { name: "Erfurt Hbf", city: "Erfurt", coordinates: [50.9727, 11.0384] },
  { name: "Weimar", city: "Weimar", coordinates: [50.9915, 11.3266] },
  { name: "Eisenach", city: "Eisenach", coordinates: [50.9764, 10.322] },
  { name: "Kassel-Wilhelmshöhe", city: "Kassel", coordinates: [51.3129, 9.4471] },
  { name: "Frankfurt (Main) Hbf", city: "Frankfurt", coordinates: [50.1071, 8.6638] },
  { name: "Wiesbaden Hbf", city: "Wiesbaden", coordinates: [50.0708, 8.2436] },
  { name: "Mainz Hbf", city: "Mainz", coordinates: [50.001, 8.2587] },
  { name: "Koblenz Hbf", city: "Koblenz", coordinates: [50.3509, 7.589] },
  { name: "Köln Hbf", city: "Köln", coordinates: [50.943, 6.9587] },
  { name: "Düsseldorf Hbf", city: "Düsseldorf", coordinates: [51.2197, 6.7943] },
  { name: "Essen Hbf", city: "Essen", coordinates: [51.4514, 7.0138] },
  { name: "Dortmund Hbf", city: "Dortmund", coordinates: [51.5179, 7.4593] },
  { name: "Münster (Westf) Hbf", city: "Münster", coordinates: [51.9567, 7.6359] },
  { name: "Bielefeld Hbf", city: "Bielefeld", coordinates: [52.0293, 8.5327] },
  { name: "Saarbrücken Hbf", city: "Saarbrücken", coordinates: [49.2413, 6.9906] },
  { name: "Karlsruhe Hbf", city: "Karlsruhe", coordinates: [48.9935, 8.4005] },
  { name: "Mannheim Hbf", city: "Mannheim", coordinates: [49.4797, 8.4699] },
  { name: "Heidelberg Hbf", city: "Heidelberg", coordinates: [49.4036, 8.6753] },
  { name: "Stuttgart Hbf", city: "Stuttgart", coordinates: [48.7851, 9.1828] },
  { name: "Freiburg (Breisgau) Hbf", city: "Freiburg", coordinates: [47.9977, 7.8418] },
  { name: "Nürnberg Hbf", city: "Nürnberg", coordinates: [49.4456, 11.0821] },
  { name: "München Hbf", city: "München", coordinates: [48.1402, 11.5586] },
  { name: "Augsburg Hbf", city: "Augsburg", coordinates: [48.3655, 10.8863] },
  { name: "Regensburg Hbf", city: "Regensburg", coordinates: [49.0118, 12.0993] },
];

export function stationByName(name: string) {
  return departureStations.find((station) => station.name === name) ?? departureStations[0];
}

export function distanceKm(
  from: readonly [number, number],
  to: readonly [number, number],
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;
  const latitudeDelta = toRadians(lat2 - lat1);
  const longitudeDelta = toRadians(lng2 - lng1);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function destinationDistance(
  station: DepartureStation,
  destination: { lat: number; lng: number },
) {
  return Math.round(distanceKm(station.coordinates, [destination.lat, destination.lng]));
}
