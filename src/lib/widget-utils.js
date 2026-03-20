import { widgetCatalog } from "@/src/lib/widget-definitions";

export function applyThemeVariables(config, type) {
  if (type === "clock") {
    return {
      "--text-strong": "#37352f",
      "--text-soft": "#787774",
      "--accent": config.accent,
      "--accent-strong": "#37352f"
    };
  }

  if (type === "countdown") {
    return {
      "--text-strong": "#37352f",
      "--text-soft": "#787774",
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

  return `${baseUrl}?embed=1&widget=${type}&config=${encodeWidgetConfig(config)}`;
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