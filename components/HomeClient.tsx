"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AccountPanel from "@/components/AccountPanel";
import CommunitySection from "@/components/CommunitySection";
import MapWrapper from "@/components/MapWrapper";
import {
  destinations,
  type Destination,
  type RouteOption,
  type TransitType,
} from "@/data/destinations";
import { getDestinationGuide } from "@/data/destinationGuides";
import { destinationSummary } from "@/data/germanSummaries";
import {
  departureStations,
  destinationDistance,
  stationByName,
} from "@/data/stations";
import { useTravelAccount } from "@/hooks/useTravelAccount";
import { translate, type Language, type TranslationKey } from "@/lib/i18n";

const vibes = [
  { value: "All", label: "all" },
  { value: "Lakes", label: "lakes" },
  { value: "Nature", label: "nature" },
  { value: "City", label: "city" },
  { value: "History", label: "history" },
  { value: "Coast", label: "coast" },
  { value: "Wellness", label: "wellness" },
] as const satisfies ReadonlyArray<{ value: string; label: TranslationKey }>;

const tripTypes = [
  { value: "All trips", label: "allTrips" },
  { value: "Half-Day", label: "halfDay" },
  { value: "Day Trip", label: "dayTrip" },
  { value: "Weekend Trip", label: "weekendTrip" },
  { value: "Multi Day Trip", label: "multiDayTrip" },
] as const satisfies ReadonlyArray<{ value: string; label: TranslationKey }>;

