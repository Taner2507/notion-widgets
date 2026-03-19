import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const spotifyUrl = searchParams.get("url");

  if (!spotifyUrl) {
    return NextResponse.json({ error: "Missing Spotify URL." }, { status: 400 });
  }

  try {
    const oEmbedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`;
    const response = await fetch(oEmbedUrl, {
      headers: {
        Accept: "application/json"
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Spotify metadata request failed." }, { status: 502 });
    }

    const payload = await response.json();

    return NextResponse.json({
      title: payload.title ?? "",
      author: payload.author_name ?? "",
      thumbnailUrl: payload.thumbnail_url ?? "",
      providerName: payload.provider_name ?? "Spotify",
      type: payload.type ?? "rich"
    });
  } catch {
    return NextResponse.json({ error: "Unable to fetch Spotify metadata." }, { status: 500 });
  }
}