"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { TravelAccount } from "@/hooks/useTravelAccount";
import {
  loadDestinationCommunity,
  saveReview,
  saveSharedItinerary,
  type DestinationCommunity,
} from "@/lib/supabase";
import type { Language } from "@/lib/i18n";

type CommunitySectionProps = {
  destinationSlug: string;
  destinationName: string;
  account: TravelAccount;
  language: Language;
  onRequireAccount: () => void;
};

const emptyCommunity: DestinationCommunity = { reviews: [], itineraries: [] };

const copy = {
  en: {
    kicker: "Traveller community",
    title: "Notes from people who went",
    subtitle: "Reviews and shared day plans stay tucked away until you want them.",
    reviews: "Town reviews",
    itineraries: "Shared itineraries",
    noReviews: "No reviews yet. Be the first to leave a useful note.",
    noItineraries: "No shared itineraries yet. Add a route another traveller can follow.",
    yourReview: "Your review",
    reviewPlaceholder: "What was worth the journey? Add one practical tip.",
    publishReview: "Publish review",
    planTitle: "Itinerary title",
    planTitlePlaceholder: "A slow Saturday by the water",
    planSummary: "Short introduction",
    planSummaryPlaceholder: "Who is this plan best for?",
    planStops: "Stops — one per line",
    planStopsPlaceholder: "Old town walk\nMuseum or landmark\nDinner near the station",
    publishPlan: "Share itinerary",
    signIn: "Sign in to contribute",
    saving: "Publishing…",
    loading: "Opening community notes…",
    unavailable: "Community notes are temporarily unavailable.",
    thankReview: "Your review is now part of this destination.",
    thankPlan: "Your itinerary is now visible to other travellers.",
    rating: "rating",
  },
  de: {
    kicker: "Reise-Community",
    title: "Tipps von Menschen, die dort waren",
    subtitle: "Bewertungen und Tagespläne bleiben eingeklappt, bis du sie brauchst.",
    reviews: "Ortsbewertungen",
    itineraries: "Geteilte Reisepläne",
    noReviews: "Noch keine Bewertung. Hinterlasse den ersten hilfreichen Tipp.",
    noItineraries: "Noch kein geteilter Reiseplan. Erstelle eine Route zum Nachreisen.",
    yourReview: "Deine Bewertung",
    reviewPlaceholder: "Was hat sich gelohnt? Ergänze einen praktischen Tipp.",
    publishReview: "Bewertung veröffentlichen",
    planTitle: "Titel des Reiseplans",
    planTitlePlaceholder: "Ein langsamer Samstag am Wasser",
    planSummary: "Kurze Einführung",
    planSummaryPlaceholder: "Für wen eignet sich dieser Plan?",
    planStops: "Stopps – einer pro Zeile",
    planStopsPlaceholder: "Altstadtrundgang\nMuseum oder Wahrzeichen\nAbendessen nahe dem Bahnhof",
    publishPlan: "Reiseplan teilen",
    signIn: "Zum Mitmachen anmelden",
    saving: "Wird veröffentlicht…",
    loading: "Community-Tipps werden geladen…",
    unavailable: "Community-Tipps sind vorübergehend nicht verfügbar.",
    thankReview: "Deine Bewertung gehört jetzt zu diesem Reiseziel.",
    thankPlan: "Dein Reiseplan ist jetzt für andere sichtbar.",
    rating: "Bewertung",
  },
} as const;

