"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { applyThemeVariables, normalizeSpotifyEmbedUrl } from "@/src/lib/widget-utils";

const SPOTIFY_SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-modify-playback-state",
  "user-read-playback-state",
  "user-read-currently-playing",
  "user-library-modify"
].join(" ");

const SPOTIFY_SESSION_KEY = "notion-widget-platform/spotify-session";
const SPOTIFY_PKCE_VERIFIER_KEY = "notion-widget-platform/spotify-pkce-verifier";

export default function WidgetPreview({ type, config, embedMode = false }) {
  const themeStyle = useMemo(() => applyThemeVariables(config), [config]);

  return (
    <section
      className={`widget-card${embedMode ? " is-embed" : ""}`}
      data-layout={config.layout}
      style={themeStyle}
    >
      {type === "clock" ? <ClockWidget config={config} /> : null}
      {type === "countdown" ? <CountdownWidget config={config} /> : null}
      {type === "quote" ? <QuoteWidget config={config} /> : null}
      {type === "spotify" ? <SpotifyWidget config={config} embedMode={embedMode} /> : null}
    </section>
  );
}

function ClockWidget({ config }) {
  const prompts = useMemo(
    () => config.prompts.split("\n").map((prompt) => prompt.trim()).filter(Boolean),
    [config.prompts]
  );
  const [promptIndex, setPromptIndex] = useState(0);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setPromptIndex(0);
  }, [config.prompts]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const hours = now.getHours();
  const displayHour = config.use24Hour ? hours : hours % 12 || 12;
  const timeParts = [pad(displayHour), pad(now.getMinutes())];

  if (config.showSeconds) {
    timeParts.push(pad(now.getSeconds()));
  }

  const dateText = config.showDate
    ? now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
    : "Your local time, live in Notion.";

  return (
    <>
      <div className="widget-header">
        <div>
          <p className="widget-eyebrow">{config.label}</p>
          <h2 className="widget-title">{config.title}</h2>
        </div>
        <span className="tag">Live</span>
      </div>
      <p className="clock-time">
        {timeParts.join(":")}
        {config.use24Hour ? "" : ` ${hours >= 12 ? "PM" : "AM"}`}
      </p>
      <p className="widget-meta">{dateText}</p>
      <div className="widget-divider"></div>
      <div className="prompt-card">
        <p className="widget-eyebrow">Focus Prompt</p>
        <p className="muted-text">{prompts[promptIndex] || "Add prompts in the builder."}</p>
      </div>
      <div className="button-row" style={{ marginTop: 18 }}>
        <button
          className="primary-button"
          type="button"
          onClick={() => setPromptIndex((currentIndex) => (currentIndex + 1) % Math.max(prompts.length, 1))}
        >
          New prompt
        </button>
      </div>
    </>
  );
}

function CountdownWidget({ config }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const targetTime = new Date(config.targetDate).getTime();
  const remaining = Math.max(targetTime - now, 0);
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <>
      <div className="widget-header">
        <div>
          <p className="countdown-eyebrow">{config.label}</p>
          <h2 className="countdown-title">{config.title}</h2>
        </div>
        <span className="tag">Deadline</span>
      </div>
      <p className="widget-meta">
        {remaining === 0 ? config.completionText : `Target: ${new Date(config.targetDate).toLocaleString()}`}
      </p>
      <div className="countdown-grid">
        <div className="countdown-unit">
          <span className="countdown-value">{days}</span>
          <span className="countdown-label-small">Days</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-value">{pad(hours)}</span>
          <span className="countdown-label-small">Hours</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-value">{pad(minutes)}</span>
          <span className="countdown-label-small">Minutes</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-value">{config.showSeconds ? pad(seconds) : "--"}</span>
          <span className="countdown-label-small">Seconds</span>
        </div>
      </div>
    </>
  );
}

function QuoteWidget({ config }) {
  return (
    <>
      <div className="widget-header">
        <div>
          <p className="quote-eyebrow">{config.label}</p>
        </div>
        <span className="tag">Quote</span>
      </div>
      <div className="quote-card">
        <p className="quote-text">{config.quote}</p>
        <p className="widget-meta">{config.author}</p>
      </div>
    </>
  );
}

