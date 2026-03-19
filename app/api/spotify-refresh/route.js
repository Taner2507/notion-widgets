import { NextResponse } from "next/server";

export async function POST(request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID || process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Missing Spotify client id. Set SPOTIFY_CLIENT_ID or NEXT_PUBLIC_SPOTIFY_CLIENT_ID." },
      { status: 500 }
    );
  }

  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({ error: "Missing refresh token." }, { status: 400 });
    }

    const payload = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: payload.toString(),
      cache: "no-store"
    });

    const body = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: body.error_description || body.error || "Spotify token refresh failed." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      accessToken: body.access_token,
      refreshToken: body.refresh_token || "",
      expiresIn: body.expires_in || 3600,
      scope: body.scope || ""
    });
  } catch {
    return NextResponse.json({ error: "Unexpected Spotify refresh error." }, { status: 500 });
  }
}
