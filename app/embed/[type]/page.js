import EmbedShell from "@/src/components/embed-shell";

export default async function EmbedPage({ params, searchParams }) {
  const { type } = await params;
  const resolvedSearchParams = await searchParams;

  return <EmbedShell widgetType={type} encodedConfig={resolvedSearchParams.config ?? null} />;
}