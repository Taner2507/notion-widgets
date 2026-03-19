const defaultSettings = {
  eyebrow: "Notion Embed Widget",
  theme: "warm",
  variant: "classic",
  accent: "#c96f3b",
  showSeconds: false,
  use24Hour: false,
  showDate: true,
  prompts: [
    "Pick one meaningful task and finish it before opening anything new.",
    "Make the next 25 minutes distraction-free.",
    "Ship the smallest complete version, not the biggest idea.",
    "Clear one stubborn task you have been postponing.",
    "Protect your energy by doing the hard part first."
  ]
};

const themeMap = {
  warm: {
    bgTop: "#f6efe4",
    bgBottom: "#f7fbff",
    card: "rgba(255, 252, 246, 0.88)",
    panel: "rgba(255, 255, 255, 0.72)",
    cardBorder: "rgba(113, 90, 59, 0.12)",
    textStrong: "#1f2933",
    textSoft: "#5c6670",
    accentDeep: "#7e4020",
    shadow: "0 24px 60px rgba(70, 52, 28, 0.14)"
  },
  ocean: {
    bgTop: "#e3f4ff",
    bgBottom: "#eefaf4",
    card: "rgba(246, 252, 255, 0.82)",
    panel: "rgba(241, 250, 255, 0.75)",
    cardBorder: "rgba(47, 94, 127, 0.14)",
    textStrong: "#173042",
    textSoft: "#507083",
    accentDeep: "#12506c",
    shadow: "0 24px 60px rgba(26, 74, 94, 0.16)"
  },
  forest: {
    bgTop: "#edf6ea",
    bgBottom: "#f6f3e8",
    card: "rgba(250, 255, 248, 0.84)",
    panel: "rgba(249, 252, 245, 0.76)",
    cardBorder: "rgba(78, 107, 71, 0.14)",
    textStrong: "#1f3126",
    textSoft: "#566a58",
    accentDeep: "#365b33",
    shadow: "0 24px 60px rgba(54, 80, 49, 0.15)"
  },
  midnight: {
    bgTop: "#151d2d",
    bgBottom: "#24334a",
    card: "rgba(12, 20, 35, 0.72)",
    panel: "rgba(13, 24, 41, 0.74)",
    cardBorder: "rgba(165, 193, 229, 0.14)",
    textStrong: "#eef5ff",
    textSoft: "#adc0d6",
    accentDeep: "#ffd0aa",
    shadow: "0 24px 60px rgba(3, 8, 17, 0.42)"
  }
};

const clockElement = document.getElementById("clock");
const periodElement = document.getElementById("period");
const dateTextElement = document.getElementById("dateText");
const todayLabelElement = document.getElementById("todayLabel");
const focusTextElement = document.getElementById("focusText");
const shuffleButton = document.getElementById("shuffleButton");
const eyebrowElement = document.getElementById("eyebrow");
const widgetCardElement = document.getElementById("widgetCard");
const settingsPanel = document.getElementById("settingsPanel");
const settingsForm = document.getElementById("settingsForm");
const toggleSettingsButton = document.getElementById("toggleSettingsButton");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const resetButton = document.getElementById("resetButton");
const copyLinkButton = document.getElementById("copyLinkButton");
const shareUrlInput = document.getElementById("shareUrlInput");

const eyebrowInput = document.getElementById("eyebrowInput");
const themeSelect = document.getElementById("themeSelect");
const variantSelect = document.getElementById("variantSelect");
const accentInput = document.getElementById("accentInput");
const showSecondsInput = document.getElementById("showSecondsInput");
const use24HourInput = document.getElementById("use24HourInput");
const showDateInput = document.getElementById("showDateInput");
const promptsInput = document.getElementById("promptsInput");
const variationNameInput = document.getElementById("variationNameInput");
const saveVariationButton = document.getElementById("saveVariationButton");
const newVariationButton = document.getElementById("newVariationButton");
const variationEmptyState = document.getElementById("variationEmptyState");
const savedVariationsList = document.getElementById("savedVariationsList");

let currentSettings = buildInitialSettings();
let currentPromptIndex = 0;
let activeVariationId = null;
let savedVariations = loadSavedVariations();

function padTime(value) {
  return String(value).padStart(2, "0");
}

