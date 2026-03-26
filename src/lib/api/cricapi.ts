const BASE_URL = "https://api.cricapi.com/v1";
const API_KEY = process.env.CRICAPI_KEY;
export const hasCricApiKey = Boolean(API_KEY);

export async function fetchFromCricAPI(
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
  revalidate = 60
) {
  const search = new URLSearchParams();
  if (API_KEY) search.set("apikey", API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  const response = await fetch(`${BASE_URL}${endpoint}?${search.toString()}`, {
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`CricAPI request failed: ${response.status}`);
  }

  return response.json();
}
