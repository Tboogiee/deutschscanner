"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const MockupMap = dynamic(() => import("@/components/MockupMap"), {
  ssr: false,
});

const trips = [
  { slug: "schwerin", name: "Schwerin", time: "3h 45m", lat: 53.6355, lng: 11.4012 },
  { slug: "potsdam", name: "Potsdam", time: "35 min", lat: 52.3906, lng: 13.0645 },
  { slug: "lubbenau", name: "Lübbenau", time: "1h 15m", lat: 51.8667, lng: 13.9667 },
  { slug: "rostock", name: "Rostock", time: "2h 40m", lat: 54.0924, lng: 12.0991 },
  { slug: "leipzig", name: "Leipzig", time: "2h 45m", lat: 51.3397, lng: 12.3731 },
  { slug: "dresden", name: "Dresden", time: "3h 10m", lat: 51.0504, lng: 13.7373 },
];

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const schwerinOpen = selected === "schwerin";

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#172033]">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 rounded-[2rem] border border-[#DDE6F3] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-6">
            <img src="/logo.png" alt="DeutschScanner" className="h-16 w-auto" />

            <div className="h-12 w-px bg-[#E4EAF2]" />

            <p className="text-xl font-medium text-[#0B3B82]">
              Discover where your Deutschlandticket can take you.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="min-h-[780px] rounded-[2rem] border border-[#DDE6F3] bg-white p-6 shadow-sm">
            {!schwerinOpen ? (
              <>
                <h2 className="mb-6 text-3xl font-bold text-[#0B3B82]">
                  Plan your next escape
                </h2>

                <div className="grid gap-4">
                  {["Berlin Hbf", "Where to?", "This weekend", "4 hours"].map((value, index) => (
                    <input
                      key={index}
                      className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none transition focus:border-[#FF8A1F]"
                      defaultValue={index === 1 ? "" : value}
                      placeholder={value}
                    />
                  ))}

                  <select className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none focus:border-[#FF8A1F]" defaultValue="Lakes">
                    <option>City</option>
                    <option>Architecture</option>
                    <option>Lakes</option>
                    <option>Rivers</option>
                    <option>Hiking</option>
                    <option>History</option>
                  </select>

                  <select className="rounded-2xl border border-[#D8E2F0] bg-[#F7FAFD] px-4 py-4 outline-none focus:border-[#FF8A1F]" defaultValue="Weekend Trip">
                    <option>Half-Day</option>
                    <option>Day Trip</option>
                    <option>Weekend Trip</option>
                    <option>Multi Day Trip</option>
                  </select>
                </div>

                <button
                  onClick={() => setSelected("schwerin")}
                  className="mt-5 w-full rounded-full bg-[#0B3B82] px-6 py-4 font-bold text-white shadow-sm transition hover:bg-[#082D63]"
                >
                  Find regional trips
                </button>

                <div className="mt-8">
                  <h3 className="mb-4 text-2xl font-bold text-[#0B3B82]">
                    Trending Trips near you
                  </h3>

                  <div className="space-y-3">
                    {trips.map((trip) => (
                      <button
                        key={trip.slug}
                        onClick={() => setSelected(trip.slug)}
                        className="w-full rounded-3xl border border-[#DDE6F3] bg-[#F7FAFD] p-4 text-left transition hover:border-[#FF8A1F] hover:bg-[#FFF7EF]"
                      >
                        <div className="flex justify-between">
                          <strong className="text-[#0B3B82]">{trip.name}</strong>
                          <span className="font-medium text-[#FF8A1F]">{trip.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-[#5f6b85]">
                          Regional transport trip from Berlin
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => setSelected(null)} className="mb-5 text-sm font-semibold text-[#0B3B82]">
                  ← Back to filters
                </button>

                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-6xl font-black text-[#0B3B82]">Schwerin</h2>
                  <span className="rounded-full bg-[#FFF1E3] px-4 py-2 font-semibold text-[#D96A00]">
                    3h 45m
                  </span>
                </div>

                <p className="mt-4 text-[#5f6b85]">
                  A lakeside palace city for a calm weekend escape using regional transport.
                </p>

                <div className="mt-6 rounded-3xl border border-[#DDE6F3] bg-[#F7FAFD] p-5">
                  <h3 className="mb-4 text-xl font-bold text-[#0B3B82]">
                    Regional route preview
                  </h3>

                  <div className="space-y-3">
                    {[
                      ["S1", "09:12", "Berlin city rail toward Oranienburg"],
                      ["RE85", "10:04", "Regional connection toward Schwerin"],
                      ["Arrival", "12:57", "Arrive near Schwerin city center"],
                    ].map(([line, time, text]) => (
                      <div key={line} className="rounded-2xl border border-[#E3EAF3] bg-white p-4">
                        <div className="flex justify-between font-bold">
                          <span className="text-[#0B3B82]">{line}</span>
                          <span className="text-[#FF8A1F]">{time}</span>
                        </div>
                        <p className="text-sm text-[#5f6b85]">{text}</p>
                      </div>
                    ))}
                  </div>

                  <button className="mt-4 flex items-center gap-3 rounded-full border border-[#DDE6F3] bg-white px-5 py-3 text-sm font-semibold">
                    <span className="rounded bg-red-600 px-2 py-1 font-black text-white">DB</span>
                    Open in DB Navigator
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-[#DDE6F3] bg-[#F7FAFD] p-5">
                    <h3 className="mb-3 text-xl font-bold text-[#0B3B82]">
                      Things to do — <span className="text-[#FF8A1F]">LAKES</span>
                    </h3>
                    <ul className="list-inside list-disc space-y-2 text-sm text-[#5f6b85]">
                      <li>Walk around Schweriner See</li>
                      <li>Visit Schwerin Castle</li>
                      <li>Picnic in the palace gardens</li>
                      <li>Explore old town cafés</li>
                    </ul>
                  </div>

                  <div className="rounded-3xl border border-[#DDE6F3] bg-[#F7FAFD] p-5">
                    <h3 className="mb-3 text-xl font-bold text-[#0B3B82]">
                      Itinerary
                    </h3>
                    <div className="space-y-2 text-sm text-[#5f6b85]">
                      <p><strong className="text-[#FF8A1F]">09:12</strong> Leave Berlin</p>
                      <p><strong className="text-[#FF8A1F]">12:57</strong> Arrive in Schwerin</p>
                      <p><strong className="text-[#FF8A1F]">13:30</strong> Lunch near old town</p>
                      <p><strong className="text-[#FF8A1F]">15:00</strong> Castle and lake walk</p>
                      <p><strong className="text-[#FF8A1F]">18:30</strong> Dinner or overnight stay</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </aside>

          <section className="overflow-hidden rounded-[2rem] border border-[#DDE6F3] bg-white shadow-sm">
            <MockupMap points={trips} onSelect={setSelected} />
          </section>
        </div>
      </section>
    </main>
  );
}