"use client";

import WidgetPreview from "@/src/components/widget-preview";
import { mergeWidgetConfig, widgetCatalog } from "@/src/lib/widget-definitions";
import { decodeWidgetConfig } from "@/src/lib/widget-utils";

export default function EmbedShell({ widgetType, encodedConfig }) {
  if (!widgetCatalog[widgetType]) {
    return (
      <main className="embed-page">
        <div className="embed-error">Unknown widget type.</div>
      </main>
    );
  }

  const decodedConfig = decodeWidgetConfig(encodedConfig);

  if (!decodedConfig) {
    return (
      <main className="embed-page">
        <div className="embed-error">Invalid widget config.</div>
      </main>
    );
  }

  const mergedConfig = mergeWidgetConfig(widgetType, decodedConfig);

  return (
    <main className="embed-page">
      <WidgetPreview type={widgetType} config={mergedConfig} embedMode />
    </main>
  );
}