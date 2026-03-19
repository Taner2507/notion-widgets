# Notion Widget Studio

This project is now a small Notion widget platform, not just a single widget page.

## Included widget types

- Focus Clock
- Countdown
- Quote Card
- Spotify Card

## How the platform works

1. Open the hosted page.
2. Pick a widget type.
3. Customize the fields.
4. Save a named variation if you want to reuse it.
5. Click `Copy embed URL`.
6. Paste that link into Notion using `/embed`.

## Why this is useful

- One hosted page can generate many widget links.
- Each saved variation can be reused across different Notion pages.
- The embed URL uses an encoded config payload, so the rendered widget stays clean.
- No backend is required for this version.

## Spotify in Notion

There are two common ways people add Spotify to Notion:

1. Paste a Spotify share link directly into Notion and choose `Create embed`.
2. Use a custom hosted widget page that contains a Spotify embed iframe.

This project supports the second option through the Spotify Card widget.

## Hosting

GitHub Pages is fine for this version because the whole app is static.

## Next upgrades if you want to keep building

- Add Pomodoro
- Add weather
- Add a widget gallery landing page with categories
- Add a backend later for short permanent widget URLs