function SpotifyWidget({ config, embedMode }) {
  const embedUrl = normalizeSpotifyEmbedUrl(config.spotifyUrl);
  const [volume, setVolume] = useState(Number(config.volumeLevel) || 70);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(0);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(Number(config.progressPercent) || 0);
  const [meta, setMeta] = useState(null);
  const [elapsedLabel, setElapsedLabel] = useState(config.elapsedLabel);
  const [durationLabel, setDurationLabel] = useState(config.durationLabel);
  const [spotifyToken, setSpotifyToken] = useState("");
  const [spotifyRefreshToken, setSpotifyRefreshToken] = useState("");
  const [tokenExpiry, setTokenExpiry] = useState(0);
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const [isPlayerConnected, setIsPlayerConnected] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState("");
  const [currentTrackUri, setCurrentTrackUri] = useState("");

  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const authPollIntervalRef = useRef(null);
  const seekDebounceRef = useRef(null);
  const playbackSnapshotRef = useRef({ position: 0, duration: 0, paused: true });
  const shouldAutoPlayRef = useRef(false);
  const lastRequestedSourceRef = useRef("");

  useEffect(() => {
    setVolume(Number(config.volumeLevel) || 70);
  }, [config.volumeLevel]);

  useEffect(() => {
    setProgress(clampNumber(config.progressPercent, 0, 100));
  }, [config.progressPercent]);

  useEffect(() => {
    setElapsedLabel(config.elapsedLabel);
    setDurationLabel(config.durationLabel);
  }, [config.elapsedLabel, config.durationLabel]);

  useEffect(() => {
    if (!config.spotifyUrl) return;
    const ac = new AbortController();
    fetch(`/api/spotify-meta?url=${encodeURIComponent(config.spotifyUrl)}`, { signal: ac.signal })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setMeta(d); })
      .catch(() => {});
    return () => ac.abort();
  }, [config.spotifyUrl]);

  useEffect(() => {
    const stored = readSpotifySession();
    if (stored) {
      setSpotifyToken(stored.accessToken);
      setSpotifyRefreshToken(stored.refreshToken || "");
      setTokenExpiry(stored.expiresAt || 0);
    }

    async function processAuthCallback() {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) return;

      setIsAuthenticating(true);

      const verifier = window.localStorage.getItem(SPOTIFY_PKCE_VERIFIER_KEY);
      if (!verifier) {
        setAuthError("Could not complete Spotify sign-in.");
        setIsAuthenticating(false);
        return;
      }

      try {
        const redirectUri = getSpotifyRedirectUri();
        const response = await fetch("/api/spotify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, codeVerifier: verifier, redirectUri })
        });

        if (!response.ok) {
          throw new Error("Spotify token exchange failed.");
        }

        const payload = await response.json();
        const nextSession = {
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken || "",
          expiresAt: Date.now() + (payload.expiresIn || 3600) * 1000
        };

        writeSpotifySession(nextSession);
        setSpotifyToken(nextSession.accessToken);
        setSpotifyRefreshToken(nextSession.refreshToken);
        setTokenExpiry(nextSession.expiresAt);
        setAuthError("");

        params.delete("spotify_code");
        params.delete("code");
        params.delete("state");
        const nextQuery = params.toString();
        const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
        window.history.replaceState({}, "", nextUrl);
      } catch {
        setAuthError("Spotify sign-in failed.");
      } finally {
        window.localStorage.removeItem(SPOTIFY_PKCE_VERIFIER_KEY);
        setIsAuthenticating(false);
      }
    }

    processAuthCallback();

    return () => {
      window.clearInterval(authPollIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!spotifyToken || !spotifyRefreshToken || !tokenExpiry) return;
    if (Date.now() < tokenExpiry - 60_000) return;

    let cancelled = false;

    async function refreshTokenNow() {
      try {
        const response = await fetch("/api/spotify-refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: spotifyRefreshToken })
        });

        if (!response.ok) {
          throw new Error("Refresh failed");
        }

        const payload = await response.json();
        if (cancelled) return;

        const nextSession = {
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken || spotifyRefreshToken,
          expiresAt: Date.now() + (payload.expiresIn || 3600) * 1000
        };

        writeSpotifySession(nextSession);
        setSpotifyToken(nextSession.accessToken);
        setSpotifyRefreshToken(nextSession.refreshToken);
        setTokenExpiry(nextSession.expiresAt);
      } catch {
        if (cancelled) return;
        setAuthError("Spotify session expired. Connect again.");
        clearSpotifySession();
        setSpotifyToken("");
        setSpotifyRefreshToken("");
        setTokenExpiry(0);
      }
    }

    refreshTokenNow();
    return () => {
      cancelled = true;
    };
  }, [spotifyToken, spotifyRefreshToken, tokenExpiry]);

  useEffect(() => {
    if (!spotifyToken) return;
    if (typeof window === "undefined") return;

    const scriptId = "spotify-web-playback-sdk";
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      setSdkReady(true);
    };

    if (window.Spotify) {
      setSdkReady(true);
    }
  }, [spotifyToken]);

  useEffect(() => {
    if (!sdkReady || !spotifyToken || playerRef.current) return;
    if (typeof window === "undefined" || !window.Spotify) return;

    const player = new window.Spotify.Player({
      name: "Notion Widget Studio",
      getOAuthToken: (callback) => callback(spotifyToken),
      volume: clampNumber(volume, 0, 100) / 100
    });

    player.addListener("ready", async ({ device_id }) => {
      setDeviceId(device_id);
      setIsPlayerConnected(true);
      setAuthError("");
      await transferPlaybackToDevice(spotifyToken, device_id);

      if (shouldAutoPlayRef.current) {
        shouldAutoPlayRef.current = false;
        await startPlaybackFromConfig(device_id);
      }
    });

    player.addListener("not_ready", () => {
      setIsPlayerConnected(false);
    });

    player.addListener("player_state_changed", (state) => {
      if (!state) return;

      const track = state.track_window?.current_track;
      const nextDuration = state.duration || track?.duration_ms || 0;
      const nextPosition = state.position || 0;

      playbackSnapshotRef.current = {
        position: nextPosition,
        duration: nextDuration,
        paused: state.paused
      };

      setPlaying(!state.paused);
      setProgress(nextDuration ? (nextPosition / nextDuration) * 100 : 0);
      setElapsedLabel(formatMs(nextPosition));
      setDurationLabel(formatMs(nextDuration));

      if (track) {
        const artwork = track.album?.images?.[0]?.url || track.album?.images?.[1]?.url || "";
        setMeta((currentMeta) => ({
          title: track.name || currentMeta?.title || "",
          author: track.artists?.map((artistEntry) => artistEntry.name).join(", ") || currentMeta?.author || "",
          thumbnailUrl: artwork || currentMeta?.thumbnailUrl || ""
        }));
        setCurrentTrackId(track.id || "");
        setCurrentTrackUri(track.uri || "");
      }
    });

    player.connect().then((connected) => {
      setIsPlayerConnected(Boolean(connected));
    });

    playerRef.current = player;

    return () => {
      player.disconnect();
      playerRef.current = null;
      setIsPlayerConnected(false);
    };
  }, [sdkReady, spotifyToken, volume]);

  useEffect(() => {
    if (!playerRef.current) return;
    const effectiveVolume = muted ? 0 : volume;
    playerRef.current.setVolume(clampNumber(effectiveVolume, 0, 100) / 100).catch(() => {});
  }, [volume, muted]);

  useEffect(() => {
    window.clearInterval(progressIntervalRef.current);

    if (!playing) {
      return () => window.clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = window.setInterval(() => {
      const snapshot = playbackSnapshotRef.current;
      if (snapshot.paused || !snapshot.duration) return;

      const nextPosition = Math.min(snapshot.position + 1000, snapshot.duration);
      playbackSnapshotRef.current = {
        ...snapshot,
        position: nextPosition
      };

      setProgress((nextPosition / snapshot.duration) * 100);
      setElapsedLabel(formatMs(nextPosition));
    }, 1000);

    return () => window.clearInterval(progressIntervalRef.current);
  }, [playing]);

  useEffect(() => {
    return () => {
      window.clearTimeout(seekDebounceRef.current);
    };
  }, []);

  async function ensureSpotifyToken() {
    if (!spotifyToken) {
      throw new Error("No Spotify token");
    }

    if (tokenExpiry && Date.now() >= tokenExpiry - 30_000 && spotifyRefreshToken) {
      const response = await fetch("/api/spotify-refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: spotifyRefreshToken })
      });

      if (response.ok) {
        const payload = await response.json();
        const nextSession = {
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken || spotifyRefreshToken,
          expiresAt: Date.now() + (payload.expiresIn || 3600) * 1000
        };
        writeSpotifySession(nextSession);
        setSpotifyToken(nextSession.accessToken);
        setSpotifyRefreshToken(nextSession.refreshToken);
        setTokenExpiry(nextSession.expiresAt);
        return nextSession.accessToken;
      }
    }

    return spotifyToken;
  }

  async function spotifyRequest(path, options = {}) {
    const activeToken = await ensureSpotifyToken();

    const response = await fetch(`https://api.spotify.com/v1${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeToken}`,
        ...(options.headers || {})
      }
    });

    if (response.status === 401) {
      setAuthError("Spotify session expired. Connect again.");
      clearSpotifySession();
      setSpotifyToken("");
      throw new Error("Unauthorized");
    }

    return response;
  }

  async function connectSpotify() {
    try {
      if (isAuthenticating) {
        return;
      }

      setAuthError("");

      if (spotifyToken) {
        shouldAutoPlayRef.current = true;
        setAuthError("Connecting Spotify player...");
        return;
      }

      const clientId = await resolveSpotifyClientId();
      if (!clientId) {
        setAuthError("Set SPOTIFY_CLIENT_ID in Vercel env vars first.");
        return;
      }

      if (typeof window === "undefined") return;

      const verifier = createPkceVerifier();
      const challenge = await createPkceChallenge(verifier);
      const redirectUri = getSpotifyRedirectUri();
      setIsAuthenticating(true);

      window.localStorage.setItem(SPOTIFY_PKCE_VERIFIER_KEY, verifier);

      const authParams = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: SPOTIFY_SCOPES,
        redirect_uri: redirectUri,
        code_challenge_method: "S256",
        code_challenge: challenge
      });

      const authUrl = `https://accounts.spotify.com/authorize?${authParams.toString()}`;
      const authWindow = window.open(authUrl, "_blank", "noopener,noreferrer");

      if (!authWindow) {
        window.location.href = authUrl;
        return;
      }

      setAuthError("Complete Spotify sign-in in the opened tab, then return here.");
      window.clearInterval(authPollIntervalRef.current);
      authPollIntervalRef.current = window.setInterval(() => {
        const nextSession = readSpotifySession();
        if (!nextSession?.accessToken) return;

        setSpotifyToken(nextSession.accessToken);
        setSpotifyRefreshToken(nextSession.refreshToken || "");
        setTokenExpiry(nextSession.expiresAt || 0);
        shouldAutoPlayRef.current = true;
        setAuthError("");
        setIsAuthenticating(false);
        window.clearInterval(authPollIntervalRef.current);
      }, 1000);

      window.setTimeout(() => {
        window.clearInterval(authPollIntervalRef.current);
        setIsAuthenticating(false);
      }, 120000);
    } catch {
      setAuthError("Could not start Spotify sign-in.");
      setIsAuthenticating(false);
    }
  }

  async function startPlaybackFromConfig(targetDeviceId = deviceId) {
    const source = spotifyUrlToUri(config.spotifyUrl);
    if (!source?.uri || !targetDeviceId) return false;

    const playbackPayload = buildInitialPlaybackPayload(source);
    const requestPath = `/me/player/play?device_id=${encodeURIComponent(targetDeviceId)}`;

    for (let attempt = 0; attempt < 4; attempt += 1) {
      try {
        await spotifyRequest(requestPath, {
          method: "PUT",
          body: JSON.stringify(playbackPayload)
        });
        lastRequestedSourceRef.current = source.uri;
        setAuthError("");
        return true;
      } catch {
        await wait(350 * (attempt + 1));
      }
    }

    setAuthError("Playback could not start yet. Try again in a second.");
    return false;
  }

  async function togglePlayback() {
    if (!spotifyToken) {
      await connectSpotify();
      return;
    }

    if (!playerRef.current || !isPlayerConnected || !deviceId) {
      shouldAutoPlayRef.current = true;
      setAuthError("Spotify player is still connecting...");
      return;
    }

    try {
      const source = spotifyUrlToUri(config.spotifyUrl);
      const hasTrack = Boolean(currentTrackUri || currentTrackId);
      const sourceChanged = Boolean(source?.uri) && source.uri !== lastRequestedSourceRef.current;

      if ((!hasTrack && source?.uri) || sourceChanged) {
        await startPlaybackFromConfig();
        return;
      }

      await playerRef.current.togglePlay();
    } catch {
      setAuthError("Playback command failed. Make sure you have Spotify Premium.");
    }
  }

  async function playNext() {
    if (!spotifyToken || !deviceId) return;
    try {
      await spotifyRequest(`/me/player/next?device_id=${encodeURIComponent(deviceId)}`, { method: "POST" });
    } catch {
      setAuthError("Could not skip track.");
    }
  }

  async function playPrevious() {
    if (!spotifyToken || !deviceId) return;
    try {
      await spotifyRequest(`/me/player/previous?device_id=${encodeURIComponent(deviceId)}`, { method: "POST" });
    } catch {
      setAuthError("Could not play previous track.");
    }
  }

  async function toggleShuffle() {
    if (!spotifyToken || !deviceId) return;
    const nextShuffle = !shuffle;
    setShuffle(nextShuffle);
    try {
      await spotifyRequest(`/me/player/shuffle?state=${nextShuffle}&device_id=${encodeURIComponent(deviceId)}`, {
        method: "PUT"
      });
    } catch {
      setAuthError("Could not update shuffle.");
      setShuffle(!nextShuffle);
    }
  }

  async function cycleRepeat() {
    if (!spotifyToken || !deviceId) return;
    const nextRepeat = (repeat + 1) % 3;
    const repeatState = ["off", "context", "track"][nextRepeat];
    setRepeat(nextRepeat);
    try {
      await spotifyRequest(`/me/player/repeat?state=${repeatState}&device_id=${encodeURIComponent(deviceId)}`, {
        method: "PUT"
      });
    } catch {
      setAuthError("Could not update repeat.");
      setRepeat(repeat);
    }
  }

  function seekProgress(nextValue) {
    setProgress(nextValue);
    const snapshot = playbackSnapshotRef.current;
    if (!spotifyToken || !deviceId || !snapshot.duration) return;

    const positionMs = Math.floor((nextValue / 100) * snapshot.duration);
    setElapsedLabel(formatMs(positionMs));
    playbackSnapshotRef.current = {
      ...snapshot,
      position: positionMs
    };

    window.clearTimeout(seekDebounceRef.current);
    seekDebounceRef.current = window.setTimeout(async () => {
      try {
        await spotifyRequest(`/me/player/seek?position_ms=${positionMs}&device_id=${encodeURIComponent(deviceId)}`, {
          method: "PUT"
        });
      } catch {
        setAuthError("Could not seek track.");
      }
    }, 120);
  }

  async function toggleSaveTrack() {
    if (!spotifyToken || !currentTrackId) {
      setLiked((currentLiked) => !currentLiked);
      return;
    }

    const nextLiked = !liked;
    setLiked(nextLiked);

    try {
      await spotifyRequest(`/me/tracks?ids=${encodeURIComponent(currentTrackId)}`, {
        method: nextLiked ? "PUT" : "DELETE"
      });
    } catch {
      setAuthError("Could not update saved track.");
      setLiked(!nextLiked);
    }
  }

  const title = meta?.title || config.title;
  const artist = meta?.author || config.artist;
  const artworkUrl = (meta?.thumbnailUrl || config.artworkUrl || "").trim();
  const effectiveVol = muted ? 0 : volume;
  const isEmbedFallbackMode = embedMode;
  const showAuthCta = !isEmbedFallbackMode && !spotifyToken;
  const showPlayerPreparing = !isEmbedFallbackMode && spotifyToken && !isPlayerConnected;
  const canUseAdvancedControls = !isEmbedFallbackMode && spotifyToken && isPlayerConnected;
  const shouldRenderNativePlayer = Boolean(embedUrl) && (config.showNativePlayer || isEmbedFallbackMode || !canUseAdvancedControls);
  const connectButtonText = isAuthenticating
    ? "Connecting Spotify..."
    : spotifyToken && !isPlayerConnected
      ? "Preparing Spotify Player..."
      : "Connect Spotify For Real Playback";

  return (
    <div className={`sp${embedMode ? " sp-embed" : ""}`}>
      <div className="sp-body">
        {/* ── Artwork ── */}
        <div className="sp-cover">
          {artworkUrl ? (
            <img className="sp-cover-img" src={artworkUrl} alt="" />
          ) : (
            <div className="sp-cover-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
            </div>
          )}
          {playing && <div className="sp-eq" aria-label="Playing"><span/><span/><span/></div>}
        </div>

        {/* ── Track info ── */}
        <div className="sp-meta">
          <p className="sp-eyebrow">{config.label}</p>
          <h2 className="sp-title">{title}</h2>
          <p className="sp-subtitle">{artist}</p>
        </div>

        {canUseAdvancedControls ? (
          <>
            {/* ── Progress ── */}
            <div className="sp-progress">
              <span className="sp-time">{elapsedLabel}</span>
              <div className="sp-slider-wrap">
                <input className="sp-slider" type="range" min="0" max="100" value={progress} onInput={(e) => seekProgress(Number(e.currentTarget.value))} style={{ "--pct": `${progress}%` }} aria-label="Seek" />
              </div>
              <span className="sp-time">{durationLabel}</span>
            </div>

            {/* ── Controls ── */}
            <div className="sp-controls">
              <button className={`sp-btn sp-btn-sm${shuffle ? " on" : ""}`} type="button" onClick={toggleShuffle} title="Shuffle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="sp-btn" type="button" title="Previous" onClick={playPrevious}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
              </button>
              <button className="sp-btn-play" type="button" onClick={togglePlayback} title={playing ? "Pause" : "Play"}>
                {playing ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              <button className="sp-btn" type="button" title="Next" onClick={playNext}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM4 18l8.5-6L4 6z"/></svg>
              </button>
              <button className={`sp-btn sp-btn-sm${repeat > 0 ? " on" : ""}`} type="button" onClick={cycleRepeat} title={["Repeat off", "Repeat all", "Repeat one"][repeat]}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 1l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 11V9a4 4 0 014-4h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 23l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 13v2a4 4 0 01-4 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {repeat === 2 && <span className="sp-badge">1</span>}
              </button>
            </div>
          </>
        ) : (
          <button className="sp-btn-play sp-btn-play-connect" type="button" onClick={connectSpotify} title="Connect Spotify">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
        )}

        {showAuthCta ? (
          <button className="sp-auth" type="button" onClick={connectSpotify} disabled={isAuthenticating}>
            {connectButtonText}
          </button>
        ) : null}

        {showPlayerPreparing ? (
          <p className="sp-guest-hint">Preparing your Spotify player. Controls unlock once device sync is ready.</p>
        ) : null}

        {!canUseAdvancedControls && !isEmbedFallbackMode ? (
          <p className="sp-guest-hint">Guest mode: use the native Spotify player below. Connect only if you want advanced controls.</p>
        ) : null}

        {authError ? <p className="sp-error">{authError}</p> : null}

        {/* ── Bottom: like · volume · spotify ── */}
        {canUseAdvancedControls ? (
          <div className="sp-bottom">
            <button className={`sp-btn sp-btn-sm${liked ? " sp-liked" : ""}`} type="button" onClick={toggleSaveTrack} title={liked ? "Remove from library" : "Save to library"}>
              {liked ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>

            <div className="sp-vol">
              <button className="sp-btn sp-btn-sm" type="button" onClick={() => setMuted(!muted)} title={muted ? "Unmute" : "Mute"}>
                {effectiveVol === 0 ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                ) : effectiveVol < 50 ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                )}
              </button>
              <input className="sp-slider sp-slider-vol" type="range" min="0" max="100" value={effectiveVol} onInput={(e) => { setVolume(Number(e.currentTarget.value)); setMuted(false); }} style={{ "--pct": `${effectiveVol}%` }} aria-label="Volume" />
            </div>

            {embedUrl && (
              <a className="sp-link" href={config.spotifyUrl} target="_blank" rel="noreferrer" title="Open in Spotify">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              </a>
            )}
          </div>
        ) : null}

        {shouldRenderNativePlayer && (
          <iframe className="sp-iframe" src={embedUrl} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Spotify embed" />
        )}
      </div>
    </div>
  );
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function clampNumber(value, min, max) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return min;
  }

  return Math.min(Math.max(numericValue, min), max);
}

