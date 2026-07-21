"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AccountPanel from "@/components/AccountPanel";
import MapWrapper from "@/components/MapWrapper";
import {
  destinations,
  type Destination,
  type RouteOption,
  type TransitType,
} from "@/data/destinations";
import { getDestinationGuide } from "@/data/destinationGuides";
import { useTravelAccount } from "@/hooks/useTravelAccount";

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

const departureStations = [
  { name: "Berlin Hbf", coordinates: [52.525589, 13.369549] as const },
  { name: "Berlin Ostkreuz", coordinates: [52.503, 13.4694] as const },
  { name: "Berlin Alexanderplatz", coordinates: [52.5219, 13.4132] as const },
  { name: "Berlin Südkreuz", coordinates: [52.475, 13.3653] as const },
  { name: "Berlin Gesundbrunnen", coordinates: [52.5486, 13.3889] as const },
  { name: "Berlin Zoologischer Garten", coordinates: [52.5072, 13.3323] as const },
  { name: "Berlin-Spandau", coordinates: [52.5347, 13.1973] as const },
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
  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localNow.toISOString().slice(0, 10);
}

function addDaysISO(date: string, days: number) {
  const value = new Date(`${date}T12:00:00`);
  value.setDate(value.getDate() + days);
  const localValue = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
  return localValue.toISOString().slice(0, 10);
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

function dbStationIdentity(name: string, coordinates: readonly [number, number]) {
  const [latitude, longitude] = coordinates;
  return `A=1@O=${name}@X=${Math.round(longitude * 1_000_000)}@Y=${Math.round(latitude * 1_000_000)}@U=80@`;
}

function buildDbUrl(
  departure: string,
  destination: Destination,
  date: string,
  time: string,
) {
  const departureStation = departureStations.find((station) => station.name === departure) ?? departureStations[0];
  const destinationStop = destination.routeOptions[0]?.stops.at(-1);
  const destinationStationName = destinationStop?.name ?? destination.name;
  const destinationCoordinates = destinationStop?.coordinates ?? [destination.lat, destination.lng];
  const params = new URLSearchParams({
    sts: "true",
    so: departureStation.name,
    zo: destinationStationName,
    soid: dbStationIdentity(departureStation.name, departureStation.coordinates),
    zoid: dbStationIdentity(destinationStationName, destinationCoordinates),
    sot: "ST",
    zot: "ST",
    hd: `${date}T${time}:00`,
    hza: "D",
    ar: "false",
    s: "true",
    d: "false",
    kl: "2",
  });

  const encodedParams = params.toString().replace(/\+/g, "%20");
  return `https://www.bahn.de/buchung/fahrplan/suche#${encodedParams}`;
}

function googleMapsSearchUrl(query: string) {
  const params = new URLSearchParams({ api: "1", query });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

function buildBookingUrl(
  destination: Destination,
  checkIn: string,
  checkOut: string,
  guests: string,
) {
  const params = new URLSearchParams({
    ss: `${destination.name}, ${destination.state}, Germany`,
    checkin: checkIn,
    checkout: checkOut,
    group_adults: guests,
    no_rooms: "1",
    group_children: "0",
  });

  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}

function stopLabel(route: RouteOption) {
  const intermediateStops = Math.max(route.stops.length - 2, 0);
  return intermediateStops === 1 ? "1 stop on the way" : `${intermediateStops} stops on the way`;
}

export default function HomeClient() {
  const account = useTravelAccount();
  const [query, setQuery] = useState("");
  const [vibe, setVibe] = useState("All");
  const [tripType, setTripType] = useState("All trips");
  const [duration, setDuration] = useState("any");
  const [departure, setDeparture] = useState("Berlin Hbf");
  const [travelDate, setTravelDate] = useState(todayISO());
  const [travelTime, setTravelTime] = useState("09:30");
  const [selectedSlug, setSelectedSlug] = useState("potsdam");
  const [selectedRouteId, setSelectedRouteId] = useState("potsdam-re1");
  const [detailOpen, setDetailOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [stayCheckIn, setStayCheckIn] = useState(todayISO());
  const [stayCheckOut, setStayCheckOut] = useState(addDaysISO(todayISO(), 1));
  const [stayGuests, setStayGuests] = useState("2");
  const favorites = account.favorites;

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
  const placeGuide = getDestinationGuide(selectedDestination.slug);
  const bookingUrl = buildBookingUrl(selectedDestination, stayCheckIn, stayCheckOut, stayGuests);
  const restaurantUrl = googleMapsSearchUrl(`top rated restaurants in ${selectedDestination.name}, Germany`);
  const activityUrl = googleMapsSearchUrl(`things to do in ${selectedDestination.name}, Germany`);

  useEffect(() => {
    if (!detailOpen && !accountOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (accountOpen) setAccountOpen(false);
      else setDetailOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountOpen, detailOpen]);

  function selectDestination(destination: Destination) {
    setSelectedSlug(destination.slug);
    setSelectedRouteId(destination.routeOptions[0]?.id ?? "");
  }

  function openDestination(destination: Destination) {
    selectDestination(destination);
    setDetailOpen(true);
  }

  async function toggleFavorite(slug: string) {
    await account.toggleFavorite(slug);
  }

  async function toggleVisited(slug: string) {
    if (!account.user) {
      setDetailOpen(false);
      setAccountOpen(true);
      return;
    }

    if (account.visitedSlugs.includes(slug)) {
      await account.removeVisit(slug);
    } else {
      await account.saveVisit(slug, todayISO());
    }
  }

  function openDestinationFromAccount(slug: string) {
    const destination = destinations.find((item) => item.slug === slug);
    if (!destination) return;
    setAccountOpen(false);
    openDestination(destination);
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

  function updateTravelDate(value: string) {
    setTravelDate(value);
    setStayCheckIn(value);
    setStayCheckOut(addDaysISO(value, 1));
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
          <div className="header-actions">
            <button
              className="saved-pill"
              type="button"
              aria-label={`${favorites.length} saved trips`}
              onClick={() => setAccountOpen(true)}
            >
              <span aria-hidden="true">♥</span> {favorites.length} saved
            </button>
            <button
              className={account.user ? "account-pill active" : "account-pill"}
              type="button"
              onClick={() => setAccountOpen(true)}
            >
              <span aria-hidden="true">{account.user ? "✓" : "○"}</span>
              {account.user ? account.displayName || "Passport" : "Account"}
            </button>
          </div>
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
                      {account.visitedSlugs.includes(destination.slug) && (
                        <span className="visited-chip">✓ Visited</span>
                      )}
                    </button>
                    <button
                      type="button"
                      className={isFavorite ? "favorite-button active" : "favorite-button"}
                      onClick={() => void toggleFavorite(destination.slug)}
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
                visitedSlugs={account.visitedSlugs}
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
                <label><span>From</span><select value={departure} onChange={(event) => setDeparture(event.target.value)}>{departureStations.map((station) => <option key={station.name}>{station.name}</option>)}</select></label>
                <label><span>Date</span><input type="date" min={todayISO()} value={travelDate} onChange={(event) => updateTravelDate(event.target.value)} /></label>
                <label><span>Time</span><input type="time" value={travelTime} onChange={(event) => setTravelTime(event.target.value)} /></label>
              </div>

              <a className="db-button" href={dbUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open live Deutsche Bahn results from ${departure} to ${stationName(selectedDestination)}`}>
                <span>DB</span> Live times: {departure} → {stationName(selectedDestination)} <b>↗</b>
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
                onClick={() => void toggleFavorite(selectedDestination.slug)}
                aria-pressed={favorites.includes(selectedDestination.slug)}
              >
                {favorites.includes(selectedDestination.slug) ? "♥ Saved" : "♡ Save trip"}
              </button>
              <button
                type="button"
                className={account.visitedSlugs.includes(selectedDestination.slug) ? "modal-visit active" : "modal-visit"}
                onClick={() => void toggleVisited(selectedDestination.slug)}
                aria-pressed={account.visitedSlugs.includes(selectedDestination.slug)}
              >
                {account.visitedSlugs.includes(selectedDestination.slug) ? "✓ Visited" : "+ I’ve been here"}
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
                  <article><span>Best season</span><strong>{placeGuide.bestSeason}</strong></article>
                  <article><span>From Berlin</span><strong>{selectedDestination.time}</strong></article>
                </div>
              </div>

              <div className="modal-highlights">
                {placeGuide.highlights.map((highlight, index) => (
                  <a
                    key={highlight.name}
                    href={googleMapsSearchUrl(highlight.mapsQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><strong>{highlight.name}</strong><p>{highlight.detail}</p><small>Open in Google Maps ↗</small></div>
                  </a>
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
                  <label><span>From</span><select value={departure} onChange={(event) => setDeparture(event.target.value)}>{departureStations.map((station) => <option key={station.name}>{station.name}</option>)}</select></label>
                  <label><span>Date</span><input type="date" min={todayISO()} value={travelDate} onChange={(event) => updateTravelDate(event.target.value)} /></label>
                  <label><span>Time</span><input type="time" value={travelTime} onChange={(event) => setTravelTime(event.target.value)} /></label>
                </div>
                <a className="db-button" href={dbUrl} target="_blank" rel="noopener noreferrer">
                  <span>DB</span> Live times: {departure} → {stationName(selectedDestination)} <b>↗</b>
                </a>
                <p className="route-disclaimer">This is a curated route preview. Confirm live services, platform changes, and ticket validity before travel.</p>
              </div>

              <div className="modal-explore-heading">
                <div><p className="modal-kicker">Turn the idea into a day</p><h3>A ready-made plan for {selectedDestination.name}</h3></div>
                <a href={activityUrl} target="_blank" rel="noopener noreferrer">Explore everything nearby ↗</a>
              </div>

              <div className="modal-explore-grid">
                <section className="itinerary-panel" aria-labelledby="itinerary-heading">
                  <h4 id="itinerary-heading">A simple day plan</h4>
                  <ol>
                    {placeGuide.itinerary.map((stop) => (
                      <li key={`${stop.time}-${stop.title}`}>
                        <span>{stop.time}</span>
                        <div><strong>{stop.title}</strong><p>{stop.detail}</p></div>
                      </li>
                    ))}
                  </ol>
                </section>

                <section className="nearby-panel" aria-labelledby="nearby-heading">
                  <h4 id="nearby-heading">Worth adding nearby</h4>
                  <div>
                    {placeGuide.nearby.map((place) => (
                      <a key={place.name} href={googleMapsSearchUrl(place.mapsQuery)} target="_blank" rel="noopener noreferrer">
                        <span>Nearby</span><strong>{place.name}</strong><p>{place.detail}</p><small>Find on Google Maps ↗</small>
                      </a>
                    ))}
                  </div>
                </section>
              </div>

              <div className="food-stay-grid">
                <section className="food-panel">
                  <p className="modal-kicker">Eat well when you arrive</p>
                  <h3>Let the latest local ratings guide lunch.</h3>
                  <p>Open a live Google Maps search centered on {selectedDestination.name}, then compare ratings, opening hours, and walking distance.</p>
                  <a href={restaurantUrl} target="_blank" rel="noopener noreferrer">Find top-rated restaurants <span>↗</span></a>
                </section>

                <section className="stay-panel">
                  <p className="modal-kicker">Stay the night</p>
                  <h3>Turn the escape into a getaway.</h3>
                  <div className="stay-controls">
                    <label><span>Check in</span><input type="date" min={todayISO()} value={stayCheckIn} onChange={(event) => { setStayCheckIn(event.target.value); if (event.target.value >= stayCheckOut) setStayCheckOut(addDaysISO(event.target.value, 1)); }} /></label>
                    <label><span>Check out</span><input type="date" min={addDaysISO(stayCheckIn, 1)} value={stayCheckOut} onChange={(event) => setStayCheckOut(event.target.value)} /></label>
                    <label><span>Guests</span><select value={stayGuests} onChange={(event) => setStayGuests(event.target.value)}><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option></select></label>
                  </div>
                  <a className="stay-button" href={bookingUrl} target="_blank" rel="noopener noreferrer">See available hotels & hostels <span>↗</span></a>
                  <small>Availability, pricing, and booking are completed securely on Booking.com.</small>
                </section>
              </div>

              <div className="practical-strip">
                <article><span aria-hidden="true">◎</span><div><strong>Arriving and getting around</strong><p>{placeGuide.arrivalTip}</p></div></article>
                <article><span aria-hidden="true">✦</span><div><strong>Local planning note</strong><p>{placeGuide.localTip}</p></div></article>
              </div>
            </div>
          </section>
        </div>
      )}

      {accountOpen && (
        <AccountPanel
          account={account}
          onClose={() => setAccountOpen(false)}
          onOpenDestination={openDestinationFromAccount}
        />
      )}
    </main>
  );
}
