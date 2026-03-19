"use client";

import { useEffect, useMemo, useState } from "react";

import { applyThemeVariables, normalizeSpotifyEmbedUrl } from "@/src/lib/widget-utils";

export default function WidgetPreview({ type, config, embedMode = false }) {
  const themeStyle = useMemo(() => applyThemeVariables(config), [config]);

  return (
    <section className="widget-card" data-layout={config.layout} style={themeStyle}>
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
  const [displayVolume, setDisplayVolume] = useState(Number(config.volumeLevel) || 0);

  useEffect(() => {
    setDisplayVolume(Number(config.volumeLevel) || 0);
  }, [config.volumeLevel]);

  const progressPercent = clampNumber(config.progressPercent, 0, 100);
  const artworkUrl = config.artworkUrl?.trim();

  return (
    <>
      <div className="spotify-minimal-shell">
        <div className="spotify-minimal-card">
          <div className="spotify-minimal-artwork">
            {artworkUrl ? (
              <img className="spotify-minimal-artwork-image" src={artworkUrl} alt={`${config.title} cover art`} />
            ) : (
              <div className="spotify-artwork-fallback">♫</div>
            )}
          </div>
          <div className="spotify-minimal-copy">
            <div className="spotify-minimal-topline">
              <p className="spotify-eyebrow">{config.label}</p>
              <span className="tag">Spotify</span>
            </div>
            <h2 className="spotify-title spotify-title-minimal">{config.title}</h2>
            <p className="spotify-artist-minimal">{config.artist}</p>
            <div className="spotify-progress-block spotify-progress-block-minimal">
              <div className="spotify-time-row">
                <span>{config.elapsedLabel}</span>
                <span>{config.durationLabel}</span>
              </div>
              <div className="spotify-progress-rail" aria-hidden="true">
                <span className="spotify-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <div className="spotify-actions-minimal">
              {embedUrl ? (
                <a
                  className="secondary-button spotify-open-link"
                  href={config.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Spotify
                </a>
              ) : null}
            </div>
          </div>
        </div>
        <div className="spotify-minimal-footer">
          <p className="widget-meta spotify-note-minimal">{config.note}</p>
          <div className="spotify-volume-row spotify-volume-row-minimal">
            <span className="spotify-volume-label">Volume</span>
            <input
              className="spotify-volume-slider spotify-volume-slider-minimal"
              style={{ "--slider-fill": displayVolume }}
              type="range"
              min="0"
              max="100"
              value={displayVolume}
              onChange={(event) => setDisplayVolume(Number(event.target.value))}
              aria-label="Volume preview"
            />
            <span className="spotify-volume-value">{displayVolume}</span>
          </div>
        </div>
      </div>
      {config.showNativePlayer && embedUrl ? (
        <>
          <div className="widget-divider"></div>
          <iframe
            className="widget-embed spotify-native-embed"
            src={embedUrl}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify embed"
          />
        </>
      ) : null}
      {!embedUrl ? (
        <div className="prompt-card">
          <p className="muted-text">
            Paste a Spotify track, album, playlist, or podcast share link in the builder.
          </p>
        </div>
      ) : null}
      {!embedMode ? (
        <p className="widget-meta">
          This widget can auto-match title, artist, and artwork from the pasted Spotify link. True
          account-level "currently playing" live sync still requires Spotify OAuth and a backend.
        </p>
      ) : null}
    </>
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