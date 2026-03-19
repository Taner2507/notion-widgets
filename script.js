const themes = {
  warm: {
    pageTop: "#f7f1e7",
    pageBottom: "#edf5ff",
    panel: "rgba(255, 250, 242, 0.76)",
    panelStrong: "rgba(255, 255, 255, 0.82)",
    panelBorder: "rgba(99, 74, 43, 0.12)",
    textStrong: "#1e2932",
    textSoft: "#5d6873",
    accentStrong: "#8a4722",
    widgetCard: "rgba(255, 249, 241, 0.88)",
    shadow: "0 24px 60px rgba(65, 47, 30, 0.12)"
  },
  ocean: {
    pageTop: "#e4f6ff",
    pageBottom: "#eef8f3",
    panel: "rgba(245, 252, 255, 0.76)",
    panelStrong: "rgba(255, 255, 255, 0.84)",
    panelBorder: "rgba(38, 89, 121, 0.14)",
    textStrong: "#173447",
    textSoft: "#547288",
    accentStrong: "#155570",
    widgetCard: "rgba(241, 251, 255, 0.9)",
    shadow: "0 24px 60px rgba(28, 78, 96, 0.14)"
  },
  forest: {
    pageTop: "#eef8ea",
    pageBottom: "#f9f3e6",
    panel: "rgba(249, 255, 246, 0.76)",
    panelStrong: "rgba(255, 255, 255, 0.84)",
    panelBorder: "rgba(68, 108, 67, 0.14)",
    textStrong: "#223225",
    textSoft: "#5d6f60",
    accentStrong: "#3d623c",
    widgetCard: "rgba(248, 255, 246, 0.9)",
    shadow: "0 24px 60px rgba(47, 79, 46, 0.14)"
  },
  midnight: {
    pageTop: "#121a2a",
    pageBottom: "#233149",
    panel: "rgba(14, 22, 36, 0.76)",
    panelStrong: "rgba(18, 28, 44, 0.84)",
    panelBorder: "rgba(164, 188, 214, 0.12)",
    textStrong: "#f0f6ff",
    textSoft: "#adbfd3",
    accentStrong: "#ffd7af",
    widgetCard: "rgba(16, 25, 41, 0.88)",
    shadow: "0 24px 60px rgba(3, 9, 18, 0.42)"
  }
};

