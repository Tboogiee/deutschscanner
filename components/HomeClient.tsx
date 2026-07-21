"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MapWrapper from "@/components/MapWrapper";
import {
  destinations,
  type Destination,
  type RouteOption,
  type TransitType,
} from "@/data/destinations";

const vibes = ["All", "Lakes", "Nature", "City", "History", "Coast", "Wellness"];

const tripTypes = [
  "All trips",
  "Half-Day",
  "Day Trip",
  "Weekend Trip",
  "Multi Day Trip",
];

const durationOptions = [
  { label: "Any journey", value: "any" },
  { label: "Under 1 hour", value: "60" },
  { label: "Under 2 hours", value: "120" },
  { label: "Under 3 hours", value: "180" },
  { label: "Under 4 hours", value: "240" },
];

const localImages: Record<string, string> = {
  potsdam: "/destinations/potsdam.jpg",
  oranienburg: "/destinations/oranienburg.jpg",
  "werder-havel": "/destinations/werder.jpg",
  "bad-saarow": "/destinations/bad-saarow.jpg",
  angermuende: "/destinations/angermuende.jpg",
  templin: "/destinations/templin.jpg",
  neustrelitz: "/destinations/neustrelitz.jpg",
  "waren-mueritz": "/destinations/waren.jpg",
  luebbenau: "/destinations/luebbenau.jpg",
  dresden: "/destinations/dresden.jpg",
  rostock: "/destinations/rostock.jpg",
  warnemuende: "/destinations/rostock.jpg",
  schwerin: "/destinations/schwerin.jpg",
};

const categoryFallbacks: Record<string, string> = {
  Coast: "/destinations/rostock.jpg",
  Lakes: "/destinations/waren.jpg",
  Rivers: "/destinations/luebbenau.jpg",
  Nature: "/destinations/angermuende.jpg",
  Architecture: "/destinations/dresden.jpg",
  History: "/destinations/oranienburg.jpg",
  City: "/destinations/potsdam.jpg",
  Wellness: "/destinations/bad-saarow.jpg",
};

