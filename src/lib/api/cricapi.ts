const BASE_URL = "https://api.cricapi.com/v1";
const API_KEY = process.env.CRICAPI_KEY;
export const hasCricApiKey = Boolean(API_KEY);

// ── Request budget: max 100/day on free tier ──────────────────
const DAILY_BUDGET = 95; // keep 5 as safety margin
let requestCount = 0;
let budgetResetTime = Date.now() + 24 * 60 * 60 * 1000;

function checkBudget(): boolean {
  if (Date.now() > budgetResetTime) {
    requestCount = 0;
    budgetResetTime = Date.now() + 24 * 60 * 60 * 1000;
  }
  return requestCount < DAILY_BUDGET;
}

// ── In-memory response cache ──────────────────────────────────
const cache = new Map<string, { data: unknown; expires: number }>();

export async function fetchFromCricAPI(
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
  revalidate = 60
) {
  if (!API_KEY) throw new Error("No CRICAPI_KEY configured");

  const search = new URLSearchParams();
  search.set("apikey", API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  const cacheKey = `${endpoint}?${search.toString()}`;

  // Check in-memory cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expires) {
    return cached.data;
  }

  // Check budget before making request
  if (!checkBudget()) {
    throw new Error("CricAPI daily budget exhausted");
  }

  const response = await fetch(`${BASE_URL}${endpoint}?${search.toString()}`, {
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`CricAPI request failed: ${response.status}`);
  }

  requestCount++;
  const data = await response.json();

  // Check for API-level failures (quota exceeded, blocked, etc.)
  if (data?.status === "failure") {
    throw new Error(`CricAPI: ${data.reason || "request failed"}`);
  }

  // Cache the successful response
  const ttlMs = revalidate * 1000;
  cache.set(cacheKey, { data, expires: Date.now() + ttlMs });

  // Evict old entries periodically
  if (cache.size > 200) {
    const now = Date.now();
    Array.from(cache.entries()).forEach(([key, entry]) => {
      if (now > entry.expires) cache.delete(key);
    });
  }

  return data;
}

/** How many API requests remain in the current budget window */
export function getApiBudgetRemaining() {
  if (Date.now() > budgetResetTime) return DAILY_BUDGET;
  return Math.max(0, DAILY_BUDGET - requestCount);
}