function buildInitialSettings() {
  const storedSettings = loadStoredSettings();
  const urlSettings = loadUrlSettings();

  return mergeSettings(defaultSettings, storedSettings, urlSettings);
}

function loadStoredSettings() {
  try {
    const rawSettings = window.localStorage.getItem("notion-widget-settings");
    return rawSettings ? JSON.parse(rawSettings) : {};
  } catch {
    return {};
  }
}

function loadUrlSettings() {
  const params = new URLSearchParams(window.location.search);
  const promptParam = params.get("prompts");
  const prompts = promptParam
    ? promptParam
        .split("|")
        .map((prompt) => prompt.trim())
        .filter(Boolean)
    : undefined;

  return {
    eyebrow: params.get("label") || undefined,
    theme: params.get("theme") || undefined,
    variant: params.get("variant") || undefined,
    accent: params.get("accent") || undefined,
    showSeconds: parseBooleanParam(params.get("seconds")),
    use24Hour: parseBooleanParam(params.get("twentyFourHour")),
    showDate: parseBooleanParam(params.get("date")),
    prompts
  };
}

function parseBooleanParam(value) {
  if (value === null) {
    return undefined;
  }

  return value === "1" || value === "true";
}

function mergeSettings(...settingObjects) {
  const merged = structuredClone(defaultSettings);

  for (const candidate of settingObjects) {
    if (!candidate) {
      continue;
    }

    if (typeof candidate.eyebrow === "string" && candidate.eyebrow.trim()) {
      merged.eyebrow = candidate.eyebrow.trim();
    }

    if (typeof candidate.theme === "string" && themeMap[candidate.theme]) {
      merged.theme = candidate.theme;
    }

    if (
      typeof candidate.variant === "string" &&
      ["classic", "compact", "spotlight"].includes(candidate.variant)
    ) {
      merged.variant = candidate.variant;
    }

    if (typeof candidate.accent === "string" && /^#[0-9a-fA-F]{6}$/.test(candidate.accent)) {
      merged.accent = candidate.accent;
    }

    if (typeof candidate.showSeconds === "boolean") {
      merged.showSeconds = candidate.showSeconds;
    }

    if (typeof candidate.use24Hour === "boolean") {
      merged.use24Hour = candidate.use24Hour;
    }

    if (typeof candidate.showDate === "boolean") {
      merged.showDate = candidate.showDate;
    }

    if (Array.isArray(candidate.prompts) && candidate.prompts.length > 0) {
      merged.prompts = candidate.prompts.map((prompt) => String(prompt).trim()).filter(Boolean);
    }
  }

  return merged;
}

function saveSettings(settings) {
  window.localStorage.setItem("notion-widget-settings", JSON.stringify(settings));
}

function loadSavedVariations() {
  try {
    const rawVariations = window.localStorage.getItem("notion-widget-variations");
    const parsedVariations = rawVariations ? JSON.parse(rawVariations) : [];

    if (!Array.isArray(parsedVariations)) {
      return [];
    }

    return parsedVariations
      .map((variation) => ({
        id: typeof variation.id === "string" ? variation.id : createVariationId(),
        name:
          typeof variation.name === "string" && variation.name.trim()
            ? variation.name.trim()
            : "Untitled variation",
        settings: mergeSettings(defaultSettings, variation.settings)
      }))
      .filter((variation) => Array.isArray(variation.settings.prompts) && variation.settings.prompts.length > 0);
  } catch {
    return [];
  }
}

function persistVariations() {
  window.localStorage.setItem("notion-widget-variations", JSON.stringify(savedVariations));
}

