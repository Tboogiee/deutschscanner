"use client";

import { useMemo, useState, type FormEvent } from "react";
import RegionProgressMap from "@/components/RegionProgressMap";
import { destinations } from "@/data/destinations";
import type { TravelAccount } from "@/hooks/useTravelAccount";
import type { Language } from "@/lib/i18n";

type AccountPanelProps = {
  account: TravelAccount;
  language: Language;
  onClose: () => void;
  onOpenDestination: (slug: string) => void;
};

function todayISO() {
  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localNow.toISOString().slice(0, 10);
}

function destinationName(slug: string) {
  return destinations.find((destination) => destination.slug === slug)?.name ?? slug;
}

export default function AccountPanel({
  account,
  language,
  onClose,
  onOpenDestination,
}: AccountPanelProps) {
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visitDate, setVisitDate] = useState(todayISO());
  const [visitSlug, setVisitSlug] = useState(destinations[0]?.slug ?? "");
  const [profileName, setProfileName] = useState<string | null>(null);
  const profileNameValue = profileName ?? account.displayName;
  const de = language === "de";

  const stateProgress = useMemo(() => {
    const states = new Map<string, { total: number; visited: number }>();
    destinations.forEach((destination) => {
      const current = states.get(destination.state) ?? { total: 0, visited: 0 };
      current.total += 1;
      if (account.visitedSlugs.includes(destination.slug)) current.visited += 1;
      states.set(destination.state, current);
    });
    return Array.from(states, ([state, progress]) => ({ state, ...progress }));
  }, [account.visitedSlugs]);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const succeeded =
      authMode === "sign-in"
        ? await account.signIn(email, password)
        : await account.signUp(name, email, password);
    if (succeeded) setPassword("");
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const succeeded = await account.saveDisplayName(profileNameValue);
    if (succeeded) setProfileName(null);
  }

  async function submitVisit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await account.saveVisit(visitSlug, visitDate);
  }

  return (
    <div
      className="account-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="account-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-title"
      >
        <button
          type="button"
          className="account-close"
          onClick={onClose}
          aria-label="Close account"
        >
          ×
        </button>

        {account.status === "loading" ? (
          <div className="account-loading">
            <span aria-hidden="true">✦</span>
            <h2 id="account-title">Opening your travel passport…</h2>
          </div>
        ) : account.status === "signed-out" ? (
          <div className="auth-layout">
            <div className="auth-story">
              <p className="modal-kicker">{de ? "Deine Deutschlandticket-Geschichte" : "Your Deutschlandticket story"}</p>
              <h2 id="account-title">{de ? "Speichere die Orte, die zu deinen werden." : "Save the places that become yours."}</h2>
              <p>
                {de
                  ? "Behalte Favoriten auf allen Geräten, sammle deine Ausflüge und sieh zu, wie sich deine Deutschlandkarte füllt."
                  : "Keep favorites across devices, log every escape, and watch your map fill with the parts of Germany you have explored."}
              </p>
              <div className="auth-preview-stats">
                <article><strong>{account.favorites.length}</strong><span>{de ? "auf diesem Gerät gespeichert" : "saved on this device"}</span></article>
                <article><strong>{destinations.length}</strong><span>{de ? "Orte zum Freischalten" : "places ready to unlock"}</span></article>
              </div>
            </div>

            <div className="auth-card">
              <div className="auth-tabs" role="tablist" aria-label="Account access">
                <button
                  type="button"
                  role="tab"
                  aria-selected={authMode === "sign-in"}
                  className={authMode === "sign-in" ? "active" : ""}
                  onClick={() => {
                    account.clearFeedback();
                    setAuthMode("sign-in");
                  }}
                >
                  {de ? "Anmelden" : "Sign in"}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={authMode === "sign-up"}
                  className={authMode === "sign-up" ? "active" : ""}
                  onClick={() => {
                    account.clearFeedback();
                    setAuthMode("sign-up");
                  }}
                >
                  {de ? "Konto erstellen" : "Create account"}
                </button>
              </div>

              {!account.configured ? (
                <div className="account-notice error">
                  Accounts are not available in this build because its Supabase variables
                  are missing. The travel explorer still works normally.
                </div>
              ) : (
                <form className="auth-form" onSubmit={submitAuth}>
                  {authMode === "sign-up" && (
                    <label>
                        <span>{de ? "Name" : "Name"}</span>
                      <input
                        required
                        minLength={2}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder={de ? "Wie dürfen wir dich nennen?" : "How should we call you?"}
                        autoComplete="name"
                      />
                    </label>
                  )}
                  <label>
                    <span>{de ? "E-Mail" : "Email"}</span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </label>
                  <label>
                    <span>{de ? "Passwort" : "Password"}</span>
                    <input
                      required
                      type="password"
                      minLength={8}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    placeholder={de ? "Mindestens 8 Zeichen" : "At least 8 characters"}
                      autoComplete={authMode === "sign-in" ? "current-password" : "new-password"}
                    />
                  </label>
                  <button className="primary-button auth-submit" type="submit" disabled={account.busy}>
                    {account.busy
                      ? "One moment…"
                      : authMode === "sign-in"
                        ? de ? "Meinen Reisepass öffnen" : "Open my passport"
                        : de ? "Meinen Reisepass erstellen" : "Create my passport"}
                  </button>
                </form>
              )}

              {account.message && <div className="account-notice">{account.message}</div>}
              {account.error && <div className="account-notice error">{account.error}</div>}
              <small className="auth-privacy">
                Your account data is protected by Supabase row-level security and belongs
                only to you.
              </small>
            </div>
          </div>
        ) : (
          <div className="passport-layout">
            <header className="passport-header">
              <div>
                <p className="modal-kicker">{de ? "Dein Reisepass" : "Your travel passport"}</p>
                <h2 id="account-title">{de ? "Hallo" : "Hi"}, {account.displayName || (de ? "Reisende:r" : "traveller")}.</h2>
                <p>{account.user?.email}</p>
              </div>
              <button type="button" className="ghost-button" onClick={() => void account.signOut()} disabled={account.busy}>
                {de ? "Abmelden" : "Sign out"}
              </button>
            </header>

            <div className="passport-stats">
              <article><strong>{account.favorites.length}</strong><span>{de ? "Orte gespeichert" : "places saved"}</span></article>
              <article><strong>{account.visits.length}</strong><span>{de ? "Orte besucht" : "places visited"}</span></article>
              <article><strong>{stateProgress.filter((item) => item.visited > 0).length}</strong><span>{de ? "Regionen freigeschaltet" : "regions unlocked"}</span></article>
              <article><strong>{Math.round((account.visits.length / destinations.length) * 100)}%</strong><span>{de ? "Karte erkundet" : "map explored"}</span></article>
            </div>

            {(account.message || account.error) && (
              <div className={account.error ? "account-notice error" : "account-notice"}>
                {account.error || account.message}
              </div>
            )}

            <div className="passport-map-layout">
              <div className="passport-map">
                <RegionProgressMap progress={stateProgress} language={language} />
                <div className="passport-map-key"><span /> {de ? "Von dir freigeschaltete Regionen" : "Regions you have unlocked"}</div>
              </div>
              <aside className="region-passport">
                <p className="modal-kicker">{de ? "Regionen in deiner Sammlung" : "Regions in your collection"}</p>
                <h3>{de ? "Sieh zu, wie die Karte lebendig wird." : "Watch the map wake up."}</h3>
                <div>
                  {stateProgress.map((item) => (
                    <article key={item.state} className={item.visited ? "unlocked" : ""}>
                      <span>{item.visited ? "✓" : "○"}</span>
                      <div><strong>{item.state}</strong><small>{item.visited} {de ? "von" : "of"} {item.total} {de ? "Orten" : "places"}</small></div>
                    </article>
                  ))}
                </div>
              </aside>
            </div>

            <div className="passport-columns">
              <section className="passport-list-section">
                <div className="passport-section-heading">
                  <div><p className="modal-kicker">{de ? "Deine Auswahl" : "Your shortlist"}</p><h3>{de ? "Gespeicherte Orte" : "Saved places"}</h3></div>
                  <span>{account.favorites.length}</span>
                </div>
                {account.favorites.length ? (
                  <div className="passport-list">
                    {account.favorites.map((slug) => (
                      <article key={slug}>
                        <button type="button" onClick={() => onOpenDestination(slug)}>
                          <strong>{destinationName(slug)}</strong><small>{de ? "Reisedetails öffnen" : "Open trip details"} ↗</small>
                        </button>
                        <button type="button" aria-label={`Remove ${destinationName(slug)} from favorites`} onClick={() => void account.toggleFavorite(slug)}>×</button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="passport-empty">{de ? "Tippe bei einem Reiseziel auf das Herz und baue deine Auswahl auf." : "Tap a heart on any destination to build your shortlist."}</p>
                )}
              </section>

              <section className="passport-list-section">
                <div className="passport-section-heading">
                  <div><p className="modal-kicker">{de ? "Deine Erinnerungen" : "Your memories"}</p><h3>{de ? "Besuchte Orte" : "Places visited"}</h3></div>
                  <span>{account.visits.length}</span>
                </div>
                <form className="quick-visit-form" onSubmit={submitVisit}>
                  <select value={visitSlug} onChange={(event) => setVisitSlug(event.target.value)}>
                    {destinations.map((destination) => <option key={destination.slug} value={destination.slug}>{destination.name}</option>)}
                  </select>
                  <input type="date" max={todayISO()} value={visitDate} onChange={(event) => setVisitDate(event.target.value)} />
                  <button type="submit" disabled={account.busy}>{de ? "Besuch hinzufügen" : "Add visit"}</button>
                </form>
                {account.visits.length ? (
                  <div className="passport-list">
                    {account.visits.map((visit) => (
                      <article key={visit.destinationSlug}>
                        <button type="button" onClick={() => onOpenDestination(visit.destinationSlug)}>
                          <strong>{destinationName(visit.destinationSlug)}</strong>
                          <small>{de ? "Besucht am" : "Visited"} {new Intl.DateTimeFormat(de ? "de-DE" : "en-GB", { dateStyle: "medium" }).format(new Date(`${visit.visitedAt}T12:00:00`))}</small>
                        </button>
                        <button type="button" aria-label={`Remove ${destinationName(visit.destinationSlug)} from visited places`} onClick={() => void account.removeVisit(visit.destinationSlug)}>×</button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="passport-empty">{de ? "Dein erster Ausflug schaltet diese Karte frei." : "Your first escape will unlock this map."}</p>
                )}
              </section>
            </div>

            <form className="profile-form" onSubmit={submitProfile}>
              <label><span>{de ? "Anzeigename" : "Display name"}</span><input required minLength={2} value={profileNameValue} onChange={(event) => setProfileName(event.target.value)} /></label>
              <button type="submit" disabled={account.busy || profileNameValue.trim() === account.displayName}>{de ? "Profil speichern" : "Save profile"}</button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
