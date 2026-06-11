"use client";

import { useMemo, useState } from "react";
import MapWrapper from "@/components/MapWrapper";
import { destinations, type Destination } from "@/data/destinations";

type TrainRouteStep = {
  type: "S" | "U" | "RE" | "RB" | "Bus" | "Tram";
  line: string;
  from: string;
  to: string;
  duration: string;
  note?: string;
};

type DestinationWithOptionalRoute = Destination & {
  route?: TrainRouteStep[];
  image?: string;
};

const tripTypes = [
  "All experience types",
  "Half-Day",
  "Day Trip",
  "Weekend Trip",
  "Multi Day Trip",
];

const durationOptions = [
  { label: "Any travel duration", value: "any" },
  { label: "Under 1 hour", value: "60" },
  { label: "Under 2 hours", value: "120" },
  { label: "Under 3 hours", value: "180" },
  { label: "Under 4 hours", value: "240" },
];

const categories = [
  "All travel vibes",
  "City",
  "Architecture",
  "Lakes",
  "Rivers",
  "Hiking",
  "History",
  "Nature",
  "Coast",
  "Wellness",
];

const imageBySlug: Record<string, string> = {
  "waren-mueritz": "/destinations/waren.jpg",
  waren: "/destinations/waren.jpg",
  potsdam: "/destinations/potsdam.jpg",
  schwerin: "/destinations/schwerin.jpg",
  rostock: "/destinations/rostock.jpg",
  luebbenau: "/destinations/luebbenau.jpg",
  dresden: "/destinations/dresden.jpg",
  "werder-havel": "/destinations/werder.jpg",
};

const dbStationBySlug: Record<string, string> = {
  potsdam: "Potsdam Hbf",
  "werder-havel": "Werder(Havel)",
  "brandenburg-havel": "Brandenburg Hbf",
  "beelitz-heilstaetten": "Beelitz-Heilstätten",
  "bad-belzig": "Bad Belzig",
  "bad-saarow": "Bad Saarow",
  "frankfurt-oder": "Frankfurt(Oder)",
  eberswalde: "Eberswalde Hbf",
  chorin: "Chorin",
  angermuende: "Angermünde",
  templin: "Templin Stadt",
  neustrelitz: "Neustrelitz Hbf",
  "waren-mueritz": "Waren(Müritz)",
  waren: "Waren(Müritz)",
  luebbenau: "Lübbenau(Spreewald)",
  luebben: "Lübben(Spreewald)",
  cottbus: "Cottbus Hbf",
  wittenberg: "Lutherstadt Wittenberg Hbf",
  dessau: "Dessau Hbf",
  magdeburg: "Magdeburg Hbf",
  leipzig: "Leipzig Hbf",
  dresden: "Dresden Hbf",
  wittenberge: "Wittenberge",
  rathenow: "Rathenow",
  neuruppin: "Neuruppin Rheinsberger Tor",
  "koenigs-wusterhausen": "Königs Wusterhausen",
  "wunsdorf-waldstadt": "Wünsdorf-Waldstadt",
  schwerin: "Schwerin Hbf",
  rostock: "Rostock Hbf",
  warnemuende: "Warnemünde",
  stralsund: "Stralsund Hbf",
  greifswald: "Greifswald",
  wismar: "Wismar",
};

