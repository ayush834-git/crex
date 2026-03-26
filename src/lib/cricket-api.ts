import { fetchFromCricAPI, hasCricApiKey } from "@/lib/api/cricapi";

async function apiFetch(endpoint: string, params: Record<string, string | number | undefined>, revalidate: number) {
  try {
    const payload = await fetchFromCricAPI(endpoint, { offset: 0, ...params }, revalidate);
    const data = (payload as { data?: unknown }).data;
    return Array.isArray(data) ? data : data ? [data] : [];
  } catch {
    return [];
  }
}

export const cricketAPI = {
  hasKey: hasCricApiKey,
  liveScores: () => apiFetch("/currentMatches", {}, 30),
  matches: () => apiFetch("/matches", {}, 300),
  playerSearch: (name: string) => apiFetch("/players", { search: name }, 86400),
  playerInfo: (id: string | number) => apiFetch("/players_info", { id }, 86400),
};