function createVariationId() {
  return `variation-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function applyTheme(settings) {
  const rootStyle = document.documentElement.style;
  const theme = themeMap[settings.theme] || themeMap.warm;

  rootStyle.setProperty("--bg-top", theme.bgTop);
  rootStyle.setProperty("--bg-bottom", theme.bgBottom);
  rootStyle.setProperty("--card", theme.card);
  rootStyle.setProperty("--panel", theme.panel);
  rootStyle.setProperty("--card-border", theme.cardBorder);
  rootStyle.setProperty("--text-strong", theme.textStrong);
  rootStyle.setProperty("--text-soft", theme.textSoft);
  rootStyle.setProperty("--accent", settings.accent);
  rootStyle.setProperty("--accent-deep", theme.accentDeep);
  rootStyle.setProperty("--shadow", theme.shadow);
}

function renderSettings(settings) {
  eyebrowElement.textContent = settings.eyebrow;
  dateTextElement.classList.toggle("is-hidden", !settings.showDate);
  periodElement.classList.toggle("is-hidden", settings.use24Hour);
  widgetCardElement.dataset.variant = settings.variant;

  if (settings.prompts.length > 0) {
    currentPromptIndex %= settings.prompts.length;
    focusTextElement.textContent = settings.prompts[currentPromptIndex];
  }

  eyebrowInput.value = settings.eyebrow;
  themeSelect.value = settings.theme;
  variantSelect.value = settings.variant;
  accentInput.value = settings.accent;
  showSecondsInput.checked = settings.showSeconds;
  use24HourInput.checked = settings.use24Hour;
  showDateInput.checked = settings.showDate;
  promptsInput.value = settings.prompts.join("\n");
  shareUrlInput.value = buildShareUrl(settings);
  saveVariationButton.textContent = activeVariationId ? "Update variation" : "Save variation";

  applyTheme(settings);
  updateClock();
}

function buildShareUrl(settings) {
  const shareUrl = new URL(window.location.href);
  shareUrl.search = "";

  shareUrl.searchParams.set("label", settings.eyebrow);
  shareUrl.searchParams.set("theme", settings.theme);
  shareUrl.searchParams.set("variant", settings.variant);
  shareUrl.searchParams.set("accent", settings.accent);
  shareUrl.searchParams.set("seconds", String(settings.showSeconds));
  shareUrl.searchParams.set("twentyFourHour", String(settings.use24Hour));
  shareUrl.searchParams.set("date", String(settings.showDate));
  shareUrl.searchParams.set("prompts", settings.prompts.join("|"));

  return shareUrl.toString();
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const isAfternoon = hours >= 12;
  const displayHour = currentSettings.use24Hour ? hours : hours % 12 || 12;
  const timeParts = [padTime(displayHour), padTime(minutes)];

  if (currentSettings.showSeconds) {
    timeParts.push(padTime(seconds));
  }

  clockElement.textContent = timeParts.join(":");
  periodElement.textContent = isAfternoon ? "PM" : "AM";

  dateTextElement.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  todayLabelElement.textContent = now.toLocaleDateString(undefined, {
    weekday: "long"
  });
}

function shufflePrompt() {
  if (currentSettings.prompts.length < 2) {
    return;
  }

  let nextIndex = currentPromptIndex;

  while (nextIndex === currentPromptIndex) {
    nextIndex = Math.floor(Math.random() * currentSettings.prompts.length);
  }

  currentPromptIndex = nextIndex;
  focusTextElement.textContent = currentSettings.prompts[currentPromptIndex];
}

function readFormSettings() {
  return mergeSettings(currentSettings, {
    eyebrow: eyebrowInput.value,
    theme: themeSelect.value,
    variant: variantSelect.value,
    accent: accentInput.value,
    showSeconds: showSecondsInput.checked,
    use24Hour: use24HourInput.checked,
    showDate: showDateInput.checked,
    prompts: promptsInput.value
      .split("\n")
      .map((prompt) => prompt.trim())
      .filter(Boolean)
  });
}

function toggleSettings(forceOpen) {
  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : settingsPanel.hidden;
  settingsPanel.hidden = !shouldOpen;
  toggleSettingsButton.setAttribute("aria-expanded", String(shouldOpen));
}

function renderVariations() {
  savedVariationsList.innerHTML = "";
  variationEmptyState.classList.toggle("is-hidden", savedVariations.length > 0);

  for (const variation of savedVariations) {
    const item = document.createElement("article");
    item.className = "variation-item";
    item.dataset.variationId = variation.id;

    if (variation.id === activeVariationId) {
      item.classList.add("is-selected");
    }

    const promptCount = variation.settings.prompts.length;

    item.innerHTML = `
      <div class="variation-item-top">
        <p class="variation-name">${escapeHtml(variation.name)}</p>
        <div class="variation-meta">
          <span class="variation-chip">${escapeHtml(titleCase(variation.settings.theme))}</span>
          <span class="variation-chip">${escapeHtml(titleCase(variation.settings.variant))}</span>
          <span class="variation-chip">${promptCount} prompt${promptCount === 1 ? "" : "s"}</span>
        </div>
      </div>
      <div class="variation-item-actions">
        <button class="ghost-button" type="button" data-action="use">Load</button>
        <button class="secondary-button" type="button" data-action="copy">Copy link</button>
        <button class="secondary-button" type="button" data-action="delete">Delete</button>
      </div>
    `;

    savedVariationsList.appendChild(item);
  }
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

function resetVariationDraft() {
  activeVariationId = null;
  variationNameInput.value = "";
  renderSettings(currentSettings);
  renderVariations();
}

function saveCurrentVariation() {
  currentSettings = readFormSettings();
  saveSettings(currentSettings);
  renderSettings(currentSettings);

  const variationName = variationNameInput.value.trim() || `Variation ${savedVariations.length + 1}`;

  if (activeVariationId) {
    savedVariations = savedVariations.map((variation) =>
      variation.id === activeVariationId
        ? {
            ...variation,
            name: variationName,
            settings: structuredClone(currentSettings)
          }
        : variation
    );
  } else {
    activeVariationId = createVariationId();
    savedVariations.unshift({
      id: activeVariationId,
      name: variationName,
      settings: structuredClone(currentSettings)
    });
  }

  variationNameInput.value = variationName;
  persistVariations();
  renderSettings(currentSettings);
  renderVariations();
}

async function copyVariationLink(variationId) {
  const variation = savedVariations.find((item) => item.id === variationId);

  if (!variation) {
    return;
  }

  shareUrlInput.value = buildShareUrl(variation.settings);
  await copyShareUrl();
}

function loadVariation(variationId) {
  const variation = savedVariations.find((item) => item.id === variationId);

  if (!variation) {
    return;
  }

  activeVariationId = variation.id;
  currentSettings = mergeSettings(defaultSettings, variation.settings);
  currentPromptIndex = 0;
  variationNameInput.value = variation.name;
  saveSettings(currentSettings);
  renderSettings(currentSettings);
  renderVariations();
}

function deleteVariation(variationId) {
  const variation = savedVariations.find((item) => item.id === variationId);

  if (!variation) {
    return;
  }

  savedVariations = savedVariations.filter((item) => item.id !== variationId);

  if (activeVariationId === variationId) {
    activeVariationId = null;
    variationNameInput.value = "";
  }

  persistVariations();
  renderSettings(currentSettings);
  renderVariations();
}

async function copyShareUrl() {
  shareUrlInput.select();

  try {
    await navigator.clipboard.writeText(shareUrlInput.value);
    copyLinkButton.textContent = "Copied";
  } catch {
    document.execCommand("copy");
    copyLinkButton.textContent = "Copied";
  }

  window.setTimeout(() => {
    copyLinkButton.textContent = "Copy embed URL";
  }, 1200);
}

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentSettings = readFormSettings();
  currentPromptIndex = 0;
  activeVariationId = null;
  variationNameInput.value = "";
  saveSettings(currentSettings);
  renderSettings(currentSettings);
  renderVariations();
});

resetButton.addEventListener("click", () => {
  currentSettings = structuredClone(defaultSettings);
  currentPromptIndex = 0;
  activeVariationId = null;
  window.localStorage.removeItem("notion-widget-settings");
  variationNameInput.value = "";
  renderSettings(currentSettings);
  renderVariations();
});

toggleSettingsButton.addEventListener("click", () => {
  toggleSettings();
});

closeSettingsButton.addEventListener("click", () => {
  toggleSettings(false);
});

copyLinkButton.addEventListener("click", copyShareUrl);
shuffleButton.addEventListener("click", shufflePrompt);
saveVariationButton.addEventListener("click", saveCurrentVariation);
newVariationButton.addEventListener("click", resetVariationDraft);

savedVariationsList.addEventListener("click", async (event) => {
  const actionButton = event.target.closest("button[data-action]");

  if (!actionButton) {
    return;
  }

  const variationId = actionButton.closest(".variation-item")?.dataset.variationId;

  if (!variationId) {
    return;
  }

  if (actionButton.dataset.action === "use") {
    loadVariation(variationId);
    return;
  }

  if (actionButton.dataset.action === "copy") {
    await copyVariationLink(variationId);
    return;
  }

  if (actionButton.dataset.action === "delete") {
    deleteVariation(variationId);
  }
});

renderSettings(currentSettings);
renderVariations();
updateClock();
setInterval(updateClock, 1000);