import "server-only";

function isRemoteUrl(value?: string | null) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

function isUsableWikiImage(value?: string | null) {
  if (!value) return false;
  return !["Silver_", "Placeholder", "No_image", "Replace_this_image"].some((fragment) => value.includes(fragment));
}

export async function resolvePlayerImageUrl({
  espnId,
  name,
  image,
}: {
  espnId?: number | null;
  name: string;
  image?: string | null;
}) {
  if (isRemoteUrl(image)) return image ?? null;

  if (espnId && Number(espnId) > 0) {
    const id = Number(espnId);
    const bucket = Math.floor(id / 1000) * 1000;
    const espnCandidates = [
      `https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_320,q_80/lsci/db/PICTURES/CMS/${bucket}/${id}.png`,
      `https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_320,q_80/lsci/db/PICTURES/CMS/${bucket}/${id}.jpg`,
    ];

    for (const candidate of espnCandidates) {
      try {
        const check = await fetch(candidate, {
          method: "HEAD",
          next: { revalidate: 60 * 60 * 24 * 7 },
        });

        if (check.ok) return candidate;
      } catch {
        // Move to the next provider source.
      }
    }
  }

  try {
    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(`${name} cricketer`)}&format=json&origin=*`,
      {
        headers: { "User-Agent": "CREX-App/1.0" },
        next: { revalidate: 60 * 60 * 24 * 7 },
      }
    );

    const searchPayload = (await searchResponse.json()) as {
      query?: { search?: Array<{ title?: string }> };
    };

    const wikiTitle = searchPayload.query?.search?.[0]?.title ?? name;
    const pageResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&pithumbsize=400&origin=*`,
      {
        headers: { "User-Agent": "CREX-App/1.0" },
        next: { revalidate: 60 * 60 * 24 * 7 },
      }
    );

    const pagePayload = (await pageResponse.json()) as {
      query?: { pages?: Record<string, { thumbnail?: { source?: string } }> };
    };

    const page = Object.values(pagePayload.query?.pages ?? {})[0];
    const thumbnail = page?.thumbnail?.source ?? null;

    return isUsableWikiImage(thumbnail) ? thumbnail : null;
  } catch {
    return null;
  }
}
