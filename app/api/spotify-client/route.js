import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID || process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";

  if (!clientId) {
    return NextResponse.json({ error: "Missing Spotify client id." }, { status: 500 });
  }

  return NextResponse.json({ clientId });
}