const durationOptions = [
  { label: "anyJourney", value: "any" },
  { label: "under1", value: "60" },
  { label: "under2", value: "120" },
  { label: "under3", value: "180" },
  { label: "under4", value: "240" },
] as const satisfies ReadonlyArray<{ value: string; label: TranslationKey }>;

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
  luckenwalde: "/destinations/luckenwalde.jpg",
  "bad-freienwalde": "/destinations/bad-freienwalde.jpg",
  "fuerstenberg-havel": "/destinations/fuerstenberg-havel.jpg",
  rheinsberg: "/destinations/rheinsberg.jpg",
  neuruppin: "/destinations/neuruppin.jpg",
  magdeburg: "/destinations/magdeburg.jpg",
  torgau: "/destinations/torgau.jpg",
  radebeul: "/destinations/radebeul.jpg",
  meissen: "/destinations/meissen.jpg",
  pirna: "/destinations/pirna.jpg",
  "koenigstein-saechsische-schweiz": "/destinations/koenigstein-saechsische-schweiz.jpg",
  "bad-schandau": "/destinations/bad-schandau.jpg",
  goerlitz: "/destinations/goerlitz.jpg",
  zittau: "/destinations/zittau.jpg",
  erfurt: "/destinations/erfurt.jpg",
  weimar: "/destinations/weimar.jpg",
  eisenach: "/destinations/eisenach.jpg",
  hannover: "/destinations/hannover.jpg",
  celle: "/destinations/celle.jpg",
  goslar: "/destinations/goslar.jpg",
  quedlinburg: "/destinations/quedlinburg.jpg",
  wernigerode: "/destinations/wernigerode.jpg",
  hamburg: "/destinations/hamburg.jpg",
  luebeck: "/destinations/luebeck.jpg",
  kiel: "/destinations/kiel.jpg",
  flensburg: "/destinations/flensburg.jpg",
  westerland: "/destinations/westerland.jpg",
  bremen: "/destinations/bremen.jpg",
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
  const departureStation = stationByName(departure);
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
  const [language, setLanguage] = useState<Language>("en");
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
  const departureStation = useMemo(() => stationByName(departure), [departure]);
  const t = (key: TranslationKey) => translate(language, key);

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
        (duration === "any" ||
          departureStation.city !== "Berlin" ||
          destination.durationMin <= Number(duration))
      );
    }).sort(
      (first, second) =>
        destinationDistance(departureStation, first) -
        destinationDistance(departureStation, second),
    );
  }, [departureStation, duration, query, tripType, vibe]);

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
  const selectedDistance = destinationDistance(departureStation, selectedDestination);
  const berlinOrigin = departureStation.city === "Berlin";

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("deutschscanner-language");
    if (storedLanguage === "de" || storedLanguage === "en") {
      queueMicrotask(() => setLanguage(storedLanguage));
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("deutschscanner-language", language);
  }, [language]);

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
            <Link href="#discover">{t("discover")}</Link>
            <Link href="#journey">{t("routePlanner")}</Link>
            <Link href="#about">{t("howItWorks")}</Link>
          </nav>
          <div className="header-actions">
            <div className="language-toggle" role="group" aria-label="Language / Sprache">
              <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>EN</button>
              <button type="button" className={language === "de" ? "active" : ""} onClick={() => setLanguage("de")} aria-pressed={language === "de"}>DE</button>
            </div>
            <button
              className="saved-pill"
              type="button"
              aria-label={`${favorites.length} saved trips`}
              onClick={() => setAccountOpen(true)}
            >
              <span aria-hidden="true">♥</span> {favorites.length} {t("saved")}
            </button>
            <button
              className={account.user ? "account-pill active" : "account-pill"}
              type="button"
              onClick={() => setAccountOpen(true)}
            >
              <span aria-hidden="true">{account.user ? "✓" : "○"}</span>
              {account.user ? account.displayName || t("passport") : t("account")}
            </button>
          </div>
        </div>
      </header>

      <section id="top" className="page-shell hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><span /> {t("heroEyebrow")}</p>
          <h1>{t("heroTitle")}</h1>
          <p className="hero-lede">
            {t("heroLede")}
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="#discover">{t("explore")} {destinations.length} {t("escapes")} <span>→</span></Link>
            <button className="ghost-button" type="button" onClick={surpriseMe}>
              <span aria-hidden="true">✦</span> {t("surpriseMe")}
            </button>
          </div>
          <div className="trust-row" aria-label="Service highlights">
            <span><strong>{destinations.length}</strong> {t("curatedPlaces")}</span>
            <span><strong>Live</strong> {t("dbConnections")}</span>
            <span><strong>€0</strong> {t("extraFare")}</span>
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
            <p>{t("easyWin")}</p>
            <h2>Potsdam</h2>
            <div><span className="line-badge line-re">RE1</span><span>35 min</span><span>Direct</span></div>
          </div>
          <div className="hero-note"><span>22°</span><small>{t("perfectForGardens")}</small></div>
        </div>
      </section>

      <section id="discover" className="discovery-section">
        <div className="page-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span /> {t("discoverEyebrow")}</p>
              <h2>{t("discoverTitle")}</h2>
            </div>
            <p>{t("discoverLede")}</p>
          </div>

          <div className="vibe-row" role="group" aria-label={t("filterVibe")}>
            {vibes.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setVibe(item.value)}
                className={vibe === item.value ? "vibe-chip active" : "vibe-chip"}
                aria-pressed={vibe === item.value}
              >
                {t(item.label)}
              </button>
            ))}
          </div>

          <div className="filter-bar">
            <label>
              <span>{t("search")}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
              />
            </label>
            <label>
              <span>{t("startStation")}</span>
              <select value={departure} onChange={(event) => setDeparture(event.target.value)}>
                {departureStations.map((station) => <option key={station.name}>{station.name}</option>)}
              </select>
            </label>
            <label>
              <span>{t("tripStyle")}</span>
              <select value={tripType} onChange={(event) => setTripType(event.target.value)}>
                {tripTypes.map((item) => <option key={item.value} value={item.value}>{t(item.label)}</option>)}
              </select>
            </label>
            <label>
              <span>{t("travelTime")}</span>
              <select value={duration} onChange={(event) => setDuration(event.target.value)} disabled={!berlinOrigin}>
                {durationOptions.map((item) => (
                  <option key={item.value} value={item.value}>{t(item.label)}</option>
                ))}
              </select>
            </label>
            <div className="result-count"><strong>{filteredDestinations.length}</strong><span>{t("ideasFound")}</span></div>
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
                      aria-label={`${t("view")} ${destination.name}`}
                    >
                      <Image
                        src={destinationImage(destination)}
                        alt={`${destination.name} travel destination`}
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      />
                      <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="time-chip">{berlinOrigin ? destination.time : `${destinationDistance(departureStation, destination)} km`}</span>
                      {account.visitedSlugs.includes(destination.slug) && (
                        <span className="visited-chip">✓ {t("visited")}</span>
                      )}
                    </button>
                    <button
                      type="button"
                      className={isFavorite ? "favorite-button active" : "favorite-button"}
                      onClick={() => void toggleFavorite(destination.slug)}
                      aria-label={isFavorite ? `${t("removeSaved")}: ${destination.name}` : `${t("save")}: ${destination.name}`}
                      aria-pressed={isFavorite}
                    >
                      {isFavorite ? "♥" : "♡"}
                    </button>
                    <button className="card-copy" type="button" onClick={() => openDestination(destination)}>
                      <span>{destination.state}</span>
                      <h3>{destination.name}</h3>
                      <p>{destinationSummary(destination.slug, destination.summary, language)}</p>
                      <div>
                        <span>{berlinOrigin ? destination.routeOptions[0]?.line ?? "Regional" : "DB live"}</span>
                        <span>{destinationDistance(departureStation, destination)} km {t("away")}</span>
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
              <h3>{t("noMatches")}</h3>
              <p>{t("clearFilters")}</p>
              <button type="button" className="primary-button" onClick={resetFilters}>{t("resetFilters")}</button>
            </div>
          )}
        </div>
      </section>

      <section id="journey" className="journey-section">
        <div className="page-shell">
          <div className="section-heading light-heading">
            <div>
              <p className="eyebrow"><span /> {t("platformEyebrow")}</p>
              <h2>{t("platformTitle")}</h2>
            </div>
            <p>{t("platformLede")}</p>
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
              <div className="map-key"><span /> {t("routePreview")}</div>
            </div>

            <article className="route-panel">
              <div className="route-destination">
                <div>
                  <p>{selectedDestination.state}</p>
                  <h3>{selectedDestination.name}</h3>
                </div>
                <span>{berlinOrigin ? selectedDestination.time : `${selectedDistance} km`}</span>
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
                      <small>{index === 0 ? t("start") : index === selectedRoute.stops.length - 1 ? t("yourEscape") : `${t("stop")} ${index}`}</small>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="departure-controls">
                <label><span>{t("from")}</span><select value={departure} onChange={(event) => setDeparture(event.target.value)}>{departureStations.map((station) => <option key={station.name}>{station.name}</option>)}</select></label>
                <label><span>{t("date")}</span><input type="date" min={todayISO()} value={travelDate} onChange={(event) => updateTravelDate(event.target.value)} /></label>
                <label><span>{t("time")}</span><input type="time" value={travelTime} onChange={(event) => setTravelTime(event.target.value)} /></label>
              </div>

              <a className="db-button" href={dbUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open live Deutsche Bahn results from ${departure} to ${stationName(selectedDestination)}`}>
                <span>DB</span> {t("liveTimes")}: {departure} → {stationName(selectedDestination)} <b>↗</b>
              </a>
              <p className="route-disclaimer">{t("routeDisclaimer")}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="about" className="page-shell about-section">
        <div>
          <p className="eyebrow"><span /> {t("promiseEyebrow")}</p>
          <h2>{t("promiseTitleA")}<br />{t("promiseTitleB")}</h2>
        </div>
        <div className="promise-grid">
          <article><span>01</span><h3>{t("humanCurated")}</h3><p>{t("humanCuratedText")}</p></article>
          <article><span>02</span><h3>{t("ticketAware")}</h3><p>{t("ticketAwareText")}</p></article>
          <article><span>03</span><h3>{t("liveMatters")}</h3><p>{t("liveMattersText")}</p></article>
        </div>
      </section>

      <footer>
        <div className="page-shell footer-inner">
          <div className="footer-brand"><Image src="/logo.png" alt="DeutschScanner" width={156} height={88} /><p>{t("footerTagline")}</p></div>
          <nav className="footer-links" aria-label={t("followDb")}>
            <a href="https://www.instagram.com/deutschebahn/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@deutschebahn" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="https://www.youtube.com/c/DeutscheBahnKonzern" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a className="download-app-button" href="https://www.bahn.de/service/mobile/db-navigator" target="_blank" rel="noopener noreferrer">{t("downloadApp")} ↗</a>
          </nav>
          <p className="footer-disclaimer">{t("footerDisclaimer")}</p>
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
              aria-label={t("closeDetails")}
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
                {favorites.includes(selectedDestination.slug) ? `♥ ${t("savedTrip")}` : `♡ ${t("saveTrip")}`}
              </button>
              <button
                type="button"
                className={account.visitedSlugs.includes(selectedDestination.slug) ? "modal-visit active" : "modal-visit"}
                onClick={() => void toggleVisited(selectedDestination.slug)}
                aria-pressed={account.visitedSlugs.includes(selectedDestination.slug)}
              >
                {account.visitedSlugs.includes(selectedDestination.slug) ? `✓ ${t("visited")}` : `+ ${t("beenHere")}`}
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-intro-grid">
                <div>
                  <p className="modal-kicker">{t("whyWorthIt")}</p>
                  <p className="modal-intro">{placeGuide.intro}</p>
                </div>
                <div className="modal-facts">
                  <article><span>{t("bestFor")}</span><strong>{placeGuide.bestFor}</strong></article>
                  <article><span>{t("idealStay")}</span><strong>{placeGuide.idealStay}</strong></article>
                  <article><span>{t("bestSeason")}</span><strong>{placeGuide.bestSeason}</strong></article>
                  <article><span>{t("distanceFrom")} {departureStation.city}</span><strong>{selectedDistance} km</strong></article>
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
                    <div><strong>{highlight.name}</strong><p>{highlight.detail}</p><small>{t("openMaps")} ↗</small></div>
                  </a>
                ))}
              </div>

              <div className="modal-route-heading">
                <div>
                  <p className="modal-kicker">{t("yourRoute")}</p>
                  <h3>{t("platformToPlace")}</h3>
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
                  <div className="map-key"><span /> {t("routePreview")}</div>
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
                          <small>{index === 0 ? t("start") : index === selectedRoute.stops.length - 1 ? t("yourEscape") : `${t("stop")} ${index}`}</small>
                        </div>
                      </li>
                    ))}
                  </ol>
                </aside>
              </div>

              <div className="modal-planner">
                <div className="modal-tip">
                  <span aria-hidden="true">✦</span>
                  <div><strong>{t("usefulNote")}</strong><p>{placeGuide.localTip}</p></div>
                </div>
                <div className="departure-controls">
                  <label><span>{t("from")}</span><select value={departure} onChange={(event) => setDeparture(event.target.value)}>{departureStations.map((station) => <option key={station.name}>{station.name}</option>)}</select></label>
                  <label><span>{t("date")}</span><input type="date" min={todayISO()} value={travelDate} onChange={(event) => updateTravelDate(event.target.value)} /></label>
                  <label><span>{t("time")}</span><input type="time" value={travelTime} onChange={(event) => setTravelTime(event.target.value)} /></label>
                </div>
                <a className="db-button" href={dbUrl} target="_blank" rel="noopener noreferrer">
                  <span>DB</span> {t("liveTimes")}: {departure} → {stationName(selectedDestination)} <b>↗</b>
                </a>
                <p className="route-disclaimer">{t("routeDisclaimer")}</p>
              </div>

              <div className="modal-explore-heading">
                <div><p className="modal-kicker">{t("dayIdea")}</p><h3>{t("readyPlan")} {selectedDestination.name}</h3></div>
                <a href={activityUrl} target="_blank" rel="noopener noreferrer">{t("exploreNearby")} ↗</a>
              </div>

              <div className="modal-explore-grid">
                <section className="itinerary-panel" aria-labelledby="itinerary-heading">
                  <h4 id="itinerary-heading">{t("simplePlan")}</h4>
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
                  <h4 id="nearby-heading">{t("worthNearby")}</h4>
                  <div>
                    {placeGuide.nearby.map((place) => (
                      <a key={place.name} href={googleMapsSearchUrl(place.mapsQuery)} target="_blank" rel="noopener noreferrer">
                        <span>{t("nearby")}</span><strong>{place.name}</strong><p>{place.detail}</p><small>{t("findMaps")} ↗</small>
                      </a>
                    ))}
                  </div>
                </section>
              </div>

              <div className="food-stay-grid">
                <section className="food-panel">
                  <p className="modal-kicker">{t("eatWell")}</p>
                  <h3>{t("ratingsLunch")}</h3>
                  <p>{t("restaurantText")}</p>
                  <a href={restaurantUrl} target="_blank" rel="noopener noreferrer">{t("restaurants")} <span>↗</span></a>
                </section>

                <section className="stay-panel">
                  <p className="modal-kicker">{t("stayNight")}</p>
                  <h3>{t("getaway")}</h3>
                  <div className="stay-controls">
                    <label><span>{t("checkIn")}</span><input type="date" min={todayISO()} value={stayCheckIn} onChange={(event) => { setStayCheckIn(event.target.value); if (event.target.value >= stayCheckOut) setStayCheckOut(addDaysISO(event.target.value, 1)); }} /></label>
                    <label><span>{t("checkOut")}</span><input type="date" min={addDaysISO(stayCheckIn, 1)} value={stayCheckOut} onChange={(event) => setStayCheckOut(event.target.value)} /></label>
                    <label><span>{t("guests")}</span><select value={stayGuests} onChange={(event) => setStayGuests(event.target.value)}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></label>
                  </div>
                  <a className="stay-button" href={bookingUrl} target="_blank" rel="noopener noreferrer">{t("hotels")} <span>↗</span></a>
                  <small>{t("bookingNote")}</small>
                </section>
              </div>

              <CommunitySection
                destinationSlug={selectedDestination.slug}
                destinationName={selectedDestination.name}
                account={account}
                language={language}
                onRequireAccount={() => {
                  setDetailOpen(false);
                  setAccountOpen(true);
                }}
              />

              <div className="practical-strip">
                <article><span aria-hidden="true">◎</span><div><strong>{t("arrival")}</strong><p>{placeGuide.arrivalTip}</p></div></article>
                <article><span aria-hidden="true">✦</span><div><strong>{t("planningNote")}</strong><p>{placeGuide.localTip}</p></div></article>
              </div>
            </div>
          </section>
        </div>
      )}

      {accountOpen && (
        <AccountPanel
          account={account}
          language={language}
          onClose={() => setAccountOpen(false)}
          onOpenDestination={openDestinationFromAccount}
        />
      )}
    </main>
  );
}