const longDescriptions: Record<string, string> = {
  "waren-mueritz":
    "Waren (Müritz) is one of the most beautiful lake escapes reachable from Berlin by regional train. It sits directly on Lake Müritz, Germany’s largest inland lake, with a charming harbor, relaxed cafés, lakeside promenades, and access to the Müritz National Park.",
  potsdam:
    "Potsdam is the easiest elegant escape from Berlin. It combines palace gardens, lakes, historic streets, cafés, and wide green spaces.",
  schwerin:
    "Schwerin feels like a fairytale weekend destination. The castle sits between lakes, the old town is calm and walkable, and the city has a slower northern rhythm.",
  rostock:
    "Rostock gives you northern city energy with access to the Baltic Sea. It works well as a weekend trip for harbor walks, old-town streets, seafood, and beach access.",
  luebbenau:
    "Lübbenau is the classic Spreewald escape: green, quiet, watery, and perfect for boat rides, cycling, forest walks, and a complete change of atmosphere from Berlin.",
  dresden:
    "Dresden is one of the strongest cultural weekend trips from Berlin, with baroque architecture, museums, river views, cafés, and a dramatic old-town setting along the Elbe.",
  "werder-havel":
    "Werder (Havel) is a peaceful island town surrounded by water, orchards, cafés, and relaxed lake scenery. It is close enough for an easy half-day escape, but calm enough to feel like a real break from Berlin.",
};

