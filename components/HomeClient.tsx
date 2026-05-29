"use client";

import { useMemo, useState } from "react";
import MapWrapper from "@/components/MapWrapper";
import { destinations, type Destination } from "@/data/destinations";

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

export default function HomeClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tripType, setTripType] = useState("All");
  const [duration, setDuration] = useState("any");
  const [selectedSlug, setSelectedSlug] = useState(destinations[0].slug);

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
    destinations.find((destination) => destination.slug === selectedSlug) ??
    filteredDestinations[0] ??
    destinations[0];

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

              {selectedDestination.image && (
                <img
                  src={selectedDestination.image}
                  alt={selectedDestination.name}
                  className="mt-5 h-56 w-full rounded-3xl object-cover"
                />
              )}

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-[#F7FAFD] p-4">
                  <p className="text-sm text-[#5f6b85]">State</p>
                  <p className="font-bold text-[#0B3B82]">
                    {selectedDestination.state}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#F7FAFD] p-4">
                  <p className="text-sm text-[#5f6b85]">Transfers</p>
                  <p className="font-bold text-[#0B3B82]">
                    {selectedDestination.transfers}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#F7FAFD] p-4">
                  <p className="text-sm text-[#5f6b85]">Best for</p>
                  <p className="font-bold text-[#0B3B82]">
                    {selectedDestination.categories.slice(0, 2).join(", ")}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-[#DDE6F3] bg-[#F7FAFD] p-5">
                <h3 className="mb-2 text-xl font-bold text-[#0B3B82]">
                  Route preview
                </h3>
                <p className="text-sm text-[#5f6b85]">
                  {selectedDestination.trainHint}
                </p>

                <a
                  href={`https://www.bahn.de/buchung/start?S=Berlin%20Hbf&Z=${encodeURIComponent(
                    selectedDestination.name,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-3 rounded-full border border-[#DDE6F3] bg-white px-5 py-3 text-sm font-semibold text-[#0B3B82]"
                >
                  <span className="rounded bg-red-600 px-2 py-1 font-black text-white">
                    DB
                  </span>
                  Open in DB Navigator
                </a>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}