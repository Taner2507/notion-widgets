import { widgetCatalog } from "@/src/lib/widget-definitions";

export function applyThemeVariables(config, type) {
  const colorTokens = resolveWidgetColorTokens(config);

  if (type === "clock") {
    return {
      "--widget-text-strong": colorTokens.textStrong,
      "--widget-text-soft": colorTokens.textSoft,
      "--widget-surface-bg": colorTokens.surfaceBg,
      "--widget-surface-border": colorTokens.surfaceBorder,
      "--widget-border-color": colorTokens.borderColor,
      "--text-strong": "var(--widget-text-strong)",
      "--text-soft": "var(--widget-text-soft)",
      "--accent": config.accent,
      "--accent-strong": "var(--widget-text-strong)"
    };
  }

  if (type === "countdown") {
    return {
      "--widget-text-strong": colorTokens.textStrong,
      "--widget-text-soft": colorTokens.textSoft,
      "--widget-surface-bg": colorTokens.surfaceBg,
      "--widget-surface-border": colorTokens.surfaceBorder,
      "--widget-border-color": colorTokens.borderColor,
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

function resolveWidgetColorTokens(config) {
  const preset = resolveNotionBackgroundPreset(config.backgroundPreset);
  const surfaceBg = preset ? preset.background : (config.backgroundColor || "#FFFFFF");
  const textStrong = config.textColor || (preset ? preset.text : "#2f2e2a");
  const surfaceBorder = resolveSurfaceBorder(surfaceBg);
  const borderColor = config.showHairline
    ? `color-mix(in srgb, ${textStrong} 22%, transparent)`
    : surfaceBorder;

  return {
    surfaceBg,
    surfaceBorder,
    borderColor,
    textStrong,
    textSoft: `color-mix(in srgb, ${textStrong} 68%, ${surfaceBg})`
  };
}

function resolveNotionBackgroundPreset(backgroundPreset) {
  switch (backgroundPreset) {
    case "transparent":
      return {
        background: "transparent",
        text: "var(--widget-auto-text-strong, #2f2e2a)"
      };
    case "light-page":
      return {
        background: "#FFFFFF",
        text: "#2f2e2a"
      };
    case "light-sidebar":
      return {
        background: "#F7F6F3",
        text: "#2f2e2a"
      };
    case "dark-page":
      return {
        background: "#191919",
        text: "#f1f1ef"
      };
    case "dark-sidebar":
      return {
        background: "#2F3438",
        text: "#f1f1ef"
      };
    case "dark-sidebar-alt":
      return {
        background: "#373C3F",
        text: "#f1f1ef"
      };
    default:
      return null;
  }
}

function resolveSurfaceBorder(background) {
  if (background === "transparent") {
    return "transparent";
  }

  return `color-mix(in srgb, ${background} 84%, #000000)`;
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