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
  const [volume, setVolume] = useState(Number(config.volumeLevel) || 70);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(0);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(Number(config.progressPercent) || 0);
  const [meta, setMeta] = useState(null);

  useEffect(() => { setVolume(Number(config.volumeLevel) || 70); }, [config.volumeLevel]);
  useEffect(() => { setProgress(clampNumber(config.progressPercent, 0, 100)); }, [config.progressPercent]);

  useEffect(() => {
    if (!config.spotifyUrl) return;
    const ac = new AbortController();
    fetch(`/api/spotify-meta?url=${encodeURIComponent(config.spotifyUrl)}`, { signal: ac.signal })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setMeta(d); })
      .catch(() => {});
    return () => ac.abort();
  }, [config.spotifyUrl]);

  const title = meta?.title || config.title;
  const artist = meta?.author || config.artist;
  const artworkUrl = (meta?.thumbnailUrl || config.artworkUrl || "").trim();
  const effectiveVol = muted ? 0 : volume;

  return (
    <div className="sp">
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

        {/* ── Progress ── */}
        <div className="sp-progress">
          <span className="sp-time">{config.elapsedLabel}</span>
          <div className="sp-slider-wrap">
            <input className="sp-slider" type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} style={{ "--pct": `${progress}%` }} aria-label="Seek" />
          </div>
          <span className="sp-time">{config.durationLabel}</span>
        </div>

        {/* ── Controls ── */}
        <div className="sp-controls">
          <button className={`sp-btn sp-btn-sm${shuffle ? " on" : ""}`} type="button" onClick={() => setShuffle(!shuffle)} title="Shuffle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="sp-btn" type="button" title="Previous">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
          </button>
          <button className="sp-btn-play" type="button" onClick={() => setPlaying(!playing)} title={playing ? "Pause" : "Play"}>
            {playing ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <button className="sp-btn" type="button" title="Next">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM4 18l8.5-6L4 6z"/></svg>
          </button>
          <button className={`sp-btn sp-btn-sm${repeat > 0 ? " on" : ""}`} type="button" onClick={() => setRepeat((r) => (r + 1) % 3)} title={["Repeat off", "Repeat all", "Repeat one"][repeat]}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 1l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 11V9a4 4 0 014-4h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 23l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 13v2a4 4 0 01-4 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {repeat === 2 && <span className="sp-badge">1</span>}
          </button>
        </div>

        {/* ── Bottom: like · volume · spotify ── */}
        <div className="sp-bottom">
          <button className={`sp-btn sp-btn-sm${liked ? " sp-liked" : ""}`} type="button" onClick={() => setLiked(!liked)} title={liked ? "Remove from library" : "Save to library"}>
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
            <input className="sp-slider sp-slider-vol" type="range" min="0" max="100" value={effectiveVol} onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }} style={{ "--pct": `${effectiveVol}%` }} aria-label="Volume" />
          </div>

          {embedUrl && (
            <a className="sp-link" href={config.spotifyUrl} target="_blank" rel="noreferrer" title="Open in Spotify">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            </a>
          )}
        </div>

        {config.showNativePlayer && embedUrl && (
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