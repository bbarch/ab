# Ameet Babbar — website

This is a lightweight, dependency-free editorial website. Open `index.html` in a browser to view it.

## Publishing writing and notes

All current homepage content is in [content.js](content.js). To add a new article, copy an object in `articles`, update its title, summary, category, date and reading time, then save. The homepage will automatically display it.

To publish a note, do the same in the `notes` list. Notes are designed for short observations, book notes, photographs and sketches.

## Adding photographs and sketches

1. Create an `images` folder beside `index.html`.
2. Put an optimized `.jpg`, `.webp`, `.png`, or `.svg` file inside it, with a simple lowercase filename, such as `western-ghats-house.jpg`.
3. Use the image in a new article or project page as the site grows; keeping all assets in this folder makes publishing simple and portable.

The visual cards are intentionally built with CSS at the moment, so the site needs no stock photography to feel finished. The content structure is ready to be expanded into individual article and project pages or connected to a headless CMS when publishing becomes more frequent.

## Files

- `index.html` — page structure
- `styles.css` — all typography, colours, responsive layout, and artwork
- `content.js` — the editable article and note content
- `script.js` — rendering, search, and the newsletter interaction
