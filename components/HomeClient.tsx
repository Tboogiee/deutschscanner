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

const categories = [
  "All",
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

const tripTypes = ["All", "Half-Day", "Day Trip", "Weekend Trip", "Multi Day Trip"];

const durationOptions = [
  { label: "Any duration", value: "any" },
  { label: "Under 1 hour", value: "60" },
  { label: "Under 2 hours", value: "120" },
  { label: "Under 3 hours", value: "180" },
  { label: "Under 4 hours", value: "240" },
];

const imageBySlug: Record<string, string> = {
  waren: "/destinations/waren.jpg",
  "waren-mueritz": "/destinations/waren.jpg",
  potsdam: "/destinations/potsdam.jpg",
  schwerin: "/destinations/schwerin.jpg",
  rostock: "/destinations/rostock.jpg",
  luebbenau: "/destinations/luebbenau.jpg",
  dresden: "/destinations/dresden.jpg",
};

const longDescriptions: Record<string, string> = {
  "waren-mueritz":
    "Waren (Müritz) is one of the most beautiful lake escapes reachable from Berlin by regional train. It sits directly on Lake Müritz, Germany’s largest inland lake, with a charming harbor, relaxed cafés, lakeside promenades, and access to the Müritz National Park. It is ideal for travelers who want fresh air, water views, cycling, swimming, and a slower weekend rhythm without needing a car.",
  waren:
    "Waren (Müritz) is one of the most beautiful lake escapes reachable from Berlin by regional train. It sits directly on Lake Müritz, Germany’s largest inland lake, with a charming harbor, relaxed cafés, lakeside promenades, and access to the Müritz National Park. It is ideal for travelers who want fresh air, water views, cycling, swimming, and a slower weekend rhythm without needing a car.",
  potsdam:
    "Potsdam is the easiest elegant escape from Berlin. It combines palace gardens, lakes, historic streets, cafés, and wide green spaces. It is perfect for a half-day or full-day trip when you want something beautiful, classic, and low-effort.",
  schwerin:
    "Schwerin feels like a fairytale weekend destination. The castle sits between lakes, the old town is calm and walkable, and the city has a slower northern rhythm that makes it feel much farther from Berlin than it actually is.",
  rostock:
    "Rostock gives you northern city energy with access to the Baltic Sea. It works well as a weekend trip for harbor walks, old-town streets, seafood, and continuing onward to Warnemünde for the beach.",
  luebbenau:
    "Lübbenau is the classic Spreewald escape. It is green, quiet, watery, and perfect for boat rides, cycling, forest walks, pickles, and a complete change of atmosphere from Berlin.",
  dresden:
    "Dresden is one of the strongest cultural weekend trips from Berlin. It offers baroque architecture, museums, river views, cafés, and a dramatic old-town setting along the Elbe.",
};

const itineraries: Record<string, string[]> = {
  "waren-mueritz": [
    "Arrive at Waren (Müritz) station and walk toward the harbor.",
    "Have coffee or lunch near the lakeside promenade.",
    "Visit the Müritzeum nature discovery center.",
    "Walk or cycle along Lake Müritz for open water views.",
    "Take a boat ride if the weather is good.",
    "Stay for sunset by the harbor before returning or spending the night.",
  ],
  waren: [
    "Arrive at Waren (Müritz) station and walk toward the harbor.",
    "Have coffee or lunch near the lakeside promenade.",
    "Visit the Müritzeum nature discovery center.",
    "Walk or cycle along Lake Müritz for open water views.",
    "Take a boat ride if the weather is good.",
    "Stay for sunset by the harbor before returning or spending the night.",
  ],
  potsdam: [
    "Arrive at Potsdam Hbf.",
    "Walk toward the Dutch Quarter for cafés and streets.",
    "Visit Sanssouci Park and palace gardens.",
    "Stop by Neues Palais or the Orangery.",
    "End with dinner near the old town before returning to Berlin.",
  ],
  schwerin: [
    "Arrive at Schwerin Hbf.",
    "Walk through the old town toward Schwerin Castle.",
    "Explore the castle gardens and lakeside views.",
    "Have lunch or coffee in the historic center.",
    "Take a lake walk before heading back or staying overnight.",
  ],
  rostock: [
    "Arrive at Rostock Hbf.",
    "Explore the old town and Neuer Markt.",
    "Walk toward the harbor area.",
    "Continue to Warnemünde if you want beach time.",
    "Return to Rostock for dinner or stay overnight.",
  ],
  luebbenau: [
    "Arrive at Lübbenau station.",
    "Walk into the Spreewald old town area.",
    "Take a traditional punt boat ride through the canals.",
    "Try local Spreewald pickles and lunch.",
    "Rent a bike or walk along the waterways.",
  ],
  dresden: [
    "Arrive at Dresden Hbf.",
    "Walk toward the old town and Frauenkirche.",
    "Visit the Zwinger or museum quarter.",
    "Walk along the Elbe riverfront.",
    "Have dinner in the Neustadt or old town before returning.",
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
  const lastRouteStep = destination.route?.[destination.route.length - 1];

  if (lastRouteStep?.to) return lastRouteStep.to;

  if (destination.name === "Potsdam") return "Potsdam Hbf";
  if (destination.name === "Rostock") return "Rostock Hbf";
  if (destination.name === "Dresden") return "Dresden Hbf";
  if (destination.name === "Leipzig") return "Leipzig Hbf";
  if (destination.name === "Schwerin") return "Schwerin Hbf";

  return destination.name;
}

function buildDbUrl(
  destination: DestinationWithOptionalRoute,
  date: string,
  time: string,
  timeMode: string,
) {
  const destinationStation = getBestDestinationStation(destination);
  const hashParams = new URLSearchParams();

  hashParams.set("soid", "O=Berlin Hbf");
  hashParams.set("zoid", `O=${destinationStation}`);
  hashParams.set("so", "Berlin Hbf");
  hashParams.set("zo", destinationStation);
  hashParams.set("hd", `${date}T${time}:00`);
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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tripType, setTripType] = useState("All");
  const [duration, setDuration] = useState("any");
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

      const matchesCategory =
        category === "All" || destination.categories.includes(category);

      const matchesTripType =
        tripType === "All" || destination.tripTypes.includes(tripType);

      const matchesDuration =
        duration === "any" || destination.durationMin <= Number(duration);

      return matchesQuery && matchesCategory && matchesTripType && matchesDuration;
    });
  }, [query, category, tripType, duration]);

  const selectedDestination =
    (destinations.find((destination) => destination.slug === selectedSlug) ??
      filteredDestinations[0] ??
      destinations[0]) as DestinationWithOptionalRoute;

  const routePreview =
    selectedDestination.route && selectedDestination.route.length > 0
      ? selectedDestination.route
      : getFallbackRoute(selectedDestination);

  const dbUrl = buildDbUrl(selectedDestination, travelDate, travelTime, timeMode);

  function handleSearch() {
    if (filteredDestinations[0]) {
      setSelectedSlug(filteredDestinations[0].slug);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#172033]">
      <header className="sticky top-0 z-30 border-b border-[#DDE6F3] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="DeutschScanner" className="h-12 w-auto" />
            <p className="hidden text-sm font-semibold text-[#0B3B82] md:block">
              Discover where your Deutschlandticket can take you.
            </p>
          </div>

          <nav className="flex items-center gap-2 text-sm font-semibold text-[#0B3B82]">
            <button className="rounded-full px-4 py-2 hover:bg-[#F1F5FB]">News</button>
            <button className="rounded-full px-4 py-2 hover:bg-[#F1F5FB]">Destinations</button>
            <button className="rounded-full px-4 py-2 hover:bg-[#F1F5FB]">Contact</button>
            <button className="rounded-full border border-[#DDE6F3] px-4 py-2 hover:bg-[#F1F5FB]">
              Login
            </button>
            <span className="ml-2 rounded-full bg-[#FFF1E3] px-4 py-2 text-[#D96A00]">
              Hello Marianna!
            </span>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="rounded-[2rem] border border-[#DDE6F3] bg-white p-6 shadow-sm">
          <h1 className="text-4xl font-black text-[#0B3B82]">
            Plan your next escape
          </h1>
          <p className="mt-2 text-[#5f6b85]">
            Choose a vibe, travel time, and destination. Then open the route in DB.
          </p>

          <div className="mt-6 grid gap-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Waren, lakes, coast, history..."
              className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none focus:border-[#FF8A1F]"
            />

            <div className="grid gap-3 md:grid-cols-2">
              <select
                value={timeMode}
                onChange={(event) => setTimeMode(event.target.value)}
                className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none focus:border-[#FF8A1F]"
              >
                <option value="depart">Departure time</option>
                <option value="arrive">Arrival time</option>
              </select>

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
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none focus:border-[#FF8A1F]"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={tripType}
                onChange={(event) => setTripType(event.target.value)}
                className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none focus:border-[#FF8A1F]"
              >
                {tripTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="date"
                value={travelDate}
                onChange={(event) => setTravelDate(event.target.value)}
                className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none focus:border-[#FF8A1F]"
              />

              <input
                type="time"
                value={travelTime}
                onChange={(event) => setTravelTime(event.target.value)}
                className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none focus:border-[#FF8A1F]"
              />
            </div>

            <button
              onClick={handleSearch}
              className="rounded-full bg-[#0B3B82] px-6 py-4 font-bold text-white shadow-sm transition hover:bg-[#082D63]"
            >
              Search destinations
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

          <div className="rounded-[2rem] border border-[#DDE6F3] bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <h2 className="text-5xl font-black text-[#0B3B82]">
                  {selectedDestination.name}
                </h2>

                <p className="mt-4 text-[#5f6b85]">
                  {getDestinationDescription(selectedDestination)}
                </p>

                <img
                  src={getDestinationImage(selectedDestination)}
                  alt={selectedDestination.name}
                  className="mt-5 h-64 w-full rounded-3xl object-cover"
                />

                <div className="mt-5 rounded-3xl bg-[#F7FAFD] p-5">
                  <h3 className="text-xl font-black text-[#0B3B82]">
                    Suggested itinerary
                  </h3>

                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[#5f6b85]">
                    {getDestinationItinerary(selectedDestination).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-3xl bg-[#F7FAFD] p-4">
                    <p className="text-xs text-[#5f6b85]">Travel time</p>
                    <p className="font-bold text-[#0B3B82]">
                      {selectedDestination.time}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-[#F7FAFD] p-4">
                    <p className="text-xs text-[#5f6b85]">Date</p>
                    <p className="font-bold text-[#0B3B82]">{travelDate}</p>
                  </div>

                  <div className="rounded-3xl bg-[#F7FAFD] p-4">
                    <p className="text-xs text-[#5f6b85]">Time</p>
                    <p className="font-bold text-[#0B3B82]">{travelTime}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-[#DDE6F3] bg-[#F7FAFD] p-5">
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

                  <a
                    href={dbUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-3 rounded-full border border-[#DDE6F3] bg-white px-5 py-3 text-sm font-semibold text-[#0B3B82]"
                  >
                    <span className="rounded bg-red-600 px-2 py-1 font-black text-white">
                      DB
                    </span>
                    Search timetable on bahn.de
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}