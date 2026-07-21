"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  isSupabaseConfigured,
  loadAccount,
  refreshSession,
  restoreSession,
  saveSession,
  setFavorite as persistFavorite,
  setVisit as persistVisit,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  signUp as supabaseSignUp,
  updateProfile,
  type AccountVisit,
  type SupabaseSession,
} from "@/lib/supabase";

const guestFavoritesKey = "deutschscanner-guest-favorites-v1";

type AccountStatus = "loading" | "signed-out" | "authenticated";

function readGuestFavorites() {
  if (typeof window === "undefined") return [] as string[];
  const value = window.localStorage.getItem(guestFavoritesKey);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function saveGuestFavorites(favorites: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(guestFavoritesKey, JSON.stringify(favorites));
}

export function useTravelAccount() {
  const [status, setStatus] = useState<AccountStatus>("loading");
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visits, setVisits] = useState<AccountVisit[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const hydrateAccount = useCallback(async (nextSession: SupabaseSession) => {
    const snapshot = await loadAccount(nextSession);
    const guestFavorites = readGuestFavorites();
    const unsynced = guestFavorites.filter(
      (slug) => !snapshot.favorites.includes(slug),
    );

    if (unsynced.length) {
      await Promise.all(
        unsynced.map((slug) => persistFavorite(nextSession, slug, true)),
      );
      snapshot.favorites = [...snapshot.favorites, ...unsynced];
      window.localStorage.removeItem(guestFavoritesKey);
    }

    setDisplayName(snapshot.displayName);
    setFavorites(snapshot.favorites);
    setVisits(snapshot.visits);
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      const guestFavorites = readGuestFavorites();
      if (!isSupabaseConfigured) {
        if (!active) return;
        setFavorites(guestFavorites);
        setStatus("signed-out");
        return;
      }

      try {
        const restored = await restoreSession();
        if (!active) return;
        if (!restored) {
          setFavorites(guestFavorites);
          setStatus("signed-out");
          return;
        }

        setSession(restored);
        await hydrateAccount(restored);
        if (active) setStatus("authenticated");
      } catch (cause) {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Could not restore your account.");
        setFavorites(guestFavorites);
        setStatus("signed-out");
      }
    }

    void initialize();
    return () => {
      active = false;
    };
  }, [hydrateAccount]);

  useEffect(() => {
    if (!session) return;
    const refreshIn = Math.max(
      session.expires_at * 1000 - Date.now() - 60_000,
      10_000,
    );
    const timer = window.setTimeout(async () => {
      try {
        const refreshed = await refreshSession(session.refresh_token);
        setSession(refreshed);
      } catch {
        saveSession(null);
        setSession(null);
        setStatus("signed-out");
        setMessage("Your session expired. Please sign in again.");
      }
    }, refreshIn);
    return () => window.clearTimeout(timer);
  }, [session]);

  const clearFeedback = useCallback(() => {
    setMessage("");
    setError("");
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      clearFeedback();
      setBusy(true);
      try {
        const nextSession = await supabaseSignIn(email.trim(), password);
        setSession(nextSession);
        await hydrateAccount(nextSession);
        setStatus("authenticated");
        setMessage("Welcome back — your travel passport is ready.");
        return true;
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not sign in.");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [clearFeedback, hydrateAccount],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      clearFeedback();
      setBusy(true);
      try {
        const result = await supabaseSignUp(name.trim(), email.trim(), password);
        if (result.session) {
          setSession(result.session);
          await hydrateAccount(result.session);
          setStatus("authenticated");
          setMessage("Account created — start building your travel passport.");
        } else {
          setMessage("Check your email to confirm your account, then return and sign in.");
        }
        return true;
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not create your account.");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [clearFeedback, hydrateAccount],
  );

  const signOut = useCallback(async () => {
    if (!session) return;
    clearFeedback();
    setBusy(true);
    try {
      await supabaseSignOut(session);
    } catch {
      saveSession(null);
    } finally {
      setSession(null);
      setDisplayName("");
      setFavorites(readGuestFavorites());
      setVisits([]);
      setStatus("signed-out");
      setBusy(false);
      setMessage("You are signed out.");
    }
  }, [clearFeedback, session]);

  const saveDisplayName = useCallback(
    async (name: string) => {
      if (!session || !name.trim()) return false;
      clearFeedback();
      setBusy(true);
      try {
        await updateProfile(session, name.trim());
        setDisplayName(name.trim());
        setMessage("Profile updated.");
        return true;
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not update your profile.");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [clearFeedback, session],
  );

  const toggleFavorite = useCallback(
    async (slug: string) => {
      const favorite = !favorites.includes(slug);
      const previous = favorites;
      const next = favorite
        ? [...favorites, slug]
        : favorites.filter((item) => item !== slug);
      setFavorites(next);
      clearFeedback();

      if (!session) {
        saveGuestFavorites(next);
        setMessage(
          favorite
            ? "Saved on this device. Sign in to keep it everywhere."
            : "Removed from your saved trips.",
        );
        return true;
      }

      try {
        await persistFavorite(session, slug, favorite);
        return true;
      } catch (cause) {
        setFavorites(previous);
        setError(cause instanceof Error ? cause.message : "Could not update saved trips.");
        return false;
      }
    },
    [clearFeedback, favorites, session],
  );

  const saveVisit = useCallback(
    async (slug: string, visitedAt: string, notes = "") => {
      if (!session) {
        setMessage("Sign in to add places to your travel passport.");
        return false;
      }

      const previous = visits;
      const nextVisit = { destinationSlug: slug, visitedAt, notes };
      setVisits([nextVisit, ...visits.filter((visit) => visit.destinationSlug !== slug)]);
      clearFeedback();
      try {
        await persistVisit(session, slug, { visitedAt, notes });
        setMessage("Visit added to your travel passport.");
        return true;
      } catch (cause) {
        setVisits(previous);
        setError(cause instanceof Error ? cause.message : "Could not save this visit.");
        return false;
      }
    },
    [clearFeedback, session, visits],
  );

  const removeVisit = useCallback(
    async (slug: string) => {
      if (!session) return false;
      const previous = visits;
      setVisits(visits.filter((visit) => visit.destinationSlug !== slug));
      clearFeedback();
      try {
        await persistVisit(session, slug, null);
        setMessage("Visit removed from your passport.");
        return true;
      } catch (cause) {
        setVisits(previous);
        setError(cause instanceof Error ? cause.message : "Could not remove this visit.");
        return false;
      }
    },
    [clearFeedback, session, visits],
  );

  const visitedSlugs = useMemo(
    () => visits.map((visit) => visit.destinationSlug),
    [visits],
  );

  return {
    configured: isSupabaseConfigured,
    status,
    session,
    user: session?.user ?? null,
    displayName,
    favorites,
    visits,
    visitedSlugs,
    busy,
    message,
    error,
    clearFeedback,
    signIn,
    signUp,
    signOut,
    saveDisplayName,
    toggleFavorite,
    saveVisit,
    removeVisit,
  };
}

export type TravelAccount = ReturnType<typeof useTravelAccount>;
