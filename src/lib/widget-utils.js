import { widgetCatalog } from "@/src/lib/widget-definitions";

export function applyThemeVariables(config, type) {
  const themeTokens = resolveWidgetThemeTokens(config.themeMode);
  const surfaceTokens = resolveWidgetSurfaceTokens(config.surfaceMode, config.themeMode);

  if (type === "clock") {
    return {
      "--widget-text-strong": themeTokens.textStrong,
      "--widget-text-soft": themeTokens.textSoft,
      "--widget-surface-bg": surfaceTokens.surfaceBg,
      "--widget-surface-border": surfaceTokens.surfaceBorder,
      "--text-strong": "var(--widget-text-strong)",
      "--text-soft": "var(--widget-text-soft)",
      "--accent": config.accent,
      "--accent-strong": "var(--widget-text-strong)"
    };
  }

  if (type === "countdown") {
    return {
      "--widget-text-strong": themeTokens.textStrong,
      "--widget-text-soft": themeTokens.textSoft,
      "--widget-surface-bg": surfaceTokens.surfaceBg,
      "--widget-surface-border": surfaceTokens.surfaceBorder,
      "--text-strong": "var(--widget-text-strong)",
      "--text-soft": "var(--widget-text-soft)",
      "--accent": config.accent,
      "--accent-strong": resolveAccentStrong(config.accent)
    };
  }

  return {
    "--text-strong": "#eef5ff",
    "--text-soft": "#afc1d4",
    "--accent": config.accent,
    "--accent-strong": resolveAccentStrong(config.accent)
  };
}

function resolveWidgetThemeTokens(themeMode) {
  if (themeMode === "light") {
    return { textStrong: "#2f2e2a", textSoft: "#6d6a64" };
  }

  if (themeMode === "dark") {
    return { textStrong: "#f1f1ef", textSoft: "#a7a6a2" };
  }

  return {
    textStrong: "var(--widget-auto-text-strong, #2f2e2a)",
    textSoft: "var(--widget-auto-text-soft, #6d6a64)"
  };
}

function resolveWidgetSurfaceTokens(surfaceMode, themeMode) {
  if (surfaceMode === "transparent") {
    return { surfaceBg: "transparent", surfaceBorder: "transparent" };
  }

  if (themeMode === "dark") {
    if (surfaceMode === "card") {
      return { surfaceBg: "#262522", surfaceBorder: "#3c3b37" };
    }

    return { surfaceBg: "#2b2a26cc", surfaceBorder: "#3c3b3799" };
  }

  if (themeMode === "light") {
    if (surfaceMode === "card") {
      return { surfaceBg: "#f4f3f1", surfaceBorder: "#e6e3de" };
    }

    return { surfaceBg: "#f4f3f1cc", surfaceBorder: "#e6e3de99" };
  }

  if (surfaceMode === "card") {
    return {
      surfaceBg: "var(--widget-auto-surface-bg-card, #f4f3f1)",
      surfaceBorder: "var(--widget-auto-surface-border-card, #e6e3de)"
    };
  }

  return {
    surfaceBg: "var(--widget-auto-surface-bg-soft, #f4f3f1cc)",
    surfaceBorder: "var(--widget-auto-surface-border-soft, #e6e3de99)"
  };
}

export function resolveAccentStrong(hex) {
  const safeHex = String(hex || "#d56c37").replace("#", "");
  const red = parseInt(safeHex.slice(0, 2) || "d5", 16);
  const green = parseInt(safeHex.slice(2, 4) || "6c", 16);
  const blue = parseInt(safeHex.slice(4, 6) || "37", 16);

  return `rgb(${Math.max(red - 42, 0)} ${Math.max(green - 42, 0)} ${Math.max(blue - 42, 0)})`;
}

export function encodeWidgetConfig(config) {
  const bytes = new TextEncoder().encode(JSON.stringify(config));
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function decodeWidgetConfig(encodedConfig) {
  if (!encodedConfig) {
    return null;
  }

  try {
    const normalized = encodedConfig.replaceAll("-", "+").replaceAll("_", "/");
    const padding = normalized.length % 4;
    const padded = normalized + (padding ? "=".repeat(4 - padding) : "");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

export function normalizeSpotifyEmbedUrl(value) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);

    if (!url.hostname.includes("spotify.com")) {
      return "";
    }

    const segments = url.pathname.split("/").filter(Boolean);

    if (segments[0] === "embed") {
      return `https://open.spotify.com${url.pathname}${url.search}`;
    }

    if (segments.length >= 2) {
      return `https://open.spotify.com/embed/${segments[0]}/${segments[1]}?utm_source=generator`;
    }
  } catch {
    return "";
  }

  return "";
}

export function buildEmbedUrl(baseUrl, type, config) {
  if (!baseUrl) {
    return "";
  }
  const url = new URL(`/embed/${type}`, baseUrl);
  url.searchParams.set("config", encodeWidgetConfig(config));
  return url.toString();
}

export function createSavedWidgetId() {
  return `widget-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function getSavedWidgetsStorageKey() {
  return "notion-widget-platform/widgets";
}

export function getStudioStateStorageKey() {
  return "notion-widget-platform/studio-state";
}

export function getWidgetSummary(savedWidgets) {
  const widgetCounts = Object.keys(widgetCatalog).reduce((counts, key) => {
    counts[key] = savedWidgets.filter((widget) => widget.type === key).length;
    return counts;
  }, {});

  return {
    total: savedWidgets.length,
    widgetCounts
  };
}

export function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}