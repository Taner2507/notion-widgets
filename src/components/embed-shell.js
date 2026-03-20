"use client";

import { useEffect } from "react";

import WidgetPreview from "@/src/components/widget-preview";
import { mergeWidgetConfig, widgetCatalog } from "@/src/lib/widget-definitions";
import { decodeWidgetConfig } from "@/src/lib/widget-utils";

export default function EmbedShell({ widgetType, encodedConfig }) {
  useEffect(() => {
    document.documentElement.classList.add("is-embed");
    document.body.classList.add("is-embed");
    return () => {
      document.documentElement.classList.remove("is-embed");
      document.body.classList.remove("is-embed");
    };
  }, []);

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