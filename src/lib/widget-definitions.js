export const themes = {
  warm: {
    pageTop: "#f6efe5",
    pageBottom: "#edf5ff",
    panel: "rgba(255, 250, 244, 0.78)",
    panelStrong: "rgba(255, 255, 255, 0.84)",
    panelBorder: "rgba(100, 76, 48, 0.12)",
    textStrong: "#1e2933",
    textSoft: "#5f6973",
    accentStrong: "#8f4520",
    widgetCard: "rgba(255, 249, 241, 0.88)",
    shadow: "0 28px 72px rgba(60, 45, 29, 0.12)"
  },
  ocean: {
    pageTop: "#e3f5ff",
    pageBottom: "#edf9f3",
    panel: "rgba(244, 251, 255, 0.78)",
    panelStrong: "rgba(255, 255, 255, 0.84)",
    panelBorder: "rgba(41, 89, 117, 0.13)",
    textStrong: "#163243",
    textSoft: "#567287",
    accentStrong: "#17556f",
    widgetCard: "rgba(240, 250, 255, 0.9)",
    shadow: "0 28px 72px rgba(25, 72, 91, 0.13)"
  },
  forest: {
    pageTop: "#edf7e9",
    pageBottom: "#f9f3e8",
    panel: "rgba(248, 255, 246, 0.78)",
    panelStrong: "rgba(255, 255, 255, 0.84)",
    panelBorder: "rgba(67, 103, 64, 0.13)",
    textStrong: "#213125",
    textSoft: "#5d6f60",
    accentStrong: "#3f653d",
    widgetCard: "rgba(247, 255, 245, 0.9)",
    shadow: "0 28px 72px rgba(49, 79, 47, 0.13)"
  },
  midnight: {
    pageTop: "#111827",
    pageBottom: "#223149",
    panel: "rgba(15, 23, 38, 0.78)",
    panelStrong: "rgba(19, 28, 45, 0.86)",
    panelBorder: "rgba(161, 185, 209, 0.12)",
    textStrong: "#eef5ff",
    textSoft: "#afc1d4",
    accentStrong: "#ffd7af",
    widgetCard: "rgba(17, 26, 43, 0.9)",
    shadow: "0 28px 72px rgba(4, 9, 19, 0.42)"
  }
};

export const widgetCatalog = {
  clock: {
    id: "clock",
    name: "Focus Clock",
    icon: "◴",
    description: "A live clock with prompts for deep work pages.",
    defaults: {
      label: "Focus Clock",
      title: "Today",
      theme: "warm",
      layout: "classic",
      accent: "#d56c37",
      showDate: true,
      showSeconds: false,
      use24Hour: false,
      prompts: "Pick one meaningful task and finish it before opening anything new.\nMake the next 25 minutes distraction-free.\nClear one stubborn task you have been postponing."
    },
    fields: [
      { key: "label", label: "Top label", type: "text", maxLength: 40 },
      { key: "title", label: "Title", type: "text", maxLength: 24 },
      { key: "theme", label: "Theme", type: "select", options: themeOptions },
      { key: "layout", label: "Layout", type: "select", options: layoutOptions },
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
    icon: "◷",
    description: "Count down to launches, exams, travel, and milestones.",
    defaults: {
      label: "Big Moment",
      title: "Launch Day",
      theme: "ocean",
      layout: "spotlight",
      accent: "#2e8dc2",
      targetDate: getDefaultFutureDate(),
      showSeconds: false,
      completionText: "It is live."
    },
    fields: [
      { key: "label", label: "Top label", type: "text", maxLength: 40 },
      { key: "title", label: "Title", type: "text", maxLength: 40 },
      { key: "theme", label: "Theme", type: "select", options: themeOptions },
      { key: "layout", label: "Layout", type: "select", options: layoutOptions },
      { key: "accent", label: "Accent color", type: "color" },
      { key: "targetDate", label: "Target date", type: "datetime-local" },
      { key: "showSeconds", label: "Show seconds", type: "checkbox" },
      { key: "completionText", label: "Completion message", type: "text", maxLength: 60 }
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
      theme: "forest",
      layout: "classic",
      accent: "#56863f"
    },
    fields: [
      { key: "label", label: "Top label", type: "text", maxLength: 40 },
      { key: "quote", label: "Quote", type: "textarea", help: "Keep it short for narrow embeds." },
      { key: "author", label: "Author", type: "text", maxLength: 40 },
      { key: "theme", label: "Theme", type: "select", options: themeOptions },
      { key: "layout", label: "Layout", type: "select", options: layoutOptions },
      { key: "accent", label: "Accent color", type: "color" }
    ]
  },
  spotify: {
    id: "spotify",
    name: "Spotify Card",
    icon: "♫",
    description: "Wrap a Spotify track, album, or playlist in a better shell.",
    defaults: {
      label: "Now Playing",
      title: "Spotify Pick",
      artist: "Artist name",
      note: "Auto-syncs from the Spotify link when enabled.",
      spotifyUrl: "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P",
      artworkUrl: "",
      elapsedLabel: "00:05",
      durationLabel: "04:39",
      progressPercent: 28,
      volumeLevel: 68,
      syncMetadata: true,
      showNativePlayer: false,
      theme: "midnight",
      layout: "classic",
      accent: "#1db954"
    },
    fields: [
      { key: "label", label: "Top label", type: "text", maxLength: 40 },
      { key: "title", label: "Title", type: "text", maxLength: 40 },
      { key: "artist", label: "Artist or subtitle", type: "text", maxLength: 60 },
      { key: "note", label: "Helper text", type: "text", maxLength: 80 },
      { key: "spotifyUrl", label: "Spotify link", type: "url" },
      { key: "syncMetadata", label: "Auto-sync metadata from Spotify link", type: "checkbox" },
      { key: "artworkUrl", label: "Artwork image URL", type: "url" },
      { key: "elapsedLabel", label: "Elapsed time label", type: "text", maxLength: 8 },
      { key: "durationLabel", label: "Duration label", type: "text", maxLength: 8 },
      { key: "progressPercent", label: "Progress percent", type: "number", min: 0, max: 100, step: 1 },
      { key: "volumeLevel", label: "Volume percent", type: "number", min: 0, max: 100, step: 1 },
      { key: "showNativePlayer", label: "Show native Spotify player", type: "checkbox" },
      { key: "theme", label: "Theme", type: "select", options: themeOptions },
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