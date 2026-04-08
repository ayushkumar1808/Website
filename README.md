# ConfigAI Website

Landing page for **ConfigAI** — "The future of AI inference is here."

Live at: **https://www.configai.co**

## What's in this repo

- `index.html` — the full single-page website
- `CNAME` — custom domain for GitHub Pages (`www.configai.co`)
- `.nojekyll` — disables Jekyll processing on GitHub Pages
- Branding / media assets:
  - `configai-logo.png`
  - `configai-icon.png`
  - `mpi-logo.png`
  - `gemini-folder.png`

## Page overview

The homepage is designed as a scroll-snapping, section-based layout with a dark "space" aesthetic (starfield canvas background + subtle dot grid styling), using Tailwind via CDN and Google Fonts (Poppins + Playfair Display).

## Deploying with GitHub Pages

This site is hosted on **GitHub Pages** directly from the `main` branch root (no build step needed).

### 1. Enable GitHub Pages

1. Go to **Repository → Settings → Pages**.
2. Under **Build and deployment**, set:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/ (root)`
3. Click **Save**.

### 2. Set the custom domain

1. Still in **Settings → Pages**, enter `www.configai.co` in the **Custom domain** field.
2. Click **Save** (GitHub will verify the `CNAME` file in the repo).
3. Once DNS has propagated, tick **Enforce HTTPS**.

### 3. DNS records (set at your domain registrar/DNS provider)

| Type  | Host  | Value                        |
|-------|-------|------------------------------|
| CNAME | `www` | `ayushkumar1808.github.io`   |
| A     | `@`   | `185.199.108.153`            |
| A     | `@`   | `185.199.109.153`            |
| A     | `@`   | `185.199.110.153`            |
| A     | `@`   | `185.199.111.153`            |

> **Cloudflare users:** set the `www` CNAME proxy status to **DNS only** (grey cloud), not proxied, so GitHub can issue the HTTPS certificate.

### 4. Validation

After DNS propagates (up to 24–48 hours):

- `https://www.configai.co` — your site with a valid TLS certificate.
- `https://ayushkumar1808.github.io/Website/` — also works as a fallback URL.