export default function CommunitySection({
  destinationSlug,
  destinationName,
  account,
  language,
  onRequireAccount,
}: CommunitySectionProps) {
  const text = copy[language];
  const [community, setCommunity] = useState<DestinationCommunity>(emptyCommunity);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");
  const [planTitle, setPlanTitle] = useState("");
  const [planSummary, setPlanSummary] = useState("");
  const [planStops, setPlanStops] = useState("");

  async function refreshCommunity() {
    setLoading(true);
    setLoadError(false);
    try {
      setCommunity(await loadDestinationCommunity(destinationSlug, account.session));
    } catch {
      setCommunity(emptyCommunity);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void refreshCommunity(), 0);
    // The session token is deliberately omitted; a destination change is the reload boundary.
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationSlug]);

  const averageRating = useMemo(() => {
    if (!community.reviews.length) return null;
    const total = community.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / community.reviews.length).toFixed(1);
  }, [community.reviews]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account.session) {
      onRequireAccount();
      return;
    }

    setBusy(true);
    setFeedback("");
    try {
      await saveReview(account.session, {
        destinationSlug,
        rating,
        body: reviewBody.trim(),
        authorName: account.displayName || "Traveller",
      });
      setReviewBody("");
      setFeedback(text.thankReview);
      await refreshCommunity();
    } catch {
      setFeedback(text.unavailable);
    } finally {
      setBusy(false);
    }
  }

  async function submitItinerary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account.session) {
      onRequireAccount();
      return;
    }

    const stops = planStops
      .split("\n")
      .map((stop) => stop.trim())
      .filter(Boolean);
    if (stops.length < 2) return;

    setBusy(true);
    setFeedback("");
    try {
      await saveSharedItinerary(account.session, {
        destinationSlug,
        title: planTitle.trim(),
        summary: planSummary.trim(),
        stops,
        authorName: account.displayName || "Traveller",
      });
      setPlanTitle("");
      setPlanSummary("");
      setPlanStops("");
      setFeedback(text.thankPlan);
      await refreshCommunity();
    } catch {
      setFeedback(text.unavailable);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="community-section" aria-labelledby="community-heading">
      <header className="community-heading">
        <div>
          <p className="modal-kicker">{text.kicker}</p>
          <h3 id="community-heading">{text.title}</h3>
          <p>{text.subtitle}</p>
        </div>
        <div className="community-score" aria-label={averageRating ? `${averageRating} ${text.rating}` : text.noReviews}>
          <strong>{averageRating ?? "—"}</strong>
          <span>{averageRating ? "★★★★★" : "☆☆☆☆☆"}</span>
        </div>
      </header>

      {loading ? (
        <p className="community-state">{text.loading}</p>
      ) : loadError ? (
        <p className="community-state">{text.unavailable}</p>
      ) : (
        <div className="community-drawers">
          <details>
            <summary>
              <span>{text.reviews}</span>
              <b>{community.reviews.length}</b>
            </summary>
            <div className="community-drawer-body">
              {community.reviews.length ? (
                <div className="review-list">
                  {community.reviews.map((review) => (
                    <article key={review.id}>
                      <div><strong>{review.authorName}</strong><span>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span></div>
                      <p>{review.body}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="community-empty">{text.noReviews}</p>
              )}

              {account.user ? (
                <form className="community-form" onSubmit={submitReview}>
                  <strong>{text.yourReview}</strong>
                  <div className="rating-buttons" role="group" aria-label={text.rating}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={value <= rating ? "active" : ""}
                        onClick={() => setRating(value)}
                        aria-label={`${value} ${text.rating}`}
                        aria-pressed={value === rating}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    required
                    minLength={12}
                    maxLength={800}
                    value={reviewBody}
                    onChange={(event) => setReviewBody(event.target.value)}
                    placeholder={text.reviewPlaceholder}
                  />
                  <button type="submit" disabled={busy}>{busy ? text.saving : text.publishReview}</button>
                </form>
              ) : (
                <button type="button" className="community-sign-in" onClick={onRequireAccount}>{text.signIn}</button>
              )}
            </div>
          </details>

          <details>
            <summary>
              <span>{text.itineraries}</span>
              <b>{community.itineraries.length}</b>
            </summary>
            <div className="community-drawer-body">
              {community.itineraries.length ? (
                <div className="shared-plan-list">
                  {community.itineraries.map((itinerary) => (
                    <article key={itinerary.id}>
                      <span>{itinerary.authorName}</span>
                      <h4>{itinerary.title}</h4>
                      {itinerary.summary && <p>{itinerary.summary}</p>}
                      <ol>{itinerary.stops.map((stop, index) => <li key={`${itinerary.id}-${index}`}>{stop}</li>)}</ol>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="community-empty">{text.noItineraries}</p>
              )}

              {account.user ? (
                <form className="community-form itinerary-form" onSubmit={submitItinerary}>
                  <label><span>{text.planTitle}</span><input required minLength={4} maxLength={90} value={planTitle} onChange={(event) => setPlanTitle(event.target.value)} placeholder={text.planTitlePlaceholder} /></label>
                  <label><span>{text.planSummary}</span><input maxLength={180} value={planSummary} onChange={(event) => setPlanSummary(event.target.value)} placeholder={text.planSummaryPlaceholder} /></label>
                  <label><span>{text.planStops}</span><textarea required minLength={8} maxLength={1200} value={planStops} onChange={(event) => setPlanStops(event.target.value)} placeholder={text.planStopsPlaceholder} /></label>
                  <button type="submit" disabled={busy}>{busy ? text.saving : text.publishPlan}</button>
                </form>
              ) : (
                <button type="button" className="community-sign-in" onClick={onRequireAccount}>{text.signIn}</button>
              )}
            </div>
          </details>
        </div>
      )}

      {feedback && <p className="community-feedback" aria-live="polite">{feedback}</p>}
      <span className="sr-only">{destinationName}</span>
    </section>
  );
}
