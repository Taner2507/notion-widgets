# Notion Widget Starter

This project is a customizable embeddable widget you can host publicly and place inside Notion using `/embed`.

## What this project includes

- `index.html`: the widget markup
- `styles.css`: styling for the widget card and settings panel
- `script.js`: live clock, themes, saved settings, and shareable embed URLs

## Customization features

- Built-in settings panel
- Theme presets
- Multiple layout variants
- Accent color picker
- 12-hour or 24-hour time
- Optional seconds display
- Optional date line
- Custom prompt list
- Saved named variations
- Shareable URL parameters for reuse in multiple Notion pages

## Fastest hosting option: GitHub Pages

1. Create a new GitHub repository.
2. Upload these files to the repository root.
3. Push the repository to GitHub.
4. In GitHub, open `Settings` -> `Pages`.
5. Under `Build and deployment`, choose:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
6. Save and wait for GitHub Pages to publish.
7. GitHub gives you a public URL like:

   `https://your-username.github.io/your-repo-name/`

## How to add it to Notion

1. Copy the public GitHub Pages URL.
2. In Notion, type `/embed`.
3. Paste the URL.
4. Resize the embed block until it fits the widget well.

## Reuse the widget with different configurations

After you customize the widget, use the `Copy embed URL` button. That generated URL includes the current settings as query parameters.

Example:

`https://your-username.github.io/your-repo-name/?label=Deep%20Work&theme=ocean&seconds=true`

That lets you create multiple versions of the same widget for different Notion pages.

You can also save named variations inside the customization panel. Each saved variation has its own `Copy link` button, which is the closest static-site workflow to how Indify generates separate widget URLs.

## Local preview

You can open `index.html` directly in a browser for a quick preview.

## Customization ideas

- Add a countdown mode
- Add a Pomodoro mode
- Connect to a weather API
- Build a habit tracker or KPI card set

## Important note

Notion does not run your widget code natively. The widget must be hosted somewhere public, then embedded into Notion.
