# Notion Widget Starter

This project is a simple embeddable widget you can host publicly and place inside Notion using `/embed`.

## What this project includes

- `index.html`: the widget markup
- `styles.css`: styling for the widget card
- `script.js`: live clock and rotating focus prompts

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

## Local preview

You can open `index.html` directly in a browser for a quick preview.

## Customization ideas

- Replace the focus prompts in `script.js`
- Turn it into a countdown widget
- Connect it to a weather API
- Build a habit tracker or Pomodoro timer

## Important note

Notion does not run your widget code natively. The widget must be hosted somewhere public, then embedded into Notion.