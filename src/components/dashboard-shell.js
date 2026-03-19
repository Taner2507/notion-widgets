"use client";

import { useEffect, useMemo, useState } from "react";

import EmbedShell from "@/src/components/embed-shell";
import WidgetPreview from "@/src/components/widget-preview";
import { getWidgetEntries, mergeWidgetConfig, widgetCatalog } from "@/src/lib/widget-definitions";
import {
  buildEmbedUrl,
  createSavedWidgetId,
  getSavedWidgetsStorageKey,
  getStudioStateStorageKey,
  titleCase
} from "@/src/lib/widget-utils";

export default function DashboardShell() {
  const widgetEntries = useMemo(() => getWidgetEntries(), []);
  const [baseUrl, setBaseUrl] = useState("");
  const [activeWidgetType, setActiveWidgetType] = useState("clock");
  const [draftName, setDraftName] = useState("");
  const [activeSavedId, setActiveSavedId] = useState(null);
  const [savedWidgets, setSavedWidgets] = useState([]);
  const [config, setConfig] = useState(() => mergeWidgetConfig("clock", null));
  const [copied, setCopied] = useState(false);
  const [embedRequest, setEmbedRequest] = useState({ checked: false, enabled: false, type: null, config: null });

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const widgetType = currentUrl.searchParams.get("widget");
    const encodedConfig = currentUrl.searchParams.get("config");
    const embedEnabled = currentUrl.searchParams.get("embed") === "1";

    setBaseUrl(`${currentUrl.origin}${currentUrl.pathname}`);
    setEmbedRequest({
      checked: true,
      enabled: embedEnabled,
      type: widgetType,
      config: encodedConfig
    });

    try {
      const savedState = JSON.parse(window.localStorage.getItem(getStudioStateStorageKey()) || "null");
      if (savedState?.type && widgetCatalog[savedState.type]) {
        setActiveWidgetType(savedState.type);
        setConfig(mergeWidgetConfig(savedState.type, savedState.config));
      }

      const savedLibrary = JSON.parse(window.localStorage.getItem(getSavedWidgetsStorageKey()) || "[]");
      if (Array.isArray(savedLibrary)) {
        setSavedWidgets(savedLibrary.filter((entry) => widgetCatalog[entry.type]));
      }
    } catch {
      setSavedWidgets([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      getStudioStateStorageKey(),
      JSON.stringify({ type: activeWidgetType, config })
    );
  }, [activeWidgetType, config]);

  useEffect(() => {
    window.localStorage.setItem(getSavedWidgetsStorageKey(), JSON.stringify(savedWidgets));
  }, [savedWidgets]);

  useEffect(() => {
    if (activeWidgetType !== "spotify") return;
    if (!config.syncMetadata || !config.spotifyUrl) return;

    const abortController = new AbortController();

    async function syncSpotifyMetadata() {
      try {
        const response = await fetch(`/api/spotify-meta?url=${encodeURIComponent(config.spotifyUrl)}`, {
          signal: abortController.signal
        });
        if (!response.ok) return;
        const metadata = await response.json();

        setConfig((currentConfig) => {
          if (currentConfig.spotifyUrl !== config.spotifyUrl || !currentConfig.syncMetadata) {
            return currentConfig;
          }
          return {
            ...currentConfig,
            title: metadata.title || currentConfig.title,
            artist: metadata.author || currentConfig.artist,
            artworkUrl: metadata.thumbnailUrl || currentConfig.artworkUrl
          };
        });
      } catch {
        return;
      }
    }

    syncSpotifyMetadata();
    return () => abortController.abort();
  }, [activeWidgetType, config.spotifyUrl, config.syncMetadata]);

  const embedUrl = useMemo(() => buildEmbedUrl(baseUrl, activeWidgetType, config), [baseUrl, activeWidgetType, config]);
  const activeDefinition = widgetCatalog[activeWidgetType];

  if (!embedRequest.checked) return null;
  if (embedRequest.enabled) {
    return <EmbedShell widgetType={embedRequest.type} encodedConfig={embedRequest.config} />;
  }

  function selectWidgetType(type) {
    setActiveSavedId(null);
    setDraftName("");
    setActiveWidgetType(type);
    setConfig(mergeWidgetConfig(type, null));
  }

  function updateField(key, nextValue) {
    setActiveSavedId(null);
    setConfig((c) => ({ ...c, [key]: nextValue }));
  }

  async function copyEmbedLink(nextUrl = embedUrl) {
    if (!nextUrl) return;
    try {
      await navigator.clipboard.writeText(nextUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  function saveWidget() {
    const name = draftName.trim() || `${activeDefinition.name} ${savedWidgets.length + 1}`;

    if (activeSavedId) {
      setSavedWidgets((w) =>
        w.map((widget) =>
          widget.id === activeSavedId
            ? { ...widget, name, type: activeWidgetType, config, updatedAt: new Date().toISOString() }
            : widget
        )
      );
      setDraftName(name);
      return;
    }

    const newId = createSavedWidgetId();
    setActiveSavedId(newId);
    setDraftName(name);
    setSavedWidgets((w) => [
      { id: newId, name, type: activeWidgetType, config, updatedAt: new Date().toISOString() },
      ...w
    ]);
  }

  function loadSavedWidget(savedWidget) {
    setActiveSavedId(savedWidget.id);
    setActiveWidgetType(savedWidget.type);
    setDraftName(savedWidget.name);
    setConfig(mergeWidgetConfig(savedWidget.type, savedWidget.config));
  }

  function deleteSavedWidget(id) {
    setSavedWidgets((w) => w.filter((widget) => widget.id !== id));
    if (activeSavedId === id) {
      setActiveSavedId(null);
      setDraftName("");
      setConfig(mergeWidgetConfig(activeWidgetType, null));
    }
  }

  function resetDraft() {
    setActiveSavedId(null);
    setDraftName("");
    setConfig(mergeWidgetConfig(activeWidgetType, null));
  }

  return (
    <main className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">N</span>
          <span className="header-title">Widget Studio</span>
        </div>
        <div className="header-right">
          <button className="btn btn-ghost" type="button" onClick={resetDraft}>
            + New
          </button>
          <button className="btn btn-primary" type="button" onClick={() => copyEmbedLink()}>
            {copied ? "Copied!" : "Copy Embed Link"}
          </button>
        </div>
      </header>

      <div className="app-body">
        {/* ── Sidebar: Builder ── */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <p className="sidebar-label">Select Widget</p>
            <div className="widget-types">
              {widgetEntries.map((widget) => (
                <button
                  key={widget.id}
                  className={`widget-type-btn${widget.id === activeWidgetType ? " active" : ""}`}
                  type="button"
                  onClick={() => selectWidgetType(widget.id)}
                >
                  <span className="widget-type-icon">{widget.icon}</span>
                  <div>
                    <span className="widget-type-name">{widget.name}</span>
                    <span className="widget-type-desc">{widget.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <p className="sidebar-label">Configure</p>
            <div className="form-fields">
              <div className="form-group">
                <label className="form-label">Widget Name</label>
                <input
                  className="form-input"
                  type="text"
                  maxLength={60}
                  placeholder="e.g. Morning Dashboard"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                />
              </div>

              {activeDefinition.fields.map((field) => {
                if (field.type === "checkbox") {
                  return (
                    <label key={field.key} className="form-group is-checkbox">
                      <input
                        type="checkbox"
                        checked={Boolean(config[field.key])}
                        onChange={(e) => updateField(field.key, e.target.checked)}
                      />
                      <span className="form-label">{field.label}</span>
                    </label>
                  );
                }

                const options = typeof field.options === "function" ? field.options() : [];

                return (
                  <div key={field.key} className="form-group">
                    <label className="form-label">{field.label}</label>
                    {field.type === "textarea" && (
                      <textarea
                        className="form-input"
                        value={config[field.key]}
                        onChange={(e) => updateField(field.key, e.target.value)}
                      />
                    )}
                    {field.type === "select" && (
                      <select
                        className="form-input"
                        value={config[field.key]}
                        onChange={(e) => updateField(field.key, e.target.value)}
                      >
                        {options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    )}
                    {["text", "color", "datetime-local", "url", "number"].includes(field.type) && (
                      <input
                        className="form-input"
                        type={field.type}
                        maxLength={field.maxLength}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={config[field.key]}
                        onChange={(e) =>
                          updateField(
                            field.key,
                            field.type === "number" ? Number(e.target.value || 0) : e.target.value
                          )
                        }
                      />
                    )}
                    {field.help && <p className="form-hint">{field.help}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sidebar-actions">
            <button className="btn btn-primary btn-full" type="button" onClick={saveWidget}>
              {activeSavedId ? "Update Widget" : "Save Widget"}
            </button>
            <button className="btn btn-ghost btn-full" type="button" onClick={resetDraft}>
              Reset to Defaults
            </button>
          </div>
        </aside>

        {/* ── Content: Preview + Saved ── */}
        <div className="content">
          <section className="preview-section">
            <div className="preview-header">
              <h2 className="section-title">Live Preview</h2>
              <div className="preview-badges">
                <span className="badge">{activeDefinition.name}</span>
                <span className="badge">{titleCase(config.layout)}</span>
              </div>
            </div>

            <div className="preview-canvas">
              <WidgetPreview type={activeWidgetType} config={config} />
            </div>

            <div className="embed-bar">
              <label className="form-label">Embed URL</label>
              <div className="embed-input-row">
                <input className="form-input embed-input" type="text" readOnly value={embedUrl} />
                <button className="btn btn-primary" type="button" onClick={() => copyEmbedLink()}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="embed-hint">Paste this URL into a Notion embed block to display the widget.</p>
            </div>
          </section>

          <section className="saved-section">
            <h2 className="section-title">Saved Widgets</h2>
            {savedWidgets.length === 0 ? (
              <div className="empty-state">
                No saved widgets yet. Configure a widget and click "Save Widget" to get started.
              </div>
            ) : (
              <div className="saved-grid">
                {savedWidgets.map((sw) => (
                  <article key={sw.id} className={`saved-card${sw.id === activeSavedId ? " active" : ""}`}>
                    <div className="saved-card-header">
                      <h3 className="saved-card-name">{sw.name}</h3>
                      <span className="badge">{widgetCatalog[sw.type].name}</span>
                    </div>
                    <p className="saved-card-meta">
                      Updated {new Date(sw.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="saved-card-actions">
                      <button className="btn btn-sm btn-ghost" type="button" onClick={() => loadSavedWidget(sw)}>
                        Load
                      </button>
                      <button
                        className="btn btn-sm btn-ghost"
                        type="button"
                        onClick={() => copyEmbedLink(buildEmbedUrl(baseUrl, sw.type, sw.config))}
                      >
                        Copy Link
                      </button>
                      <button className="btn btn-sm btn-danger" type="button" onClick={() => deleteSavedWidget(sw.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}