function formatMs(ms) {
  const safeMs = Math.max(Number(ms) || 0, 0);
  const totalSeconds = Math.floor(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function spotifyUrlToUri(value) {
  if (!value) return "";

  try {
    const parsed = new URL(value);
    if (!parsed.hostname.includes("spotify.com")) return "";
    const parts = parsed.pathname.split("/").filter(Boolean);

    let mediaType = parts[0];
    let mediaId = parts[1];

    if (parts[0] === "embed" && parts.length >= 3) {
      mediaType = parts[1];
      mediaId = parts[2];
    }

    if (mediaType && mediaId) {
      return {
        type: mediaType,
        uri: `spotify:${mediaType}:${mediaId}`
      };
    }
  } catch {
    return "";
  }

  return "";
}

function buildInitialPlaybackPayload(source) {
  const contextTypes = new Set(["playlist", "album", "artist", "show"]);

  if (contextTypes.has(source.type)) {
    return { context_uri: source.uri };
  }

  return { uris: [source.uri] };
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getSpotifyRedirectUri() {
  if (process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI) {
    return process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  }

  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.origin}${window.location.pathname}`;
}

function createPkceVerifier() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const randomValues = new Uint8Array(96);
  crypto.getRandomValues(randomValues);

  return Array.from(randomValues, (value) => alphabet[value % alphabet.length]).join("");
}

async function createPkceChallenge(verifier) {
  const encoded = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return toBase64Url(digest);
}

function toBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function readSpotifySession() {
  if (typeof window === "undefined") return null;

  try {
    const parsed = JSON.parse(window.localStorage.getItem(SPOTIFY_SESSION_KEY) || "null");
    if (!parsed?.accessToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSpotifySession(session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SPOTIFY_SESSION_KEY, JSON.stringify(session));
}

function clearSpotifySession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SPOTIFY_SESSION_KEY);
  window.localStorage.removeItem(SPOTIFY_PKCE_VERIFIER_KEY);
}

async function resolveSpotifyClientId() {
  if (process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID) {
    return process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  }

  try {
    const response = await fetch("/api/spotify-client", { cache: "no-store" });
    if (!response.ok) return "";
    const payload = await response.json();
    return payload.clientId || "";
  } catch {
    return "";
  }
}

async function transferPlaybackToDevice(accessToken, deviceId) {
  if (!accessToken || !deviceId) return;

  try {
    await fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ device_ids: [deviceId], play: false })
    });
  } catch {
    return;
  }
}