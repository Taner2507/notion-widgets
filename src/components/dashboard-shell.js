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
  getWidgetSummary,
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

  const embedUrl = useMemo(() => buildEmbedUrl(baseUrl, activeWidgetType, config), [baseUrl, activeWidgetType, config]);
  const summary = useMemo(() => getWidgetSummary(savedWidgets), [savedWidgets]);

  const activeDefinition = widgetCatalog[activeWidgetType];

  if (!embedRequest.checked) {
    return null;
  }

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
    setConfig((currentConfig) => ({
      ...currentConfig,
      [key]: nextValue
    }));
  }

  async function copyEmbedLink(nextUrl = embedUrl) {
    if (!nextUrl) {
      return;
    }

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
      setSavedWidgets((currentWidgets) =>
        currentWidgets.map((widget) =>
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
    setSavedWidgets((currentWidgets) => [
      {
        id: newId,
        name,
        type: activeWidgetType,
        config,
        updatedAt: new Date().toISOString()
      },
      ...currentWidgets
    ]);
  }

  function loadSavedWidget(savedWidget) {
    setActiveSavedId(savedWidget.id);
    setActiveWidgetType(savedWidget.type);
    setDraftName(savedWidget.name);
    setConfig(mergeWidgetConfig(savedWidget.type, savedWidget.config));
  }

  function deleteSavedWidget(id) {
    setSavedWidgets((currentWidgets) => currentWidgets.filter((widget) => widget.id !== id));

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
    <main className="page-shell">
      <header className="topbar glass-panel">
        <div className="brand">
          <span className="brand-mark">N</span>
          <div>
            <p className="brand-title">Notion Widget Platform</p>
            <p className="brand-subtitle">Build cleaner widgets and better embed links.</p>
          </div>
        </div>
        <div className="nav-links">
          <a className="chip-button" href="#studio">
            Studio
          </a>
          <a className="chip-button" href="#catalog">
            Explore
          </a>
          <button className="primary-button" type="button" onClick={() => copyEmbedLink()}>
            {copied ? "Copied" : "Copy Current Embed"}
          </button>
        </div>
      </header>

      <section className="hero-grid">
        <section className="hero-panel glass-panel">
          <p className="section-kicker">A better Notion widget workflow</p>
          <h1 className="hero-title">Design, save, and ship widget links without paying for a domain first.</h1>
          <p className="hero-copy">
            Use a free Vercel URL to launch quickly, then add a custom domain later if you want
            branding. For now, the important part is a clean builder, a polished preview, and a
            proper embed route.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#studio">
              Build a widget
            </a>
            <button className="secondary-button" type="button" onClick={resetDraft}>
              New draft
            </button>
          </div>
        </section>

        <section className="metrics-panel glass-panel">
          <p className="section-kicker">Platform snapshot</p>
          <div className="metrics-grid">
            <article className="metric-card">
              <p className="metric-label">Widget types</p>
              <p className="metric-value">{widgetEntries.length}</p>
            </article>
            <article className="metric-card">
              <p className="metric-label">Saved widgets</p>
              <p className="metric-value">{summary.total}</p>
            </article>
            <article className="metric-card">
              <p className="metric-label">Hosting cost</p>
              <p className="metric-value">$0</p>
            </article>
          </div>
          <div className="button-row" style={{ marginTop: 18 }}>
            <span className="tag">Free `.vercel.app` works in Notion</span>
            <span className="tag">Custom domain optional later</span>
          </div>
        </section>
      </section>

      <section id="studio" className="two-column-grid">
        <section className="studio-panel glass-panel">
          <div className="panel-title-row">
            <div>
              <p className="section-kicker">Studio</p>
              <h2 className="panel-title">Create widget</h2>
            </div>
          </div>

          <div className="type-grid">
            {widgetEntries.map((widget) => (
              <button
                key={widget.id}
                className={`type-card${widget.id === activeWidgetType ? " is-active" : ""}`}
                type="button"
                onClick={() => selectWidgetType(widget.id)}
              >
                <p className="section-kicker">{widget.id}</p>
                <p className="type-title">{widget.name}</p>
                <p className="type-description">{widget.description}</p>
              </button>
            ))}
          </div>

          <div className="field-grid">
            <label className="field">
              <span className="field-label">Widget name</span>
              <input
                className="field-control"
                type="text"
                maxLength={60}
                placeholder="Morning Dashboard"
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
              />
            </label>

            {activeDefinition.fields.map((field) => {
              if (field.type === "checkbox") {
                return (
                  <label key={field.key} className="field is-checkbox">
                    <input
                      type="checkbox"
                      checked={Boolean(config[field.key])}
                      onChange={(event) => updateField(field.key, event.target.checked)}
                    />
                    <span className="field-label">{field.label}</span>
                  </label>
                );
              }

              const options = typeof field.options === "function" ? field.options() : [];

              return (
                <label key={field.key} className="field">
                  <span className="field-label">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      className="field-control"
                      value={config[field.key]}
                      onChange={(event) => updateField(field.key, event.target.value)}
                    />
                  ) : null}
                  {field.type === "select" ? (
                    <select
                      className="field-control"
                      value={config[field.key]}
                      onChange={(event) => updateField(field.key, event.target.value)}
                    >
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : null}
                  {["text", "color", "datetime-local", "url", "number"].includes(field.type) ? (
                    <input
                      className="field-control"
                      type={field.type}
                      maxLength={field.maxLength}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={config[field.key]}
                      onChange={(event) =>
                        updateField(
                          field.key,
                          field.type === "number" ? Number(event.target.value || 0) : event.target.value
                        )
                      }
                    />
                  ) : null}
                  {field.help ? <p className="field-help">{field.help}</p> : null}
                </label>
              );
            })}
          </div>

          <div className="builder-footer">
            <label className="field">
              <span className="field-label">Embed URL</span>
              <input className="field-control" type="text" readOnly value={embedUrl} />
            </label>
            <div className="button-row">
              <button className="primary-button" type="button" onClick={saveWidget}>
                {activeSavedId ? "Update widget" : "Save widget"}
              </button>
              <button className="secondary-button" type="button" onClick={() => copyEmbedLink()}>
                Copy embed link
              </button>
              <button className="ghost-button" type="button" onClick={resetDraft}>
                Reset
              </button>
            </div>
          </div>
        </section>

        <section className="saved-panel glass-panel">
          <div className="panel-title-row">
            <div>
              <p className="section-kicker">Preview</p>
              <h2 className="panel-title">Live output</h2>
            </div>
            <div className="preview-chips">
              <span className="tag">{activeDefinition.name}</span>
              <span className="tag">{titleCase(config.theme)}</span>
              <span className="tag">{titleCase(config.layout)}</span>
            </div>
          </div>

          <div className="preview-shell">
            <div className="widget-preview">
              <WidgetPreview type={activeWidgetType} config={config} />
            </div>

            <div className="panel-title-row" style={{ marginBottom: 0, marginTop: 10 }}>
              <div>
                <p className="section-kicker">My widgets</p>
                <h2 className="panel-title">Saved variations</h2>
              </div>
            </div>

            {savedWidgets.length === 0 ? (
              <div className="empty-state">No saved widgets yet. Save one and it will appear here.</div>
            ) : (
              <div className="saved-grid">
                {savedWidgets.map((savedWidget) => (
                  <article
                    key={savedWidget.id}
                    className={`saved-card${savedWidget.id === activeSavedId ? " is-active" : ""}`}
                  >
                    <div className="saved-top">
                      <div>
                        <p className="saved-title">{savedWidget.name}</p>
                        <p className="saved-subtext">
                          {widgetCatalog[savedWidget.type].name} • updated {new Date(savedWidget.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="saved-tags">
                        <span className="tag">{titleCase(savedWidget.config.theme)}</span>
                        <span className="tag">{titleCase(savedWidget.config.layout)}</span>
                      </div>
                    </div>
                    <div className="saved-actions">
                      <button className="ghost-button" type="button" onClick={() => loadSavedWidget(savedWidget)}>
                        Load
                      </button>
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => copyEmbedLink(buildEmbedUrl(baseUrl, savedWidget.type, savedWidget.config))}
                      >
                        Copy link
                      </button>
                      <button className="secondary-button" type="button" onClick={() => deleteSavedWidget(savedWidget.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>

      <section id="catalog" className="catalog-panel glass-panel">
        <div className="panel-title-row">
          <div>
            <p className="section-kicker">Explore widgets</p>
            <h2 className="panel-title">High-value starting set</h2>
          </div>
          <div className="catalog-tags">
            <span className="tag">Built for Notion width constraints</span>
            <span className="tag">Free hosting friendly</span>
          </div>
        </div>
        <div className="catalog-grid">
          {widgetEntries.map((widget) => (
            <article key={widget.id} className="catalog-card">
              <span className="catalog-icon">{widget.icon}</span>
              <h3 className="catalog-title">{widget.name}</h3>
              <p className="muted-text">{widget.description}</p>
              <div className="catalog-tags" style={{ marginTop: 16 }}>
                <span className="tag">Fast to configure</span>
                <span className="tag">Embed-ready</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}