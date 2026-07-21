export type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  user: SupabaseUser;
};

export type AccountSnapshot = {
  displayName: string;
  favorites: string[];
  visits: AccountVisit[];
};

export type AccountVisit = {
  destinationSlug: string;
  visitedAt: string;
  notes: string;
};

export type CommunityReview = {
  id: string;
  destinationSlug: string;
  rating: number;
  body: string;
  authorName: string;
  createdAt: string;
};

export type SharedItinerary = {
  id: string;
  destinationSlug: string;
  title: string;
  summary: string;
  stops: string[];
  authorName: string;
  createdAt: string;
};

export type DestinationCommunity = {
  reviews: CommunityReview[];
  itineraries: SharedItinerary[];
};

type AuthPayload = Partial<SupabaseSession> & {
  user?: SupabaseUser;
  id?: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

type ProfileRow = { display_name: string };
type FavoriteRow = { destination_slug: string };
type VisitRow = {
  destination_slug: string;
  visited_at: string;
  notes: string;
};
type ReviewRow = {
  id: string;
  destination_slug: string;
  rating: number;
  body: string;
  author_name: string;
  created_at: string;
};
type ItineraryRow = {
  id: string;
  destination_slug: string;
  title: string;
  summary: string;
  stops: unknown;
  author_name: string;
  created_at: string;
};

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const sessionStorageKey = "deutschscanner-supabase-session-v1";

export const isSupabaseConfigured = Boolean(projectUrl && publishableKey);

function errorMessage(value: unknown, fallback: string) {
  if (!value || typeof value !== "object") return fallback;
  const record = value as Record<string, unknown>;
  const message =
    record.message ?? record.msg ?? record.error_description ?? record.error;
  return typeof message === "string" && message ? message : fallback;
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}

async function supabaseRequest<T>(
  path: string,
  init: RequestInit = {},
  accessToken?: string,
): Promise<T> {
  if (!projectUrl || !publishableKey) {
    throw new Error("Supabase is not configured for this deployment yet.");
  }

  const headers = new Headers(init.headers);
  headers.set("apikey", publishableKey);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${projectUrl}${path}`, { ...init, headers });
  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new Error(errorMessage(payload, `Supabase request failed (${response.status}).`));
  }

  return payload as T;
}

function normalizeSession(payload: AuthPayload): SupabaseSession | null {
  const user = payload.user ??
    (payload.id
      ? {
          id: payload.id,
          email: payload.email,
          user_metadata: payload.user_metadata,
        }
      : undefined);

  if (
    !payload.access_token ||
    !payload.refresh_token ||
    !payload.expires_in ||
    !user
  ) {
    return null;
  }

  return {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    expires_in: payload.expires_in,
    expires_at:
      payload.expires_at ?? Math.floor(Date.now() / 1000) + payload.expires_in,
    token_type: payload.token_type ?? "bearer",
    user,
  };
}

export function saveSession(session: SupabaseSession | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(sessionStorageKey);
    return;
  }
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));
}

function storedSession() {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(sessionStorageKey);
  if (!value) return null;

  try {
    return JSON.parse(value) as SupabaseSession;
  } catch {
    window.localStorage.removeItem(sessionStorageKey);
    return null;
  }
}

async function getUser(accessToken: string) {
  return supabaseRequest<SupabaseUser>(
    "/auth/v1/user",
    { method: "GET" },
    accessToken,
  );
}

export async function refreshSession(refreshToken: string) {
  const payload = await supabaseRequest<AuthPayload>(
    "/auth/v1/token?grant_type=refresh_token",
    {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    },
  );
  const session = normalizeSession(payload);
  if (!session) throw new Error("Supabase did not return a valid refreshed session.");
  saveSession(session);
  return session;
}

function sessionFromRedirect() {
  if (typeof window === "undefined" || !window.location.hash) return null;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const expiresIn = Number(params.get("expires_in"));

  if (!accessToken || !refreshToken || !expiresIn) return null;
  return { accessToken, refreshToken, expiresIn };
}

export async function restoreSession() {
  if (!isSupabaseConfigured || typeof window === "undefined") return null;

  const redirect = sessionFromRedirect();
  if (redirect) {
    const user = await getUser(redirect.accessToken);
    const session: SupabaseSession = {
      access_token: redirect.accessToken,
      refresh_token: redirect.refreshToken,
      expires_in: redirect.expiresIn,
      expires_at: Math.floor(Date.now() / 1000) + redirect.expiresIn,
      token_type: "bearer",
      user,
    };
    saveSession(session);
    window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
    return session;
  }

  const session = storedSession();
  if (!session) return null;

  try {
    if (session.expires_at <= Math.floor(Date.now() / 1000) + 60) {
      return await refreshSession(session.refresh_token);
    }

    const user = await getUser(session.access_token);
    const verified = { ...session, user };
    saveSession(verified);
    return verified;
  } catch {
    saveSession(null);
    return null;
  }
}

export async function signUp(
  displayName: string,
  email: string,
  password: string,
) {
  const redirectTo = typeof window === "undefined" ? undefined : window.location.origin;
  const query = redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : "";
  const payload = await supabaseRequest<AuthPayload>(`/auth/v1/signup${query}`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      data: { display_name: displayName },
    }),
  });
  const session = normalizeSession(payload);
  if (session) saveSession(session);
  return { session, user: session?.user ?? payload.user ?? payload };
}

export async function signIn(email: string, password: string) {
  const payload = await supabaseRequest<AuthPayload>(
    "/auth/v1/token?grant_type=password",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );
  const session = normalizeSession(payload);
  if (!session) throw new Error("Supabase did not return a valid session.");
  saveSession(session);
  return session;
}

export async function signOut(session: SupabaseSession) {
  try {
    await supabaseRequest<null>(
      "/auth/v1/logout",
      { method: "POST" },
      session.access_token,
    );
  } finally {
    saveSession(null);
  }
}

export async function loadAccount(session: SupabaseSession): Promise<AccountSnapshot> {
  const userId = encodeURIComponent(session.user.id);
  const [profiles, favorites, visits] = await Promise.all([
    supabaseRequest<ProfileRow[]>(
      `/rest/v1/profiles?id=eq.${userId}&select=display_name`,
      { method: "GET" },
      session.access_token,
    ),
    supabaseRequest<FavoriteRow[]>(
      `/rest/v1/favorites?user_id=eq.${userId}&select=destination_slug&order=created_at.desc`,
      { method: "GET" },
      session.access_token,
    ),
    supabaseRequest<VisitRow[]>(
      `/rest/v1/visits?user_id=eq.${userId}&select=destination_slug,visited_at,notes&order=visited_at.desc`,
      { method: "GET" },
      session.access_token,
    ),
  ]);

  const metadataName = session.user.user_metadata?.display_name;
  return {
    displayName:
      profiles[0]?.display_name ||
      (typeof metadataName === "string" ? metadataName : "") ||
      session.user.email?.split("@")[0] ||
      "Traveller",
    favorites: favorites.map((row) => row.destination_slug),
    visits: visits.map((row) => ({
      destinationSlug: row.destination_slug,
      visitedAt: row.visited_at,
      notes: row.notes,
    })),
  };
}

export async function updateProfile(
  session: SupabaseSession,
  displayName: string,
) {
  await supabaseRequest<null>(
    "/rest/v1/profiles?on_conflict=id",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ id: session.user.id, display_name: displayName }),
    },
    session.access_token,
  );
}

export async function setFavorite(
  session: SupabaseSession,
  destinationSlug: string,
  favorite: boolean,
) {
  if (favorite) {
    await supabaseRequest<null>(
      "/rest/v1/favorites?on_conflict=user_id,destination_slug",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          user_id: session.user.id,
          destination_slug: destinationSlug,
        }),
      },
      session.access_token,
    );
    return;
  }

  await supabaseRequest<null>(
    `/rest/v1/favorites?user_id=eq.${encodeURIComponent(session.user.id)}&destination_slug=eq.${encodeURIComponent(destinationSlug)}`,
    { method: "DELETE", headers: { Prefer: "return=minimal" } },
    session.access_token,
  );
}

export async function setVisit(
  session: SupabaseSession,
  destinationSlug: string,
  visit: { visitedAt: string; notes: string } | null,
) {
  if (visit) {
    await supabaseRequest<null>(
      "/rest/v1/visits?on_conflict=user_id,destination_slug",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          user_id: session.user.id,
          destination_slug: destinationSlug,
          visited_at: visit.visitedAt,
          notes: visit.notes,
        }),
      },
      session.access_token,
    );
    return;
  }

  await supabaseRequest<null>(
    `/rest/v1/visits?user_id=eq.${encodeURIComponent(session.user.id)}&destination_slug=eq.${encodeURIComponent(destinationSlug)}`,
    { method: "DELETE", headers: { Prefer: "return=minimal" } },
    session.access_token,
  );
}

export async function loadDestinationCommunity(
  destinationSlug: string,
  session?: SupabaseSession | null,
): Promise<DestinationCommunity> {
  if (!isSupabaseConfigured) return { reviews: [], itineraries: [] };
  const slug = encodeURIComponent(destinationSlug);
  const accessToken = session?.access_token;
  const [reviewRows, itineraryRows] = await Promise.all([
    supabaseRequest<ReviewRow[]>(
      `/rest/v1/reviews?destination_slug=eq.${slug}&select=id,destination_slug,rating,body,author_name,created_at&order=created_at.desc&limit=40`,
      { method: "GET" },
      accessToken,
    ),
    supabaseRequest<ItineraryRow[]>(
      `/rest/v1/shared_itineraries?destination_slug=eq.${slug}&select=id,destination_slug,title,summary,stops,author_name,created_at&order=created_at.desc&limit=30`,
      { method: "GET" },
      accessToken,
    ),
  ]);

  return {
    reviews: reviewRows.map((row) => ({
      id: row.id,
      destinationSlug: row.destination_slug,
      rating: row.rating,
      body: row.body,
      authorName: row.author_name,
      createdAt: row.created_at,
    })),
    itineraries: itineraryRows.map((row) => ({
      id: row.id,
      destinationSlug: row.destination_slug,
      title: row.title,
      summary: row.summary,
      stops: Array.isArray(row.stops)
        ? row.stops.filter((stop): stop is string => typeof stop === "string")
        : [],
      authorName: row.author_name,
      createdAt: row.created_at,
    })),
  };
}

export async function saveReview(
  session: SupabaseSession,
  review: {
    destinationSlug: string;
    rating: number;
    body: string;
    authorName: string;
  },
) {
  await supabaseRequest<null>(
    "/rest/v1/reviews?on_conflict=user_id,destination_slug",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        user_id: session.user.id,
        destination_slug: review.destinationSlug,
        rating: review.rating,
        body: review.body,
        author_name: review.authorName,
        updated_at: new Date().toISOString(),
      }),
    },
    session.access_token,
  );
}

export async function saveSharedItinerary(
  session: SupabaseSession,
  itinerary: {
    destinationSlug: string;
    title: string;
    summary: string;
    stops: string[];
    authorName: string;
  },
) {
  await supabaseRequest<null>(
    "/rest/v1/shared_itineraries",
    {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        user_id: session.user.id,
        destination_slug: itinerary.destinationSlug,
        title: itinerary.title,
        summary: itinerary.summary,
        stops: itinerary.stops,
        author_name: itinerary.authorName,
      }),
    },
    session.access_token,
  );
}
