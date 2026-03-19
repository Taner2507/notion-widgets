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
    const { code, codeVerifier, redirectUri } = await request.json();

    if (!code || !codeVerifier || !redirectUri) {
      return NextResponse.json({ error: "Missing code, verifier, or redirect URI." }, { status: 400 });
    }

    const payload = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier
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
        { error: body.error_description || body.error || "Spotify token exchange failed." },
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
    return NextResponse.json({ error: "Unexpected Spotify auth error." }, { status: 500 });
  }
}