const itineraries: Record<string, string[]> = {
  "waren-mueritz": [
    "Walk from the station toward the harbor.",
    "Have coffee or lunch by the lakeside promenade.",
    "Visit the Müritzeum nature discovery center.",
    "Walk or cycle along Lake Müritz.",
    "Take a boat ride if the weather is good.",
    "Stay for sunset at the harbor.",
  ],
  potsdam: [
    "Arrive at Potsdam Hbf.",
    "Walk through the Dutch Quarter.",
    "Visit Sanssouci Park and palace gardens.",
    "Stop by Neues Palais or the Orangery.",
    "End with dinner near the old town.",
  ],
  schwerin: [
    "Arrive at Schwerin Hbf.",
    "Walk toward Schwerin Castle.",
    "Explore the castle gardens.",
    "Have lunch in the historic center.",
    "Take a lake walk before returning.",
  ],
  rostock: [
    "Arrive at Rostock Hbf.",
    "Explore the old town and Neuer Markt.",
    "Walk toward the harbor area.",
    "Continue to Warnemünde for beach time.",
    "Return for dinner or stay overnight.",
  ],
  luebbenau: [
    "Arrive at Lübbenau station.",
    "Walk into the Spreewald old town area.",
    "Take a traditional canal boat ride.",
    "Try local Spreewald pickles.",
    "Rent a bike or walk along the waterways.",
  ],
  dresden: [
    "Arrive at Dresden Hbf.",
    "Walk toward Frauenkirche.",
    "Visit the Zwinger or museum quarter.",
    "Walk along the Elbe riverfront.",
    "Have dinner in the old town or Neustadt.",
  ],
  "werder-havel": [
    "Arrive at Werder (Havel) station.",
    "Walk toward the island old town.",
    "Stop for coffee or lunch near the water.",
    "Explore the riverfront paths and small streets.",
    "Visit during blossom season for orchard views.",
    "Return to Berlin in the afternoon or evening.",
  ],
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function lineBadgeClass(type: TrainRouteStep["type"]) {
  switch (type) {
    case "S":
      return "bg-green-600 text-white";
    case "U":
      return "bg-blue-700 text-white";
    case "RE":
      return "bg-red-600 text-white";
    case "RB":
      return "bg-orange-500 text-white";
    case "Bus":
      return "bg-purple-600 text-white";
    case "Tram":
      return "bg-pink-600 text-white";
    default:
      return "bg-slate-700 text-white";
  }
}

function getBestDestinationStation(destination: DestinationWithOptionalRoute) {
  return dbStationBySlug[destination.slug] ?? destination.name;
}

function buildDbUrl(
  departureStation: string,
  destination: DestinationWithOptionalRoute,
  date: string,
  time: string,
  timeMode: string,
) {
  const destinationStation = getBestDestinationStation(destination);
  const hashParams = new URLSearchParams();

  hashParams.set("sts", "true");
  hashParams.set("so", departureStation);
  hashParams.set("zo", destinationStation);
  hashParams.set("soid", `O=${departureStation}`);
  hashParams.set("zoid", `O=${destinationStation}`);
  hashParams.set("sot", "ST");
  hashParams.set("zot", "ST");
  hashParams.set("hd", `${date}T${time}:00`);
  hashParams.set("hza", timeMode === "arrive" ? "A" : "D");
  hashParams.set("ar", timeMode === "arrive" ? "true" : "false");
  hashParams.set("s", "true");
  hashParams.set("d", "false");
  hashParams.set("kl", "2");

  return `https://www.bahn.de/buchung/fahrplan/suche#${hashParams.toString()}`;
}

function getFallbackRoute(destination: DestinationWithOptionalRoute): TrainRouteStep[] {
  return [
    {
      type: "RE",
      line: "Regional",
      from: "Berlin Hbf",
      to: getBestDestinationStation(destination),
      duration: destination.time,
      note: "Exact line depends on the selected date and time. Open DB to confirm live departures.",
    },
  ];
}

function getDestinationImage(destination: DestinationWithOptionalRoute) {
  return imageBySlug[destination.slug] ?? destination.image ?? "/destinations/potsdam.jpg";
}

function getDestinationDescription(destination: DestinationWithOptionalRoute) {
  return longDescriptions[destination.slug] ?? destination.summary;
}

function getDestinationItinerary(destination: DestinationWithOptionalRoute) {
  return (
    itineraries[destination.slug] ?? [
      `Arrive at ${getBestDestinationStation(destination)}.`,
      "Walk toward the center or main natural area.",
      "Find a local café or lunch spot.",
      "Explore the main historical, lake, river, or nature highlights.",
      "Return to the station for your train back to Berlin.",
    ]
  );
}

export default function HomeClient() {
  const [departureStation, setDepartureStation] = useState("Berlin Hbf");
  const [query, setQuery] = useState("");
  const [tripType, setTripType] = useState("All experience types");
  const [duration, setDuration] = useState("any");
  const [category, setCategory] = useState("All travel vibes");
  const [selectedSlug, setSelectedSlug] = useState(destinations[0].slug);

  const [travelDate, setTravelDate] = useState(todayISO());
  const [travelTime, setTravelTime] = useState("10:00");
  const [timeMode, setTimeMode] = useState("depart");

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const matchesQuery =
        destination.name.toLowerCase().includes(query.toLowerCase()) ||
        destination.summary.toLowerCase().includes(query.toLowerCase()) ||
        destination.state.toLowerCase().includes(query.toLowerCase());

      const matchesTripType =
        tripType === "All experience types" || destination.tripTypes.includes(tripType);

      const matchesDuration =
        duration === "any" || destination.durationMin <= Number(duration);

      const matchesCategory =
        category === "All travel vibes" || destination.categories.includes(category);

      return matchesQuery && matchesTripType && matchesDuration && matchesCategory;
    });
  }, [query, tripType, duration, category]);

  const selectedDestination =
    (destinations.find((destination) => destination.slug === selectedSlug) ??
      filteredDestinations[0] ??
      destinations[0]) as DestinationWithOptionalRoute;

  const routePreview =
    selectedDestination.route && selectedDestination.route.length > 0
      ? selectedDestination.route
      : getFallbackRoute(selectedDestination);

  const dbUrl = buildDbUrl(
    departureStation,
    selectedDestination,
    travelDate,
    travelTime,
    timeMode,
  );

  function handleSearch() {
    if (filteredDestinations[0]) {
      setSelectedSlug(filteredDestinations[0].slug);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#172033]">
      <header className="border-b border-[#DDE6F3] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <img src="/logo.png" alt="DeutschScanner" className="h-72 w-auto" />
          </div>

          <nav className="flex items-center gap-2 text-sm font-semibold text-[#0B3B82]">
            <button className="rounded-full px-4 py-2 hover:bg-[#F1F5FB]">News</button>
            <button className="rounded-full px-4 py-2 hover:bg-[#F1F5FB]">Destinations</button>
            <button className="rounded-full px-4 py-2 hover:bg-[#F1F5FB]">Contact</button>
            <span className="ml-2 rounded-full bg-[#FFF1E3] px-4 py-2 text-[#D96A00]">
              Hello Roy!
            </span>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[2rem] border border-[#DDE6F3] bg-white p-6 shadow-sm">
          <h1 className="text-4xl font-black text-[#0B3B82]">
            Discover, Explore, Go.
          </h1>

          <p className="mt-2 text-[#5f6b85]">
            Choose your station, trip style, travel window, and destination.
          </p>

          <div className="mt-6 grid gap-3">
            <label className="text-sm font-bold text-[#0B3B82]">Departure station</label>
            <input
              value={departureStation}
              onChange={(event) => setDepartureStation(event.target.value)}
              placeholder="Berlin Hbf"
              className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none focus:border-[#FF8A1F]"
            />

            <label className="text-sm font-bold text-[#0B3B82]">Trip type</label>
            <select
              value={tripType}
              onChange={(event) => setTripType(event.target.value)}
              className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none focus:border-[#FF8A1F]"
            >
              {tripTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label className="text-sm font-bold text-[#0B3B82]">Travel duration</label>
            <select
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none focus:border-[#FF8A1F]"
            >
              {durationOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <label className="text-sm font-bold text-[#0B3B82]">Experience vibe</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none focus:border-[#FF8A1F]"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label className="text-sm font-bold text-[#0B3B82]">Search destination</label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Waren, lakes, coast, history..."
              className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none focus:border-[#FF8A1F]"
            />

            <div className="mt-3 rounded-3xl border border-[#DDE6F3] bg-[#F7FAFD] p-4">
              <h3 className="text-base font-black text-[#0B3B82]">
                Departure window
              </h3>

              <div className="mt-3 grid gap-3">
                <label className="text-sm font-bold text-[#0B3B82]">
                  Departure / arrival
                </label>
                <select
                  value={timeMode}
                  onChange={(event) => setTimeMode(event.target.value)}
                  className="rounded-2xl border border-[#D8E2F0] bg-white px-4 py-4 outline-none focus:border-[#FF8A1F]"
                >
                  <option value="depart">Departure time</option>
                  <option value="arrive">Arrival time</option>
                </select>

                <label className="text-sm font-bold text-[#0B3B82]">Travel date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(event) => setTravelDate(event.target.value)}
                  className="rounded-2xl border border-[#D8E2F0] bg-white px-4 py-4 outline-none focus:border-[#FF8A1F]"
                />

                <label className="text-sm font-bold text-[#0B3B82]">
                  Time of departure
                </label>
                <input
                  type="time"
                  value={travelTime}
                  onChange={(event) => setTravelTime(event.target.value)}
                  className="rounded-2xl border border-[#D8E2F0] bg-white px-4 py-4 outline-none focus:border-[#FF8A1F]"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="mt-2 rounded-full bg-[#0B3B82] px-6 py-4 font-bold text-white shadow-sm transition hover:bg-[#082D63]"
            >
              Explore
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-black text-[#0B3B82]">
              Suggested places
            </h2>

            <p className="mt-1 text-sm text-[#5f6b85]">
              Showing {filteredDestinations.length} matching destinations.
            </p>

            <div className="mt-4 max-h-[520px] space-y-4 overflow-y-auto pr-2">
              {filteredDestinations.map((destination) => {
                const typedDestination = destination as DestinationWithOptionalRoute;
                const isSelected = selectedDestination.slug === destination.slug;

                return (
                  <button
                    key={destination.slug}
                    onClick={() => setSelectedSlug(destination.slug)}
                    className={`grid w-full grid-cols-[92px_1fr] gap-4 rounded-3xl border p-3 text-left transition ${
                      isSelected
                        ? "border-[#FF8A1F] bg-[#FFF7EF]"
                        : "border-[#DDE6F3] bg-[#F7FAFD] hover:border-[#FF8A1F]"
                    }`}
                  >
                    <img
                      src={getDestinationImage(typedDestination)}
                      alt={destination.name}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />

                    <div>
                      <div className="flex justify-between gap-2">
                        <h3 className="font-black text-[#0B3B82]">
                          {destination.name}
                        </h3>
                        <span className="text-sm font-bold text-[#FF8A1F]">
                          {destination.time}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#7C879B]">
                        {destination.categories.slice(0, 2).join(" • ")}
                      </p>

                      <p className="mt-2 line-clamp-2 text-sm text-[#5f6b85]">
                        {destination.summary}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="grid gap-6">
          <div className="overflow-hidden rounded-[2rem] border border-[#DDE6F3] bg-white shadow-sm">
            <MapWrapper
              points={filteredDestinations}
              selectedSlug={selectedDestination.slug}
              onSelect={setSelectedSlug}
            />
          </div>

          <article className="rounded-[2rem] border border-[#DDE6F3] bg-white p-6 shadow-sm">
            <h2 className="text-6xl font-black leading-none text-[#0B3B82]">
              {selectedDestination.name}
            </h2>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-3xl bg-[#F7FAFD] p-4">
                <p className="text-xs text-[#5f6b85]">Travel time</p>
                <p className="font-bold text-[#0B3B82]">
                  {selectedDestination.time}
                </p>
              </div>

              <div className="rounded-3xl bg-[#F7FAFD] p-4">
                <p className="text-xs text-[#5f6b85]">
                  {timeMode === "depart" ? "Date to leave" : "Date to arrive"}
                </p>
                <p className="font-bold text-[#0B3B82]">{travelDate}</p>
              </div>

              <div className="rounded-3xl bg-[#F7FAFD] p-4">
                <p className="text-xs text-[#5f6b85]">
                  {timeMode === "depart" ? "Time to leave" : "Arrival time"}
                </p>
                <p className="font-bold text-[#0B3B82]">{travelTime}</p>
              </div>
            </div>

            <img
              src={getDestinationImage(selectedDestination)}
              alt={selectedDestination.name}
              className="mt-5 aspect-[4/2] w-full rounded-[2rem] object-cover"
            />

            <a
              href={dbUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-[#0B3B82] px-6 py-5 text-base font-black text-white shadow-sm transition hover:bg-[#082D63]"
            >
              <span className="rounded bg-red-600 px-2 py-1 font-black text-white">
                DB
              </span>
              Search timetable on bahn.de
            </a>

            <p className="mt-5 text-[#5f6b85]">
              {getDestinationDescription(selectedDestination)}
            </p>

            <section className="mt-6 rounded-3xl bg-[#F7FAFD] p-6">
              <h3 className="text-4xl font-black text-[#0B3B82]">
                What to do
              </h3>

              <ol className="mt-5 list-decimal space-y-4 pl-7 text-lg font-semibold leading-relaxed text-[#334155]">
                {getDestinationItinerary(selectedDestination).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>

            <section className="mt-6 rounded-3xl border border-[#DDE6F3] bg-[#F7FAFD] p-5">
              <h3 className="mb-4 text-xl font-bold text-[#0B3B82]">
                Train route preview
              </h3>

              <div className="space-y-3">
                {routePreview.map((step, index) => (
                  <div
                    key={`${step.line}-${index}`}
                    className="rounded-2xl border border-[#E3EAF3] bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-lg px-3 py-1 text-sm font-black ${lineBadgeClass(
                          step.type,
                        )}`}
                      >
                        {step.type}
                      </span>

                      <span className="font-black text-[#0B3B82]">
                        {step.line}
                      </span>

                      <span className="text-sm font-semibold text-[#FF8A1F]">
                        {step.duration}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-[#5f6b85]">
                      {step.from} → {step.to}
                    </p>

                    {step.note && (
                      <p className="mt-1 text-xs text-[#7C879B]">
                        {step.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </article>
        </section>
      </section>
    </main>
  );
}