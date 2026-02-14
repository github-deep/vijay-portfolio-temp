# Vijay Pratap — Portfolio

A static portfolio site built with [Astro](https://astro.build/), TypeScript, and React. Designed for speed, SEO, and easy content management.

**Live site**: [vijaypratap.com](https://vijaypratap.com)

## Quick Start

```bash
npm install
npm run dev       # Dev server at localhost:4321
npm run build     # Production build (output in dist/)
npm run preview   # Preview production build
```

## Adding New Content

Create a folder in `src/content/portfolio/`. The folder name becomes the URL slug.

### Folder structure

```
src/content/portfolio/my-new-film/
  my-new-film.md       ← Markdown file (name must match folder)
  thumbnail.jpg        ← Card image shown in the portfolio grid
  frame-1.jpg          ← Any images used in the content
  frame-2.jpg
```

### Frontmatter

Every `.md` file starts with this metadata block:

```yaml
---
title: "My New Film"
description: "A short description for cards and SEO."
date: 2025-06-15
tags: ["documentary", "mumbai"]
category: "films"
thumbnail: "./thumbnail.jpg"
featured: true
draft: false
---
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Display title |
| `description` | Yes | Short summary (shown on cards and in SEO) |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `tags` | Yes | Array of tags for filtering and search |
| `category` | Yes | One of: `writings`, `films`, `cycling`, `road-to-wisdom`, `data-science` |
| `thumbnail` | No | Relative path to card image (e.g. `./thumbnail.jpg`) |
| `featured` | No | Set `true` to show on home page (default: false) |
| `draft` | No | Set `true` to hide from site (default: false) |

### Writing content

Standard Markdown below the frontmatter. Images use relative paths:

```markdown
Your text here. **Bold**, *italic*, [links](https://example.com).

![Photo description](./frame-1.jpg)
```

External links automatically open in a new tab.

### Image gallery / slideshow

Wrap consecutive images in `:::gallery` to create a slideshow with prev/next buttons and swipe support:

```markdown
:::gallery
![Frame 1](./frame-1.jpg)
![Frame 2](./frame-2.jpg)
![Frame 3](./frame-3.jpg)
:::
```

### Publishing

```bash
git add .
git commit -m "Add new film"
git push
```

Netlify auto-builds and deploys. Live within a minute.

## Features

- **Dark / light mode** — respects system preference, toggle in navbar, persists in localStorage
- **Portfolio filtering** — by category, tags, text search, and date (e.g. "june 2024")
- **Image galleries** — slideshow with prev/next, dots, counter, and swipe on mobile
- **Share buttons** — copy link, X, WhatsApp, LinkedIn + native share on mobile
- **SEO** — static HTML output, Open Graph meta tags, semantic markup
- **Mobile-first** — responsive design, horizontal-scrolling filter pills, touch gestures
- **Co-located content** — markdown + images live in the same folder, no separate image directory
- **Auto image optimization** — Astro processes and optimizes images at build time

## Categories

| Category | ID | Description |
|----------|------|-------------|
| Writings | `writings` | Screenplays, stories, creative writing |
| Films | `films` | Documentaries, shorts, video work |
| Cycling | `cycling` | Cycling journals and adventures |
| Road to Wisdom | `road-to-wisdom` | Essays, reflections, philosophy |
| Data Science | `data-science` | Technical writing from past career |

To add a new category: edit `src/data/siteConfig.ts` (add to `categories` array) and `src/content/config.ts` (add to `category` enum).

## Personalisation

Edit `src/data/siteConfig.ts` to update:

- Name, tagline, description
- Social media links
- About page text
- Categories

## Project Structure

```
src/
  content/
    config.ts                 # Content schema (frontmatter validation)
    portfolio/                # Content lives here
      my-film/
        my-film.md            # Markdown (name matches folder)
        thumbnail.jpg         # Card image
        photo.jpg             # Inline images
  data/
    siteConfig.ts             # Site config (name, socials, categories)
  layouts/
    BaseLayout.astro          # HTML wrapper (head, meta, theme)
  components/
    layout/
      Navbar.astro            # Nav + theme toggle
      Footer.astro            # Footer
    portfolio/
      PortfolioGrid.tsx       # React: filters, search, grid
  pages/
    index.astro               # Home (hero + categories + featured)
    about.astro               # About page
    contact.astro             # Contact page
    404.astro                 # Not found
    portfolio/
      index.astro             # Portfolio list
      [...slug].astro         # Content detail (renders markdown)
  plugins/
    remark-gallery.mjs        # :::gallery directive plugin
  styles/
    global.css                # Theme variables, typography, base styles
    portfolio-grid.css        # Portfolio grid component styles
public/
  favicon.svg
```

## Deployment

Hosted on **Netlify** (free tier).

| Setting | Value |
|---------|-------|
| Build command | `astro build` |
| Publish directory | `dist` |
| Node version | 20+ |

### Custom domain setup

1. In Netlify: Site settings → Domain management → Add custom domain
2. In your domain registrar: Add CNAME record pointing to `your-site.netlify.app`
3. Netlify auto-provisions HTTPS

## Tech Stack

- **[Astro](https://astro.build/)** — static site generator
- **[React](https://react.dev/)** — interactive components (portfolio filter)
- **TypeScript** — type safety
- **CSS Custom Properties** — theming (dark/light)
- **[remark-directive](https://github.com/remarkjs/remark-directive)** — gallery syntax
- **[rehype-external-links](https://github.com/rehypejs/rehype-external-links)** — external links open in new tab

## Image Tips

- Resize to max **1600px wide** before committing (keeps repo small)
- Astro auto-converts to optimized formats at build time
- Use `.jpg` / `.png` / `.webp` / `.gif` / `.svg`
- GitHub hard limit: 100MB per file. Keep images under 5MB each.