import MapWrapper from "@/components/MapWrapper";

const trips = [
  { slug: "schwerin", name: "Schwerin", time: "3h 45m", lat: 53.6355, lng: 11.4012 },
  { slug: "potsdam", name: "Potsdam", time: "35 min", lat: 52.3906, lng: 13.0645 },
  { slug: "lubbenau", name: "Lübbenau", time: "1h 15m", lat: 51.8667, lng: 13.9667 },
  { slug: "rostock", name: "Rostock", time: "2h 40m", lat: 54.0924, lng: 12.0991 },
  { slug: "leipzig", name: "Leipzig", time: "2h 45m", lat: 51.3397, lng: 12.3731 },
  { slug: "dresden", name: "Dresden", time: "3h 10m", lat: 51.0504, lng: 13.7373 },
];

export default function Home() {
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
          <aside className="rounded-[2rem] border border-[#DDE6F3] bg-white p-6 shadow-sm">
            <h1 className="mb-4 text-4xl font-black text-[#0B3B82]">
              Plan your next escape
            </h1>

            <p className="mb-6 text-[#5f6b85]">
              Explore regional train trips from Berlin using the Deutschlandticket.
            </p>

            <div className="space-y-3">
              {trips.map((trip) => (
                <div
                  key={trip.slug}
                  className="rounded-3xl border border-[#DDE6F3] bg-[#F7FAFD] p-4"
                >
                  <div className="flex justify-between">
                    <strong className="text-[#0B3B82]">{trip.name}</strong>
                    <span className="font-medium text-[#FF8A1F]">{trip.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-[#5f6b85]">
                    Regional transport trip from Berlin
                  </p>
                </div>
              ))}
            </div>
          </aside>

          <section className="overflow-hidden rounded-[2rem] border border-[#DDE6F3] bg-white shadow-sm">
            <MapWrapper points={trips} />
          </section>
        </div>
      </section>
    </main>
  );
}