const widgets = {
  clock: {
    id: "clock",
    name: "Focus Clock",
    description: "A live clock with rotating focus prompts.",
    defaults: {
      theme: "warm",
      layout: "classic",
      accent: "#d66d37",
      label: "Focus Clock",
      title: "Today",
      showDate: true,
      showSeconds: false,
      use24Hour: false,
      prompts: "Pick one meaningful task and finish it before opening anything new.\nMake the next 25 minutes distraction-free.\nClear one stubborn task you have been postponing."
    },
    fields: [
      { key: "label", label: "Top label", type: "text", maxLength: 40 },
      { key: "title", label: "Title", type: "text", maxLength: 24 },
      { key: "theme", label: "Theme", type: "select", options: themeOptions() },
      { key: "layout", label: "Layout", type: "select", options: layoutOptions() },
      { key: "accent", label: "Accent color", type: "color" },
      { key: "showDate", label: "Show date", type: "checkbox" },
      { key: "showSeconds", label: "Show seconds", type: "checkbox" },
      { key: "use24Hour", label: "Use 24-hour time", type: "checkbox" },
      { key: "prompts", label: "Prompts", type: "textarea", help: "One prompt per line." }
    ]
  },
  countdown: {
    id: "countdown",
    name: "Countdown",
    description: "Count down to launches, exams, trips, or deadlines.",
    defaults: {
      theme: "ocean",
      layout: "spotlight",
      accent: "#2e8dc2",
      label: "Big Moment",
      title: "Launch Day",
      targetDate: getDefaultFutureDate(),
      showSeconds: false,
      completionText: "It is live."
    },
    fields: [
      { key: "label", label: "Top label", type: "text", maxLength: 40 },
      { key: "title", label: "Countdown title", type: "text", maxLength: 40 },
      { key: "theme", label: "Theme", type: "select", options: themeOptions() },
      { key: "layout", label: "Layout", type: "select", options: layoutOptions() },
      { key: "accent", label: "Accent color", type: "color" },
      { key: "targetDate", label: "Target date", type: "datetime-local" },
      { key: "showSeconds", label: "Show seconds", type: "checkbox" },
      { key: "completionText", label: "Completion message", type: "text", maxLength: 60 }
    ]
  },
  quote: {
    id: "quote",
    name: "Quote Card",
    description: "A styled quote for dashboards, journals, and covers.",
    defaults: {
      theme: "forest",
      layout: "classic",
      accent: "#56863f",
      label: "Daily Quote",
      quote: "Consistency is what transforms average into excellence.",
      author: "Robin Sharma"
    },
    fields: [
      { key: "label", label: "Top label", type: "text", maxLength: 40 },
      { key: "quote", label: "Quote", type: "textarea", help: "Keep it reasonably short for narrow Notion embeds." },
      { key: "author", label: "Author", type: "text", maxLength: 40 },
      { key: "theme", label: "Theme", type: "select", options: themeOptions() },
      { key: "layout", label: "Layout", type: "select", options: layoutOptions() },
      { key: "accent", label: "Accent color", type: "color" }
    ]
  },
  spotify: {
    id: "spotify",
    name: "Spotify Card",
    description: "Wrap a Spotify track, album, or playlist in your own widget shell.",
    defaults: {
      theme: "midnight",
      layout: "classic",
      accent: "#1db954",
      label: "Now Playing",
      title: "Spotify Pick",
      spotifyUrl: "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P",
      note: "Paste a Spotify share link or embed link."
    },
    fields: [
      { key: "label", label: "Top label", type: "text", maxLength: 40 },
      { key: "title", label: "Title", type: "text", maxLength: 40 },
      { key: "theme", label: "Theme", type: "select", options: themeOptions() },
      { key: "layout", label: "Layout", type: "select", options: layoutOptions() },
      { key: "accent", label: "Accent color", type: "color" },
      { key: "spotifyUrl", label: "Spotify link", type: "url" },
      { key: "note", label: "Helper text", type: "text", maxLength: 80 }
    ]
  }
};

const studioApp = document.getElementById("studioApp");
const embedApp = document.getElementById("embedApp");
const embedMount = document.getElementById("embedMount");
const widgetPicker = document.getElementById("widgetPicker");
const builderTitle = document.getElementById("builderTitle");
const builderForm = document.getElementById("builderForm");
const builderFields = document.getElementById("builderFields");
const previewMount = document.getElementById("previewMount");
const previewMeta = document.getElementById("previewMeta");
const variationNameInput = document.getElementById("variationNameInput");
const shareUrlInput = document.getElementById("shareUrlInput");
const copyLinkButton = document.getElementById("copyLinkButton");
const saveVariationButton = document.getElementById("saveVariationButton");
const resetButton = document.getElementById("resetButton");
const newVariationButton = document.getElementById("newVariationButton");
const variationEmptyState = document.getElementById("variationEmptyState");
const savedVariationsList = document.getElementById("savedVariationsList");

const initialStudioState = loadStudioState();

let activeWidgetType = initialStudioState.type;
let currentConfig = mergeConfig(activeWidgetType, initialStudioState.config);
let activeVariationId = null;
let savedVariations = loadSavedVariations();
let liveTimer = null;

if (isEmbedMode()) {
  renderEmbedView();
} else {
  renderStudio();
}

function themeOptions() {
  return [
    { value: "warm", label: "Warm Paper" },
    { value: "ocean", label: "Soft Ocean" },
    { value: "forest", label: "Forest Glass" },
    { value: "midnight", label: "Midnight" }
  ];
}

