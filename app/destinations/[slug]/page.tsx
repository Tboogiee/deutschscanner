import Link from "next/link";
import { destinations, type TrainRouteStep } from "@/data/destinations";

type DestinationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;

  const destination = destinations.find((item) => item.slug === slug);

  if (!destination) {
    return (
      <main className="min-h-screen bg-[#F7F8FA] p-8 text-[#172033]">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black text-[#0B3B82]">
            Destination not found
          </h1>
          <p className="mt-3 text-[#5f6b85]">
            This destination does not exist yet.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-[#0B3B82] px-5 py-3 font-bold text-white"
          >
            Back to DeutschScanner
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] p-8 text-[#172033]">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-sm">
        <Link href="/" className="font-semibold text-[#FF8A1F]">
          ← Back to DeutschScanner
        </Link>

        <h1 className="mt-6 text-5xl font-black text-[#0B3B82]">
          {destination.name}
        </h1>

        <p className="mt-4 text-lg text-[#5f6b85]">{destination.summary}</p>

        {destination.image && (
          <img
            src={destination.image}
            alt={destination.name}
            className="mt-6 h-72 w-full rounded-3xl object-cover"
          />
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-[#F7FAFD] p-5">
            <p className="text-sm text-[#5f6b85]">Travel time</p>
            <p className="font-bold text-[#0B3B82]">{destination.time}</p>
          </div>

          <div className="rounded-3xl bg-[#F7FAFD] p-5">
            <p className="text-sm text-[#5f6b85]">State</p>
            <p className="font-bold text-[#0B3B82]">{destination.state}</p>
          </div>

          <div className="rounded-3xl bg-[#F7FAFD] p-5">
            <p className="text-sm text-[#5f6b85]">Transfers</p>
            <p className="font-bold text-[#0B3B82]">{destination.transfers}</p>
          </div>
        </div>

        <section className="mt-6 rounded-3xl border border-[#DDE6F3] bg-[#F7FAFD] p-6">
          <h2 className="text-2xl font-bold text-[#0B3B82]">
            Train route preview
          </h2>

          <div className="mt-4 space-y-3">
            {destination.route.map((step, index) => (
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

                  <span className="font-black text-[#0B3B82]">{step.line}</span>

                  <span className="text-sm font-semibold text-[#FF8A1F]">
                    {step.duration}
                  </span>
                </div>

                <p className="mt-2 text-sm text-[#5f6b85]">
                  {step.from} → {step.to}
                </p>

                {step.note && (
                  <p className="mt-1 text-xs text-[#7C879B]">{step.note}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}