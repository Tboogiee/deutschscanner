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

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateForDb(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year.slice(2)}`;
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

  if (lastRouteStep?.to) {
    return lastRouteStep.to;
  }

  return destination.name;
}

function buildDbUrl(
  destination: DestinationWithOptionalRoute,
  date: string,
  time: string,
  timeMode: string,
) {
  const destinationStation = getBestDestinationStation(destination);

  const params = new URLSearchParams();

  params.set("S", "Berlin Hbf");
  params.set("Z", destinationStation);
  params.set("date", formatDateForDb(date));
  params.set("time", time);
  params.set("timesel", timeMode === "arrive" ? "arrive" : "depart");
  params.set("start", "1");

  return `https://reiseauskunft.bahn.de/bin/query.exe/dn?${params.toString()}`;
}

export default function HomeClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tripType, setTripType] = useState("All");
  const [duration, setDuration] = useState("any");
  const [selectedSlug, setSelectedSlug] = useState(destinations[0].slug);

  const [travelDate, setTravelDate] = useState(todayISO());
  const [travelTime, setTravelTime] = useState("09:00");
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

  const routePreview = selectedDestination.route ?? [];

  const dbUrl = buildDbUrl(
    selectedDestination,
    travelDate,
    travelTime,
    timeMode,
  );

  function handleSelect(destination: Destination) {
    setSelectedSlug(destination.slug);
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#172033]">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 rounded-[2rem] border border-[#DDE6F3] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-6">
            <img src="/logo.png" alt="DeutschScanner" className="h-16 w-auto" />
            <div className="h-12 w-px bg-[#E4EAF2]" />
            <div>
              <h1 className="text-3xl font-black text-[#0B3B82]">
                DeutschScanner
              </h1>
              <p className="text-lg font-medium text-[#5f6b85]">
                Discover where your Deutschlandticket can take you.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] border border-[#DDE6F3] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold text-[#0B3B82]">
              Plan your next escape
            </h2>

            <div className="grid gap-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Potsdam, lakes, hiking, coast..."
                className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none transition focus:border-[#FF8A1F]"
              />

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

            <div className="mt-5 rounded-3xl border border-[#DDE6F3] bg-[#F7FAFD] p-4">
              <h3 className="mb-3 font-bold text-[#0B3B82]">
                When do you want to travel?
              </h3>

              <div className="grid gap-3">
                <input
                  type="date"
                  value={travelDate}
                  onChange={(event) => setTravelDate(event.target.value)}
                  className="rounded-2xl border border-[#D8E2F0] bg-white px-4 py-3 outline-none focus:border-[#FF8A1F]"
                />

                <input
                  type="time"
                  value={travelTime}
                  onChange={(event) => setTravelTime(event.target.value)}
                  className="rounded-2xl border border-[#D8E2F0] bg-white px-4 py-3 outline-none focus:border-[#FF8A1F]"
                />

                <select
                  value={timeMode}
                  onChange={(event) => setTimeMode(event.target.value)}
                  className="rounded-2xl border border-[#D8E2F0] bg-white px-4 py-3 outline-none focus:border-[#FF8A1F]"
                >
                  <option value="depart">Depart at this time</option>
                  <option value="arrive">Arrive by this time</option>
                </select>
              </div>
            </div>

            <p className="mt-5 text-sm font-semibold text-[#0B3B82]">
              Showing {filteredDestinations.length} destinations
            </p>

            <div className="mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-2">
              {filteredDestinations.map((destination) => (
                <button
                  key={destination.slug}
                  onClick={() => handleSelect(destination)}
                  className={`w-full rounded-3xl border p-4 text-left transition ${
                    selectedDestination.slug === destination.slug
                      ? "border-[#FF8A1F] bg-[#FFF7EF]"
                      : "border-[#DDE6F3] bg-[#F7FAFD] hover:border-[#FF8A1F]"
                  }`}
                >
                  <div className="flex justify-between gap-3">
                    <strong className="text-[#0B3B82]">{destination.name}</strong>
                    <span className="shrink-0 font-medium text-[#FF8A1F]">
                      {destination.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#5f6b85]">
                    {destination.summary}
                  </p>
                </button>
              ))}
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
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-black text-[#0B3B82]">
                    {selectedDestination.name}
                  </h2>
                  <p className="mt-2 text-[#5f6b85]">
                    {selectedDestination.summary}
                  </p>
                </div>

                <span className="rounded-full bg-[#FFF1E3] px-4 py-2 font-semibold text-[#D96A00]">
                  {selectedDestination.time}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-[#F7FAFD] p-4">
                  <p className="text-sm text-[#5f6b85]">Date</p>
                  <p className="font-bold text-[#0B3B82]">{travelDate}</p>
                </div>

                <div className="rounded-3xl bg-[#F7FAFD] p-4">
                  <p className="text-sm text-[#5f6b85]">Time</p>
                  <p className="font-bold text-[#0B3B82]">{travelTime}</p>
                </div>

                <div className="rounded-3xl bg-[#F7FAFD] p-4">
                  <p className="text-sm text-[#5f6b85]">Search mode</p>
                  <p className="font-bold text-[#0B3B82]">
                    {timeMode === "depart" ? "Depart at" : "Arrive by"}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-[#DDE6F3] bg-[#F7FAFD] p-5">
                <h3 className="mb-4 text-xl font-bold text-[#0B3B82]">
                  Train route preview
                </h3>

                {routePreview.length > 0 ? (
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
                ) : (
                  <p className="text-sm text-[#5f6b85]">
                    Route details will appear here once route steps are added to the
                    destination database.
                  </p>
                )}

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

                <p className="mt-3 text-xs text-[#7C879B]">
                  Opens a DB timetable search from Berlin Hbf to{" "}
                  {getBestDestinationStation(selectedDestination)} on your selected
                  date and time. If DB changes its public URL handling, use the DB
                  form or DB Navigator to confirm the final route.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}