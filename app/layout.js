import "./globals.css";

export const metadata = {
  title: "Notion Widget Platform",
  description: "Create polished Notion widgets and generate embed links."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}