function destinationImage(destination: Destination) {
  return (
    localImages[destination.slug] ??
    categoryFallbacks[destination.categories[0]] ??
    "/destinations/potsdam.jpg"
  );
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function lineClass(type: TransitType) {
  const classes: Record<TransitType, string> = {
    S: "line-s",
    U: "line-u",
    RE: "line-re",
    RB: "line-rb",
    Bus: "line-bus",
    Tram: "line-tram",
  };
  return classes[type];
}

function stationName(destination: Destination) {
  const finalStop = destination.routeOptions[0]?.stops.at(-1)?.name;
  return finalStop ?? destination.name;
}

function buildDbUrl(
  departure: string,
  destination: Destination,
  date: string,
  time: string,
) {
  const params = new URLSearchParams({
    sts: "true",
    so: departure,
    zo: stationName(destination),
    sot: "ST",
    zot: "ST",
    hd: `${date}T${time}:00`,
    hza: "D",
    ar: "false",
    s: "true",
    d: "false",
    kl: "2",
  });

  return `https://www.bahn.de/buchung/fahrplan/suche#${params.toString()}`;
}

function stopLabel(route: RouteOption) {
  const intermediateStops = Math.max(route.stops.length - 2, 0);
  return intermediateStops === 1 ? "1 stop on the way" : `${intermediateStops} stops on the way`;
}

type PlaceGuide = {
  intro: string;
  highlights: string[];
  bestFor: string;
  idealStay: string;
  localTip: string;
};

const placeGuides: Record<string, PlaceGuide> = {
  potsdam: {
    intro: "A graceful escape where royal gardens, lakeside paths, and handsome old streets fit naturally into one unhurried day.",
    highlights: ["Walk the gardens around Sanssouci", "Pause for coffee in the Dutch Quarter", "Finish beside the Havel before the train home"],
    bestFor: "Palaces & slow afternoons",
    idealStay: "Full day",
    localTip: "Start with the palace grounds while they are quiet, then work back toward the old town.",
  },
  luebbenau: {
    intro: "The gateway to the Spreewald pairs storybook lanes with waterways, forest shade, and a pace that feels far from the city.",
    highlights: ["Join a traditional punt or rent a kayak", "Follow waterside trails through the biosphere", "Try local Spreewald pickles at the harbor"],
    bestFor: "Waterways & nature",
    idealStay: "Full day",
    localTip: "Reserve a boat trip on warm weekends and leave a little time to explore beyond the harbor.",
  },
  rostock: {
    intro: "A Hanseatic city break with brick-gothic streets, a lively harbor, and the Baltic coast close enough to add sea air to the day.",
    highlights: ["Explore the old town and Neuer Markt", "Walk Rostock's city harbor", "Continue to Warnemünde if time allows"],
    bestFor: "City & seaside",
    idealStay: "Long day or weekend",
    localTip: "For a beach extension, keep enough time for the local connection between Rostock and Warnemünde.",
  },
  schwerin: {
    intro: "A compact lakeside capital centered on one of Germany's most theatrical castles, with gardens and old-town streets made for wandering.",
    highlights: ["Circle Schwerin Castle and its gardens", "Stroll through the old town", "Take a quiet lakeside break before returning"],
    bestFor: "Architecture & lakes",
    idealStay: "Full day",
    localTip: "The castle looks especially striking from the paths across the water—save time for the longer loop.",
  },
  dresden: {
    intro: "Grand riverside architecture, world-class collections, and characterful neighborhoods make Dresden rewarding from morning until evening.",
    highlights: ["Walk the historic center and Brühl's Terrace", "Choose one major museum rather than rushing several", "Cross the Elbe for cafés in Neustadt"],
    bestFor: "Art & architecture",
    idealStay: "Long day or weekend",
    localTip: "Book timed museum entry in advance and build the rest of your route around it.",
  },
  "waren-mueritz": {
    intro: "A relaxed base on Germany's largest inland lake, ideal for open-water views, cycling, and an easy dose of national-park nature.",
    highlights: ["Walk Waren's harbor and old town", "Follow a lakeside cycling or walking route", "Add a Müritz National Park excursion"],
    bestFor: "Lakes & outdoor time",
    idealStay: "Full day or weekend",
    localTip: "Check seasonal boat and bus timetables before choosing the farthest point on your route.",
  },
  "bad-saarow": {
    intro: "A low-effort lake escape where wooded shoreline, spa time, and quiet cafés create an easy reset from Berlin.",
    highlights: ["Walk the Scharmützelsee promenade", "Book a thermal spa session", "Take a gentle forest or lakeside loop"],
    bestFor: "Wellness & water",
    idealStay: "Half or full day",
    localTip: "Reserve spa entry before departure, especially on colder weekends.",
  },
};

function getPlaceGuide(destination: Destination): PlaceGuide {
  return placeGuides[destination.slug] ?? {
    intro: destination.summary,
    highlights: [
      `Explore ${destination.name}'s center and independent cafés.`,
      `Shape the day around ${destination.categories.slice(0, 2).join(" and ").toLowerCase()}.`,
      "Leave room for one unplanned walk before the return train.",
    ],
    bestFor: destination.categories.slice(0, 2).join(" & "),
    idealStay: destination.tripTypes[0] ?? "Day trip",
    localTip: "Check the final regional connection before setting out so the return stays relaxed.",
  };
}

export default function HomeClient() {
  const [query, setQuery] = useState("");
  const [vibe, setVibe] = useState("All");
  const [tripType, setTripType] = useState("All trips");
  const [duration, setDuration] = useState("any");
  const [departure, setDeparture] = useState("Berlin Hbf");
  const [travelDate, setTravelDate] = useState(todayISO());
  const [travelTime, setTravelTime] = useState("09:30");
  const [selectedSlug, setSelectedSlug] = useState("potsdam");
  const [selectedRouteId, setSelectedRouteId] = useState("potsdam-re1");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredDestinations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return destinations.filter((destination) => {
      const searchable = [
        destination.name,
        destination.state,
        destination.summary,
        ...destination.categories,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (vibe === "All" || destination.categories.includes(vibe)) &&
        (tripType === "All trips" || destination.tripTypes.includes(tripType)) &&
        (duration === "any" || destination.durationMin <= Number(duration))
      );
    });
  }, [duration, query, tripType, vibe]);

  const selectedDestination =
    destinations.find((destination) => destination.slug === selectedSlug) ?? destinations[0];

  const selectedRoute =
    selectedDestination.routeOptions.find((route) => route.id === selectedRouteId) ??
    selectedDestination.routeOptions[0];

  const dbUrl = buildDbUrl(departure, selectedDestination, travelDate, travelTime);
  const placeGuide = getPlaceGuide(selectedDestination);

  useEffect(() => {
    if (!detailOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [detailOpen]);

  function selectDestination(destination: Destination) {
    setSelectedSlug(destination.slug);
    setSelectedRouteId(destination.routeOptions[0]?.id ?? "");
  }

  function openDestination(destination: Destination) {
    selectDestination(destination);
    setDetailOpen(true);
  }

  function toggleFavorite(slug: string) {
    setFavorites((current) =>
      current.includes(slug)
        ? current.filter((favorite) => favorite !== slug)
        : [...current, slug],
    );
  }

  function surpriseMe() {
    const pool = filteredDestinations.length > 0 ? filteredDestinations : destinations;
    const currentIndex = pool.findIndex((destination) => destination.slug === selectedSlug);
    const nextDestination = pool[(currentIndex + 5) % pool.length];
    openDestination(nextDestination);
  }

  function resetFilters() {
    setQuery("");
    setVibe("All");
    setTripType("All trips");
    setDuration("any");
  }

  return (
    <main>
      <header className="site-header">
        <div className="page-shell header-inner">
          <Link href="#top" aria-label="DeutschScanner home" className="brand-lockup">
            <Image src="/logo.png" alt="DeutschScanner" width={184} height={104} priority />
          </Link>
          <nav aria-label="Primary navigation" className="main-nav">
            <Link href="#discover">Discover</Link>
            <Link href="#journey">Route planner</Link>
            <Link href="#about">How it works</Link>
          </nav>
          <button className="saved-pill" type="button" aria-label={`${favorites.length} saved trips`}>
            <span aria-hidden="true">♥</span> {favorites.length} saved
          </button>
        </div>
      </header>

      <section id="top" className="page-shell hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Berlin is only the beginning</p>
          <h1>Your next escape is already on your ticket.</h1>
          <p className="hero-lede">
            Curated lakes, palaces, old towns and coastlines—all reachable with regional
            transport and your Deutschlandticket.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="#discover">Explore 22 escapes <span>→</span></Link>
            <button className="ghost-button" type="button" onClick={surpriseMe}>
              <span aria-hidden="true">✦</span> Surprise me
            </button>
          </div>
          <div className="trust-row" aria-label="Service highlights">
            <span><strong>22</strong> curated places</span>
            <span><strong>4h</strong> max from Berlin</span>
            <span><strong>€0</strong> extra train fare*</span>
          </div>
        </div>

        <div className="hero-visual">
          <Image
            src="/destinations/potsdam.jpg"
            alt="Sanssouci Palace in Potsdam"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 52vw"
          />
          <div className="hero-gradient" />
          <div className="hero-caption">
            <p>This weekend&apos;s easy win</p>
            <h2>Potsdam</h2>
            <div><span className="line-badge line-re">RE1</span><span>35 min</span><span>Direct</span></div>
          </div>
          <div className="hero-note"><span>22°</span><small>Perfect for palace gardens</small></div>
        </div>
      </section>

      <section id="discover" className="discovery-section">
        <div className="page-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span /> Find your kind of away</p>
              <h2>What are you in the mood for?</h2>
            </div>
            <p>Choose a feeling, not a station. We&apos;ll handle the shortlist.</p>
          </div>

          <div className="vibe-row" role="group" aria-label="Filter by travel vibe">
            {vibes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setVibe(item)}
                className={vibe === item ? "vibe-chip active" : "vibe-chip"}
                aria-pressed={vibe === item}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="filter-bar">
            <label>
              <span>Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Place, lake, coast…"
              />
            </label>
            <label>
              <span>Trip style</span>
              <select value={tripType} onChange={(event) => setTripType(event.target.value)}>
                {tripTypes.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>Travel time</span>
              <select value={duration} onChange={(event) => setDuration(event.target.value)}>
                {durationOptions.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <div className="result-count"><strong>{filteredDestinations.length}</strong><span>ideas found</span></div>
          </div>

          {filteredDestinations.length > 0 ? (
            <div className="destination-grid">
              {filteredDestinations.map((destination, index) => {
                const isFavorite = favorites.includes(destination.slug);
                const isSelected = destination.slug === selectedDestination.slug;
                return (
                  <article
                    key={destination.slug}
                    className={isSelected ? "destination-card selected" : "destination-card"}
                  >
                    <button
                      className="card-image"
                      type="button"
                      onClick={() => openDestination(destination)}
                      aria-label={`View ${destination.name}`}
                    >
                      <Image
                        src={destinationImage(destination)}
                        alt={`${destination.name} travel destination`}
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      />
                      <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="time-chip">{destination.time}</span>
                    </button>
                    <button
                      type="button"
                      className={isFavorite ? "favorite-button active" : "favorite-button"}
                      onClick={() => toggleFavorite(destination.slug)}
                      aria-label={isFavorite ? `Remove ${destination.name} from saved trips` : `Save ${destination.name}`}
                      aria-pressed={isFavorite}
                    >
                      {isFavorite ? "♥" : "♡"}
                    </button>
                    <button className="card-copy" type="button" onClick={() => openDestination(destination)}>
                      <span>{destination.state}</span>
                      <h3>{destination.name}</h3>
                      <p>{destination.summary}</p>
                      <div>
                        <span>{destination.routeOptions[0]?.line ?? "Regional"}</span>
                        <span>{destination.transfers}</span>
                        <span className="card-arrow">↗</span>
                      </div>
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">◎</span>
              <h3>No escapes match that combination yet.</h3>
              <p>Clear the filters and let the whole region back in.</p>
              <button type="button" className="primary-button" onClick={resetFilters}>Reset filters</button>
            </div>
          )}
        </div>
      </section>

      <section id="journey" className="journey-section">
        <div className="page-shell">
          <div className="section-heading light-heading">
            <div>
              <p className="eyebrow"><span /> From idea to platform</p>
              <h2>See the route before you commit.</h2>
            </div>
            <p>Curated route previews make the choice tangible. DB provides the live timetable.</p>
          </div>

          <div className="journey-grid">
            <div className="map-panel">
              <MapWrapper
                points={filteredDestinations.length ? filteredDestinations : destinations}
                selectedSlug={selectedDestination.slug}
                selectedRoute={selectedRoute}
                onSelect={(slug) => {
                  const destination = destinations.find((item) => item.slug === slug);
                  if (destination) openDestination(destination);
                }}
              />
              <div className="map-key"><span /> Curated route preview</div>
            </div>

            <article className="route-panel">
              <div className="route-destination">
                <div>
                  <p>{selectedDestination.state}</p>
                  <h3>{selectedDestination.name}</h3>
                </div>
                <span>{selectedDestination.time}</span>
              </div>

              <div className="route-options" role="group" aria-label="Choose a route">
                {selectedDestination.routeOptions.map((route) => (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => setSelectedRouteId(route.id)}
                    className={selectedRoute.id === route.id ? "route-choice active" : "route-choice"}
                    aria-pressed={selectedRoute.id === route.id}
                  >
                    <span className={`line-badge ${lineClass(route.type)}`}>{route.line}</span>
                    <span><strong>{route.duration}</strong><small>{route.label}</small></span>
                    <span aria-hidden="true">{selectedRoute.id === route.id ? "●" : "○"}</span>
                  </button>
                ))}
              </div>

              <div className="stop-summary">
                <span>{stopLabel(selectedRoute)}</span>
                <span>{selectedDestination.transfers}</span>
              </div>

              <ol className="stop-list">
                {selectedRoute.stops.map((stop, index) => (
                  <li key={`${stop.name}-${index}`}>
                    <span className={index === 0 || index === selectedRoute.stops.length - 1 ? "stop-dot endpoint" : "stop-dot"} />
                    <div>
                      <strong>{stop.name}</strong>
                      <small>{index === 0 ? "Start" : index === selectedRoute.stops.length - 1 ? "Your escape" : `Stop ${index}`}</small>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="departure-controls">
                <label><span>From</span><input value={departure} onChange={(event) => setDeparture(event.target.value)} /></label>
                <label><span>Date</span><input type="date" value={travelDate} onChange={(event) => setTravelDate(event.target.value)} /></label>
                <label><span>Time</span><input type="time" value={travelTime} onChange={(event) => setTravelTime(event.target.value)} /></label>
              </div>

              <a className="db-button" href={dbUrl} target="_blank" rel="noreferrer">
                <span>DB</span> Check live journey on bahn.de <b>↗</b>
              </a>
              <p className="route-disclaimer">Route previews are curated for inspiration. Always confirm live services before travel.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="about" className="page-shell about-section">
        <div>
          <p className="eyebrow"><span /> The simple promise</p>
          <h2>Less planning.<br />More going.</h2>
        </div>
        <div className="promise-grid">
          <article><span>01</span><h3>Human-curated</h3><p>Every place earns its spot with a clear reason to go—not because an algorithm filled a list.</p></article>
          <article><span>02</span><h3>Ticket-aware</h3><p>Regional-first journeys make the most of the Deutschlandticket you already carry.</p></article>
          <article><span>03</span><h3>Live when it matters</h3><p>Dream here, then open the exact journey on DB to confirm current times and disruptions.</p></article>
        </div>
      </section>

      <footer>
        <div className="page-shell footer-inner">
          <div><Image src="/logo.png" alt="DeutschScanner" width={156} height={88} /><p>Go somewhere worth remembering.</p></div>
          <p>*Regional transport eligibility varies. Check the current Deutschlandticket conditions and live journey details before departure.</p>
        </div>
      </footer>

      {detailOpen && (
        <div
          className="place-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDetailOpen(false);
          }}
        >
          <section
            className="place-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="place-modal-title"
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setDetailOpen(false)}
              aria-label="Close destination details"
              autoFocus
            >
              ×
            </button>

            <div className="modal-hero">
              <Image
                src={destinationImage(selectedDestination)}
                alt={`${selectedDestination.name} landscape`}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 1180px"
              />
              <div className="modal-hero-shade" />
              <div className="modal-hero-copy">
                <p>{selectedDestination.state}</p>
                <h2 id="place-modal-title">{selectedDestination.name}</h2>
                <div>
                  <span className={`line-badge ${lineClass(selectedRoute.type)}`}>{selectedRoute.line}</span>
                  <span>{selectedRoute.duration}</span>
                  <span>{selectedDestination.transfers}</span>
                </div>
              </div>
              <button
                type="button"
                className={favorites.includes(selectedDestination.slug) ? "modal-save active" : "modal-save"}
                onClick={() => toggleFavorite(selectedDestination.slug)}
                aria-pressed={favorites.includes(selectedDestination.slug)}
              >
                {favorites.includes(selectedDestination.slug) ? "♥ Saved" : "♡ Save trip"}
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-intro-grid">
                <div>
                  <p className="modal-kicker">Why it is worth the journey</p>
                  <p className="modal-intro">{placeGuide.intro}</p>
                </div>
                <div className="modal-facts">
                  <article><span>Best for</span><strong>{placeGuide.bestFor}</strong></article>
                  <article><span>Ideal stay</span><strong>{placeGuide.idealStay}</strong></article>
                  <article><span>From Berlin</span><strong>{selectedDestination.time}</strong></article>
                </div>
              </div>

              <div className="modal-highlights">
                {placeGuide.highlights.map((highlight, index) => (
                  <article key={highlight}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{highlight}</p>
                  </article>
                ))}
              </div>

              <div className="modal-route-heading">
                <div>
                  <p className="modal-kicker">Your route</p>
                  <h3>From platform to place</h3>
                </div>
                <p>{stopLabel(selectedRoute)} · {selectedDestination.transfers}</p>
              </div>

              <div className="modal-route-layout">
                <div className="modal-map">
                  <MapWrapper
                    points={[selectedDestination]}
                    selectedSlug={selectedDestination.slug}
                    selectedRoute={selectedRoute}
                    onSelect={() => undefined}
                  />
                  <div className="map-key"><span /> Route preview</div>
                </div>

                <aside className="modal-route-card">
                  <div className="route-options" role="group" aria-label="Choose a route">
                    {selectedDestination.routeOptions.map((route) => (
                      <button
                        key={route.id}
                        type="button"
                        onClick={() => setSelectedRouteId(route.id)}
                        className={selectedRoute.id === route.id ? "route-choice active" : "route-choice"}
                        aria-pressed={selectedRoute.id === route.id}
                      >
                        <span className={`line-badge ${lineClass(route.type)}`}>{route.line}</span>
                        <span><strong>{route.duration}</strong><small>{route.label}</small></span>
                        <span aria-hidden="true">{selectedRoute.id === route.id ? "●" : "○"}</span>
                      </button>
                    ))}
                  </div>

                  <ol className="stop-list modal-stop-list">
                    {selectedRoute.stops.map((stop, index) => (
                      <li key={`${stop.name}-modal-${index}`}>
                        <span className={index === 0 || index === selectedRoute.stops.length - 1 ? "stop-dot endpoint" : "stop-dot"} />
                        <div>
                          <strong>{stop.name}</strong>
                          <small>{index === 0 ? "Start" : index === selectedRoute.stops.length - 1 ? "Your escape" : `Stop ${index}`}</small>
                        </div>
                      </li>
                    ))}
                  </ol>
                </aside>
              </div>

              <div className="modal-planner">
                <div className="modal-tip">
                  <span aria-hidden="true">✦</span>
                  <div><strong>A useful local note</strong><p>{placeGuide.localTip}</p></div>
                </div>
                <div className="departure-controls">
                  <label><span>From</span><input value={departure} onChange={(event) => setDeparture(event.target.value)} /></label>
                  <label><span>Date</span><input type="date" value={travelDate} onChange={(event) => setTravelDate(event.target.value)} /></label>
                  <label><span>Time</span><input type="time" value={travelTime} onChange={(event) => setTravelTime(event.target.value)} /></label>
                </div>
                <a className="db-button" href={dbUrl} target="_blank" rel="noreferrer">
                  <span>DB</span> Check live journey on bahn.de <b>↗</b>
                </a>
                <p className="route-disclaimer">This is a curated route preview. Confirm live services, platform changes, and ticket validity before travel.</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