function layoutOptions() {
  return [
    { value: "classic", label: "Classic Card" },
    { value: "compact", label: "Compact Stack" },
    { value: "spotlight", label: "Spotlight" }
  ];
}

function getDefaultFutureDate() {
  const target = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, "0");
  const day = String(target.getDate()).padStart(2, "0");
  const hours = String(target.getHours()).padStart(2, "0");
  const minutes = String(target.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function isEmbedMode() {
  return new URLSearchParams(window.location.search).get("mode") === "embed";
}

function renderStudio() {
  studioApp.hidden = false;
  embedApp.hidden = true;
  renderWidgetPicker();
  renderBuilder();
  renderPreview();
  renderVariations();
}

function renderEmbedView() {
  studioApp.hidden = true;
  embedApp.hidden = false;

  const params = new URLSearchParams(window.location.search);
  const widgetType = params.get("widget");
  const encodedConfig = params.get("config");
  const parsedConfig = decodeConfig(encodedConfig);

  if (!widgetType || !widgets[widgetType] || !parsedConfig) {
    embedMount.innerHTML = `<section class="platform-widget"><p class="widget-copy">Invalid embed link. Return to the studio and generate a fresh URL.</p></section>`;
    return;
  }

  const config = mergeConfig(widgetType, parsedConfig);
  renderWidgetInto(embedMount, widgetType, config);
}

function renderWidgetPicker() {
  widgetPicker.innerHTML = "";

  Object.values(widgets).forEach((widget) => {
    const card = document.createElement("button");
    card.className = "widget-type-card";
    card.type = "button";

    if (widget.id === activeWidgetType) {
      card.classList.add("is-active");
    }

    card.innerHTML = `
      <p class="widget-type-kicker">${escapeHtml(widget.id)}</p>
      <p class="widget-type-title">${escapeHtml(widget.name)}</p>
      <p class="widget-copy">${escapeHtml(widget.description)}</p>
    `;

    card.addEventListener("click", () => {
      activeWidgetType = widget.id;
      activeVariationId = null;
      variationNameInput.value = "";
      currentConfig = mergeConfig(activeWidgetType, loadStudioStateForType(activeWidgetType));
      saveStudioState(currentConfig);
      renderStudio();
    });

    widgetPicker.appendChild(card);
  });
}

function renderBuilder() {
  const widget = widgets[activeWidgetType];
  builderTitle.textContent = `${widget.name} builder`;
  builderFields.innerHTML = "";

  widget.fields.forEach((field) => {
    builderFields.appendChild(createFieldElement(field, currentConfig[field.key]));
  });

  shareUrlInput.value = buildEmbedUrl(activeWidgetType, currentConfig);
  saveVariationButton.textContent = activeVariationId ? "Update variation" : "Save variation";
}

function createFieldElement(field, value) {
  const wrapper = document.createElement("label");
  wrapper.className = `field${field.type === "checkbox" ? " field-checkbox" : ""}`;

  if (field.type === "checkbox") {
    wrapper.innerHTML = `
      <input data-field-key="${field.key}" type="checkbox" ${value ? "checked" : ""} />
      <span class="field-label">${escapeHtml(field.label)}</span>
    `;
    return wrapper;
  }

  const helpMarkup = field.help ? `<p class="field-help">${escapeHtml(field.help)}</p>` : "";

  let inputMarkup = "";

  if (field.type === "textarea") {
    inputMarkup = `<textarea data-field-key="${field.key}" class="field-input field-textarea">${escapeHtml(value ?? "")}</textarea>`;
  } else if (field.type === "select") {
    const optionsMarkup = field.options
      .map((option) => `<option value="${escapeHtml(option.value)}" ${option.value === value ? "selected" : ""}>${escapeHtml(option.label)}</option>`)
      .join("");
    inputMarkup = `<select data-field-key="${field.key}" class="field-input">${optionsMarkup}</select>`;
  } else {
    const maxLength = field.maxLength ? `maxlength="${field.maxLength}"` : "";
    inputMarkup = `<input data-field-key="${field.key}" class="field-input" type="${field.type}" value="${escapeHtml(value ?? "")}" ${maxLength} />`;
  }

  wrapper.innerHTML = `
    <span class="field-label">${escapeHtml(field.label)}</span>
    ${inputMarkup}
    ${helpMarkup}
  `;

  return wrapper;
}

function renderPreview() {
  renderWidgetInto(previewMount, activeWidgetType, currentConfig);
  previewMeta.innerHTML = `
    <span class="widget-chip">${escapeHtml(widgets[activeWidgetType].name)}</span>
    <span class="widget-chip">${escapeHtml(titleCase(currentConfig.theme))}</span>
    <span class="widget-chip">${escapeHtml(titleCase(currentConfig.layout))}</span>
  `;
}

function renderWidgetInto(target, widgetType, config) {
  if (liveTimer) {
    window.clearInterval(liveTimer);
    liveTimer = null;
  }

  applyTheme(config);
  const widget = document.createElement("section");
  widget.className = "platform-widget";
  widget.dataset.layout = config.layout;
  widget.style.setProperty("--accent", config.accent);
  widget.style.setProperty("--accent-strong", resolveAccentStrong(config.accent));

  if (widgetType === "clock") {
    renderClockWidget(widget, config);
  } else if (widgetType === "countdown") {
    renderCountdownWidget(widget, config);
  } else if (widgetType === "quote") {
    renderQuoteWidget(widget, config);
  } else if (widgetType === "spotify") {
    renderSpotifyWidget(widget, config);
  }

  target.innerHTML = "";
  target.appendChild(widget);
}

function renderClockWidget(target, config) {
  const prompts = config.prompts.split("\n").map((item) => item.trim()).filter(Boolean);
  let promptIndex = 0;

  target.innerHTML = `
    <div class="platform-widget-header">
      <div>
        <p class="widget-eyebrow">${escapeHtml(config.label)}</p>
        <h2 class="widget-title">${escapeHtml(config.title)}</h2>
      </div>
      <span class="widget-chip">Live</span>
    </div>
    <p id="clockTime" class="clock-time">00:00</p>
    <p id="clockMeta" class="clock-meta"></p>
    <div class="widget-divider"></div>
    <div class="clock-prompt-card">
      <p class="widget-eyebrow">Focus prompt</p>
      <p id="clockPrompt" class="widget-copy">${escapeHtml(prompts[0] || "Add your own prompts in the builder.")}</p>
    </div>
    <div class="clock-actions">
      <button id="clockShuffleButton" class="widget-button" type="button">New prompt</button>
    </div>
  `;

  const timeElement = target.querySelector("#clockTime");
  const metaElement = target.querySelector("#clockMeta");
  const promptElement = target.querySelector("#clockPrompt");
  const shuffleButton = target.querySelector("#clockShuffleButton");

  shuffleButton.addEventListener("click", () => {
    if (prompts.length < 2) {
      return;
    }

    promptIndex = (promptIndex + 1) % prompts.length;
    promptElement.textContent = prompts[promptIndex];
  });

  const update = () => {
    const now = new Date();
    const hours = now.getHours();
    const displayHour = config.use24Hour ? hours : hours % 12 || 12;
    const period = hours >= 12 ? "PM" : "AM";
    const parts = [pad(displayHour), pad(now.getMinutes())];

    if (config.showSeconds) {
      parts.push(pad(now.getSeconds()));
    }

    timeElement.textContent = parts.join(":") + (config.use24Hour ? "" : ` ${period}`);
    metaElement.textContent = config.showDate
      ? now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
      : "Your time zone, live in Notion.";
  };

  update();
  liveTimer = window.setInterval(update, 1000);
}

function renderCountdownWidget(target, config) {
  target.innerHTML = `
    <div class="platform-widget-header">
      <div>
        <p class="countdown-label">${escapeHtml(config.label)}</p>
        <h2 class="countdown-title">${escapeHtml(config.title)}</h2>
      </div>
      <span class="widget-chip">Deadline</span>
    </div>
    <p id="countdownMeta" class="countdown-meta"></p>
    <div class="countdown-grid">
      <div class="countdown-unit"><span id="daysValue" class="countdown-value">0</span><span class="countdown-unit-label">Days</span></div>
      <div class="countdown-unit"><span id="hoursValue" class="countdown-value">0</span><span class="countdown-unit-label">Hours</span></div>
      <div class="countdown-unit"><span id="minutesValue" class="countdown-value">0</span><span class="countdown-unit-label">Minutes</span></div>
      <div class="countdown-unit"><span id="secondsValue" class="countdown-value">0</span><span class="countdown-unit-label">Seconds</span></div>
    </div>
  `;

  const metaElement = target.querySelector("#countdownMeta");
  const daysValue = target.querySelector("#daysValue");
  const hoursValue = target.querySelector("#hoursValue");
  const minutesValue = target.querySelector("#minutesValue");
  const secondsValue = target.querySelector("#secondsValue");

  const update = () => {
    const now = Date.now();
    const targetDate = new Date(config.targetDate).getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      daysValue.textContent = "0";
      hoursValue.textContent = "0";
      minutesValue.textContent = "0";
      secondsValue.textContent = "0";
      metaElement.textContent = config.completionText;
      return;
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysValue.textContent = String(days);
    hoursValue.textContent = pad(hours);
    minutesValue.textContent = pad(minutes);
    secondsValue.textContent = config.showSeconds ? pad(seconds) : "--";
    metaElement.textContent = `Target: ${new Date(config.targetDate).toLocaleString()}`;
  };

  update();
  liveTimer = window.setInterval(update, 1000);
}

function renderQuoteWidget(target, config) {
  target.innerHTML = `
    <div class="platform-widget-header">
      <div>
        <p class="quote-label">${escapeHtml(config.label)}</p>
      </div>
      <span class="widget-chip">Quote</span>
    </div>
    <div class="quote-card">
      <p class="quote-text">${escapeHtml(config.quote)}</p>
      <p class="quote-author">${escapeHtml(config.author)}</p>
    </div>
  `;
}

function renderSpotifyWidget(target, config) {
  const embedUrl = normalizeSpotifyEmbedUrl(config.spotifyUrl);

  if (!embedUrl) {
    target.innerHTML = `
      <div class="spotify-card-shell">
        <p class="widget-eyebrow">${escapeHtml(config.label)}</p>
        <h2 class="spotify-title">${escapeHtml(config.title)}</h2>
        <p class="spotify-subtitle">Paste a Spotify track, album, playlist, or podcast share link.</p>
      </div>
    `;
    return;
  }

  target.innerHTML = `
    <div class="platform-widget-header">
      <div>
        <p class="widget-eyebrow">${escapeHtml(config.label)}</p>
        <h2 class="spotify-title">${escapeHtml(config.title)}</h2>
      </div>
      <span class="widget-chip">Spotify</span>
    </div>
    <p class="spotify-subtitle">${escapeHtml(config.note)}</p>
    <div class="widget-divider"></div>
    <iframe
      class="spotify-embed"
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      src="${escapeHtml(embedUrl)}"
    ></iframe>
  `;
}

function renderVariations() {
  variationEmptyState.classList.toggle("is-hidden", savedVariations.length > 0);
  savedVariationsList.innerHTML = "";

  savedVariations.forEach((variation) => {
    const card = document.createElement("article");
    card.className = "saved-widget";

    if (variation.id === activeVariationId) {
      card.classList.add("is-active");
    }

    card.innerHTML = `
      <div class="saved-widget-top">
        <div>
          <p class="saved-widget-name">${escapeHtml(variation.name)}</p>
          <p class="saved-widget-subtext">${escapeHtml(widgets[variation.type].name)} ready for Notion embed.</p>
        </div>
        <div class="saved-widget-tags">
          <span class="saved-widget-tag">${escapeHtml(titleCase(variation.config.theme))}</span>
          <span class="saved-widget-tag">${escapeHtml(titleCase(variation.config.layout))}</span>
        </div>
      </div>
      <div class="saved-widget-actions">
        <button class="ghost-button" type="button" data-action="load">Load</button>
        <button class="secondary-button" type="button" data-action="copy">Copy link</button>
        <button class="secondary-button" type="button" data-action="delete">Delete</button>
      </div>
    `;

    card.addEventListener("click", async (event) => {
      const action = event.target.dataset.action;

      if (!action) {
        return;
      }

      if (action === "load") {
        loadVariation(variation.id);
      }

      if (action === "copy") {
        shareUrlInput.value = buildEmbedUrl(variation.type, variation.config);
        await copyInputValue(shareUrlInput, copyLinkButton, "Copy embed URL");
      }

      if (action === "delete") {
        deleteVariation(variation.id);
      }
    });

    savedVariationsList.appendChild(card);
  });
}

function buildEmbedUrl(widgetType, config) {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("mode", "embed");
  url.searchParams.set("widget", widgetType);
  url.searchParams.set("config", encodeConfig(config));
  return url.toString();
}

function mergeConfig(widgetType, partialConfig) {
  return {
    ...structuredClone(widgets[widgetType].defaults),
    ...(partialConfig || {})
  };
}

function applyTheme(config) {
  const theme = themes[config.theme] || themes.warm;
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty("--page-top", theme.pageTop);
  rootStyle.setProperty("--page-bottom", theme.pageBottom);
  rootStyle.setProperty("--panel", theme.panel);
  rootStyle.setProperty("--panel-strong", theme.panelStrong);
  rootStyle.setProperty("--panel-border", theme.panelBorder);
  rootStyle.setProperty("--text-strong", theme.textStrong);
  rootStyle.setProperty("--text-soft", theme.textSoft);
  rootStyle.setProperty("--accent", config.accent);
  rootStyle.setProperty("--accent-strong", theme.accentStrong);
  rootStyle.setProperty("--widget-card", theme.widgetCard);
  rootStyle.setProperty("--shadow", theme.shadow);
}

function resolveAccentStrong(hex) {
  const value = hex.replace("#", "");
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);
  return `rgb(${Math.max(red - 42, 0)} ${Math.max(green - 42, 0)} ${Math.max(blue - 42, 0)})`;
}

