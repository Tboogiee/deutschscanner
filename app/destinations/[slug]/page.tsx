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
    <main className="min-h-screen bg-[#f5efe4] text-[#262626]">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 rounded-full bg-red-600 px-4 py-2 text-center text-sm font-bold text-white">
          MOCKUP V2 — if you see this, the new page.tsx is loading
        </div>

        <header className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="text-6xl font-black tracking-tight">DeutschScanner</h1>
          <p className="mt-3 text-2xl text-[#7b7265]">
            Discover where your Deutschlandticket can take you.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="min-h-[780px] rounded-[2rem] bg-white p-6 shadow-sm">
            {!schwerinOpen ? (
              <>
                <h2 className="mb-6 text-3xl font-bold">Plan your next escape</h2>

                <div className="grid gap-4">
                  <input className="rounded-2xl border border-[#ded3c2] bg-[#fbf7ef] px-4 py-4" defaultValue="Berlin Hbf" placeholder="Where from?" />
                  <input className="rounded-2xl border border-[#ded3c2] bg-[#fbf7ef] px-4 py-4" placeholder="Where to?" />
                  <input className="rounded-2xl border border-[#ded3c2] bg-[#fbf7ef] px-4 py-4" defaultValue="This weekend" placeholder="When?" />
                  <input className="rounded-2xl border border-[#ded3c2] bg-[#fbf7ef] px-4 py-4" defaultValue="4 hours" placeholder="Max travel time" />

                  <select className="rounded-2xl border border-[#ded3c2] bg-[#fbf7ef] px-4 py-4" defaultValue="Lakes">
                    <option>City</option>
                    <option>Architecture</option>
                    <option>Lakes</option>
                    <option>Rivers</option>
                    <option>Hiking</option>
                    <option>History</option>
                  </select>

                  <select className="rounded-2xl border border-[#ded3c2] bg-[#fbf7ef] px-4 py-4" defaultValue="Weekend Trip">
                    <option>Half-Day</option>
                    <option>Day Trip</option>
                    <option>Weekend Trip</option>
                    <option>Multi Day Trip</option>
                  </select>
                </div>

                <button
                  onClick={() => setSelected("schwerin")}
                  className="mt-5 w-full rounded-full bg-[#26382a] px-6 py-4 font-bold text-white"
                >
                  Find regional trips
                </button>

                <div className="mt-8">
                  <h3 className="mb-4 text-2xl font-bold">Trending Trips near you</h3>

                  <div className="space-y-3">
                    {trips.map((trip) => (
                      <button
                        key={trip.slug}
                        onClick={() => setSelected(trip.slug)}
                        className="w-full rounded-3xl bg-[#f3eadc] p-4 text-left hover:bg-[#e7dac8]"
                      >
                        <div className="flex justify-between">
                          <strong>{trip.name}</strong>
                          <span>{trip.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-[#70675a]">
                          Regional transport trip from Berlin
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setSelected(null)}
                  className="mb-5 text-sm font-semibold text-[#627255]"
                >
                  ← Back to filters
                </button>

                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-6xl font-black">Schwerin</h2>
                  <span className="rounded-full bg-[#e6efdf] px-4 py-2 font-semibold text-[#4f6747]">
                    3h 45m
                  </span>
                </div>

                <p className="mt-4 text-[#6b6257]">
                  A lakeside palace city for a calm weekend escape using regional transport.
                </p>

                <div className="mt-6 rounded-3xl bg-[#f3eadc] p-5">
                  <h3 className="mb-4 text-xl font-bold">Regional route preview</h3>

                  <div className="space-y-3">
                    <div className="rounded-2xl bg-white p-4">
                      <div className="flex justify-between font-bold">
                        <span>S1</span>
                        <span>09:12</span>
                      </div>
                      <p className="text-sm text-[#6b6257]">Berlin city rail toward Oranienburg</p>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <div className="flex justify-between font-bold">
                        <span>RE85</span>
                        <span>10:04</span>
                      </div>
                      <p className="text-sm text-[#6b6257]">Regional connection toward Schwerin</p>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <div className="flex justify-between font-bold">
                        <span>Arrival</span>
                        <span>12:57</span>
                      </div>
                      <p className="text-sm text-[#6b6257]">Arrive near Schwerin city center</p>
                    </div>
                  </div>

                  <button className="mt-4 flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold">
                    <span className="rounded bg-red-600 px-2 py-1 font-black text-white">DB</span>
                    Open in DB Navigator
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-[#f3eadc] p-5">
                    <h3 className="mb-3 text-xl font-bold">
                      Things to do — <span className="font-black">LAKES</span>
                    </h3>
                    <ul className="list-inside list-disc space-y-2 text-sm text-[#5f574d]">
                      <li>Walk around Schweriner See</li>
                      <li>Visit Schwerin Castle</li>
                      <li>Picnic in the palace gardens</li>
                      <li>Explore old town cafés</li>
                    </ul>
                  </div>

                  <div className="rounded-3xl bg-[#f3eadc] p-5">
                    <h3 className="mb-3 text-xl font-bold">Itinerary</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>09:12</strong> Leave Berlin</p>
                      <p><strong>12:57</strong> Arrive in Schwerin</p>
                      <p><strong>13:30</strong> Lunch near old town</p>
                      <p><strong>15:00</strong> Castle and lake walk</p>
                      <p><strong>18:30</strong> Dinner or overnight stay</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </aside>

          <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <MockupMap points={trips} onSelect={setSelected} />
          </section>
        </div>
      </section>
    </main>
  );
}