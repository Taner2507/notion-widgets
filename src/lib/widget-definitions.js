export const widgetCatalog = {
  clock: {
    id: "clock",
    name: "Focus Clock",
    icon: "◴",
    description: "A clean, minimal date and time display for Notion.",
    defaults: {
      layout: "classic",
      accent: "#37352f",
      showSeconds: false,
      use24Hour: false,
      visualStyle: "notion",
      motionStyle: "soft",
      themeMode: "auto",
      surfaceMode: "transparent"
    },
    fields: [
      { key: "layout", label: "Layout", type: "select", options: layoutOptions },
      { key: "accent", label: "Accent color", type: "color" },
      { key: "showSeconds", label: "Show seconds", type: "checkbox" },
      { key: "use24Hour", label: "Use 24-hour time", type: "checkbox" },
      { key: "visualStyle", label: "Clock style", type: "select", options: clockStyleOptions },
      { key: "motionStyle", label: "Motion", type: "select", options: clockMotionOptions },
      { key: "themeMode", label: "Theme", type: "select", options: widgetThemeOptions },
      { key: "surfaceMode", label: "Surface", type: "select", options: widgetSurfaceOptions }
    ]
  },
  countdown: {
    id: "countdown",
    name: "Countdown",
    icon: "◷",
    description: "A clean countdown with responsive layouts and subtle motion.",
    defaults: {
      label: "Countdown",
      title: "Big Moment",
      layout: "spotlight",
      accent: "#2383e2",
      targetDate: getDefaultFutureDate(),
      metaPrefix: "target",
      showSeconds: false,
      completionText: "It is live.",
      visualStyle: "notion",
      motionStyle: "soft",
      themeMode: "auto",
      surfaceMode: "transparent"
    },
    fields: [
      { key: "label", label: "Top label", type: "text", maxLength: 40 },
      { key: "title", label: "Title", type: "text", maxLength: 40 },
      { key: "layout", label: "Layout", type: "select", options: layoutOptions },
      { key: "accent", label: "Accent color", type: "color" },
      { key: "targetDate", label: "Target date", type: "datetime-local" },
      { key: "metaPrefix", label: "Label", type: "select", options: countdownPrefixOptions },
      { key: "showSeconds", label: "Show seconds", type: "checkbox" },
      { key: "completionText", label: "Completion message", type: "text", maxLength: 60 },
      { key: "visualStyle", label: "Countdown style", type: "select", options: countdownStyleOptions },
      { key: "motionStyle", label: "Motion", type: "select", options: countdownMotionOptions },
      { key: "themeMode", label: "Theme", type: "select", options: widgetThemeOptions },
      { key: "surfaceMode", label: "Surface", type: "select", options: widgetSurfaceOptions }
    ]
  },
  quote: {
    id: "quote",
    name: "Quote Card",
    icon: "❝",
    description: "A minimal quote block for dashboards and journal covers.",
    defaults: {
      label: "Daily Quote",
      quote: "Consistency is what transforms average into excellence.",
      author: "Robin Sharma",
      layout: "classic",
      accent: "#56863f"
    },
    fields: [
      { key: "label", label: "Top label", type: "text", maxLength: 40 },
      { key: "quote", label: "Quote", type: "textarea", help: "Keep it short for narrow embeds." },
      { key: "author", label: "Author", type: "text", maxLength: 40 },
      { key: "layout", label: "Layout", type: "select", options: layoutOptions },
      { key: "accent", label: "Accent color", type: "color" }
    ]
  },
  spotify: {
    id: "spotify",
    name: "Spotify Player",
    icon: "♫",
    description: "A compact player card with full controls for Notion.",
    defaults: {
      label: "Now Playing",
      title: "Spotify Pick",
      artist: "Artist name",
      spotifyUrl: "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P",
      artworkUrl: "",
      elapsedLabel: "1:24",
      durationLabel: "4:39",
      progressPercent: 28,
      volumeLevel: 68,
      syncMetadata: true,
      showNativePlayer: false,
      layout: "classic",
      accent: "#1db954"
    },
    fields: [
      { key: "label", label: "Top label", type: "text", maxLength: 40 },
      { key: "title", label: "Track title", type: "text", maxLength: 60 },
      { key: "artist", label: "Artist", type: "text", maxLength: 60 },
      { key: "spotifyUrl", label: "Spotify link", type: "url" },
      { key: "syncMetadata", label: "Auto-sync from Spotify link", type: "checkbox" },
      { key: "artworkUrl", label: "Artwork URL (auto-filled)", type: "url" },
      { key: "elapsedLabel", label: "Current time", type: "text", maxLength: 8 },
      { key: "durationLabel", label: "Duration", type: "text", maxLength: 8 },
      { key: "progressPercent", label: "Progress %", type: "number", min: 0, max: 100, step: 1 },
      { key: "volumeLevel", label: "Volume %", type: "number", min: 0, max: 100, step: 1 },
      { key: "showNativePlayer", label: "Show native Spotify iframe", type: "checkbox" },
      { key: "layout", label: "Layout", type: "select", options: layoutOptions },
      { key: "accent", label: "Accent color", type: "color" }
    ]
  }
};

export function getWidgetEntries() {
  return Object.values(widgetCatalog);
}

export function mergeWidgetConfig(type, partialConfig) {
  return {
    ...structuredClone(widgetCatalog[type].defaults),
    ...(partialConfig || {})
  };
}

function getDefaultFutureDate() {
  const target = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, "0");
  const day = String(target.getDate()).padStart(2, "0");
  const hours = String(target.getHours()).padStart(2, "0");
  const minutes = String(target.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function layoutOptions() {
  return [
    { value: "classic", label: "Classic Card" },
    { value: "compact", label: "Compact Stack" },
    { value: "spotlight", label: "Spotlight" }
  ];
}

function clockStyleOptions() {
  return [
    { value: "notion", label: "Notion Clean" },
    { value: "mono", label: "Mono Grid" },
    { value: "editorial", label: "Editorial Calm" },
    { value: "signal", label: "Signal Accent" }
  ];
}

function clockMotionOptions() {
  return [
    { value: "soft", label: "Soft Flip" },
    { value: "crisp", label: "Crisp Tick" },
    { value: "fade", label: "Fade Pulse" },
    { value: "none", label: "None" }
  ];
}

function countdownStyleOptions() {
  return [
    { value: "notion", label: "Notion Clean" },
    { value: "mono", label: "Mono Grid" },
    { value: "editorial", label: "Editorial Calm" },
    { value: "signal", label: "Signal Accent" }
  ];
}

function countdownMotionOptions() {
  return [
    { value: "soft", label: "Soft Tick" },
    { value: "crisp", label: "Crisp Tick" },
    { value: "fade", label: "Fade Pulse" },
    { value: "none", label: "None" }
  ];
}

function countdownPrefixOptions() {
  return [
    { value: "target", label: "Target" },
    { value: "due", label: "Due" }
  ];
}

function widgetThemeOptions() {
  return [
    { value: "auto", label: "Auto" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" }
  ];
}

function widgetSurfaceOptions() {
  return [
    { value: "transparent", label: "Transparent" },
    { value: "soft", label: "Soft" },
    { value: "card", label: "Card" }
  ];
}