function encodeConfig(config) {
  const json = JSON.stringify(config);
  const bytes = new TextEncoder().encode(json);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function decodeConfig(encoded) {
  if (!encoded) {
    return null;
  }

  try {
    const normalized = encoded.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function loadStudioState() {
  try {
    const raw = window.localStorage.getItem("notion-widget-studio-state");
    const parsed = raw ? JSON.parse(raw) : null;

    if (parsed?.type && widgets[parsed.type]) {
      return {
        type: parsed.type,
        config: parsed.config
      };
    }
  } catch {
    return {
      type: "clock",
      config: null
    };
  }

  return {
    type: "clock",
    config: null
  };
}

function loadStudioStateForType(widgetType) {
  try {
    const raw = window.localStorage.getItem("notion-widget-studio-state");
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.type === widgetType) {
      return parsed.config;
    }
  } catch {
    return null;
  }

  return null;
}

function saveStudioState(config) {
  window.localStorage.setItem(
    "notion-widget-studio-state",
    JSON.stringify({ type: activeWidgetType, config })
  );
}

function loadSavedVariations() {
  try {
    const raw = window.localStorage.getItem("notion-widget-variation-library");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => widgets[item.type]) : [];
  } catch {
    return [];
  }
}

function persistVariations() {
  window.localStorage.setItem("notion-widget-variation-library", JSON.stringify(savedVariations));
}

function saveCurrentVariation() {
  syncConfigFromForm();

  const variationName = variationNameInput.value.trim() || `${widgets[activeWidgetType].name} ${savedVariations.length + 1}`;

  if (activeVariationId) {
    savedVariations = savedVariations.map((variation) =>
      variation.id === activeVariationId
        ? { ...variation, name: variationName, type: activeWidgetType, config: structuredClone(currentConfig) }
        : variation
    );
  } else {
    activeVariationId = createId();
    savedVariations.unshift({
      id: activeVariationId,
      name: variationName,
      type: activeWidgetType,
      config: structuredClone(currentConfig)
    });
  }

  variationNameInput.value = variationName;
  persistVariations();
  renderStudio();
}

function loadVariation(variationId) {
  const variation = savedVariations.find((item) => item.id === variationId);

  if (!variation) {
    return;
  }

  activeVariationId = variation.id;
  activeWidgetType = variation.type;
  currentConfig = mergeConfig(activeWidgetType, variation.config);
  variationNameInput.value = variation.name;
  saveStudioState(currentConfig);
  renderStudio();
}

function deleteVariation(variationId) {
  savedVariations = savedVariations.filter((item) => item.id !== variationId);

  if (activeVariationId === variationId) {
    activeVariationId = null;
    variationNameInput.value = "";
  }

  persistVariations();
  renderStudio();
}

function syncConfigFromForm() {
  const widget = widgets[activeWidgetType];
  const nextConfig = structuredClone(currentConfig);

  widget.fields.forEach((field) => {
    const element = builderFields.querySelector(`[data-field-key="${field.key}"]`);

    if (!element) {
      return;
    }

    if (field.type === "checkbox") {
      nextConfig[field.key] = element.checked;
      return;
    }

    nextConfig[field.key] = element.value;
  });

  currentConfig = mergeConfig(activeWidgetType, nextConfig);
  saveStudioState(currentConfig);
}

function normalizeSpotifyEmbedUrl(value) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);

    if (url.hostname.includes("spotify.com")) {
      const segments = url.pathname.split("/").filter(Boolean);

      if (segments[0] === "embed") {
        return `https://open.spotify.com${url.pathname}`;
      }

      if (segments.length >= 2) {
        return `https://open.spotify.com/embed/${segments[0]}/${segments[1]}?utm_source=generator`;
      }
    }
  } catch {
    return "";
  }

  return "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function createId() {
  return `widget-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

async function copyInputValue(input, button, idleText) {
  input.select();

  try {
    await navigator.clipboard.writeText(input.value);
  } catch {
    document.execCommand("copy");
  }

  button.textContent = "Copied";
  window.setTimeout(() => {
    button.textContent = idleText;
  }, 1200);
}

builderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  activeVariationId = null;
  syncConfigFromForm();
  renderStudio();
});

copyLinkButton.addEventListener("click", async () => {
  syncConfigFromForm();
  shareUrlInput.value = buildEmbedUrl(activeWidgetType, currentConfig);
  await copyInputValue(shareUrlInput, copyLinkButton, "Copy embed URL");
});

saveVariationButton.addEventListener("click", saveCurrentVariation);

resetButton.addEventListener("click", () => {
  activeVariationId = null;
  variationNameInput.value = "";
  currentConfig = structuredClone(widgets[activeWidgetType].defaults);
  saveStudioState(currentConfig);
  renderStudio();
});

newVariationButton.addEventListener("click", () => {
  activeVariationId = null;
  variationNameInput.value = "";
  currentConfig = structuredClone(widgets[activeWidgetType].defaults);
  saveStudioState(currentConfig);
  renderStudio();
});