# Notion Widget Platform

This project is now a real Next.js starter for a Notion widget platform.

## What it includes

- A dashboard-style homepage
- A live widget studio
- An embed-only route at `/embed/[type]`
- Local saved widgets and reusable embed links
- Four widget types:
  - Focus Clock
  - Countdown
  - Quote Card
  - Spotify Card

## Do you need a custom domain?

No.

You can deploy this on Vercel and use a free URL like:

`https://your-project-name.vercel.app`

That is enough for Notion embeds. A custom domain is only needed later if you want branding, shorter links, or a more serious product feel.

## Local development

1. Install dependencies:

   `npm install`

2. Start the dev server:

   `npm run dev`

3. Open:

   `http://localhost:3000`

## Deployment

The best deployment target for this version is Vercel.

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Deploy.
4. Use the generated `.vercel.app` URL in Notion.

## How embed links work

The dashboard generates links like:

`/embed/clock?config=...`

That route renders only the widget, which makes it suitable for Notion embeds.

In Notion, use a real `/embed` block (not a bookmark block) and paste the copied link.

## Spotify in Notion

People usually add Spotify to Notion in one of two ways:

1. Paste a normal Spotify share link directly into Notion and create an embed.
2. Use a custom hosted page that wraps the Spotify player in a nicer design.

This project supports the second approach.

## Next steps

- Add authentication and cloud-saved widgets
- Add short public widget URLs like `/w/abc123`
- Add more widgets such as Pomodoro, weather, calendar, and progress bars
