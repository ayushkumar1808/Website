# ConfigAI Website

[![Deploy to GitHub Pages](https://github.com/ayushkumar1808/Website/actions/workflows/deploy.yml/badge.svg)](https://github.com/ayushkumar1808/Website/actions/workflows/deploy.yml)

Landing page for **ConfigAI** — "The future of AI inference is here."

🌐 **Live site:** <https://ayushkumar1808.github.io/Website/>

## What's in this repo

- `index.html` — the full single-page website
- Branding / media assets:
  - `configai-logo.png`
  - `configai-icon.png`
  - `mpi-logo.png`
  - `gemini-folder.png`
- Deployment config:
  - `.github/workflows/deploy.yml` — GitHub Actions workflow that publishes to GitHub Pages on every push to `main`

## Page overview

The homepage is designed as a scroll-snapping, section-based layout with a dark "space" aesthetic (starfield canvas background + subtle dot grid styling), using Tailwind via CDN and Google Fonts (Inter + Playfair Display).

## Enabling GitHub Pages

1. Go to **Settings → Pages** in the repository on GitHub.
2. Under **Build and deployment**, set the source to **GitHub Actions**.
3. Save. The next push to `main` (or a manual run of the workflow) will deploy the site.

The site will be live at: `https://ayushkumar1808.github.io/Website/`

### Custom domain (optional)

1. Add a `CNAME` file at the repository root containing your domain (e.g. `www.example.com`).
2. In **Settings → Pages → Custom domain**, enter the same domain and save.
3. Tick **Enforce HTTPS** once DNS propagation is complete (usually within 24 hours).
