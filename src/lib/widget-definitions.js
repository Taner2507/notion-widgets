export const widgetCatalog = {
  clock: {
    id: "clock",
    name: "Focus Clock",
    icon: "◴",
    description: "A live clock with prompts for deep work pages.",
    defaults: {
      label: "Focus Clock",
      title: "Today",
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
      layout: "spotlight",
      accent: "#2e8dc2",
      targetDate: getDefaultFutureDate(),
      showSeconds: false,
      completionText: "It is live."
    },
    fields: [
      { key: "label", label: "Top label", type: "text", maxLength: 40 },
      { key: "title", label: "Title", type: "text", maxLength: 40 },
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