# ConfigAI Website

[![GitHub Pages](https://img.shields.io/badge/deployed%20on-GitHub%20Pages-blue?logo=github)](https://www.configai.co)

Landing page for **ConfigAI** — "The future of AI inference is here."

Live at: **https://www.configai.co**

## What's in this repo

- `index.html` — the full single-page website
- `CNAME` — custom domain configuration (`www.configai.co`)
- `.nojekyll` — disables Jekyll processing so GitHub Pages serves static files as-is
- Branding / media assets:
  - `configai-logo.png`
  - `configai-icon.png`
  - `mpi-logo.png`
  - `gemini-folder.png`

## Page overview

The homepage is designed as a scroll-snapping, section-based layout with a dark "space" aesthetic (starfield canvas background + subtle dot grid styling), using Tailwind via CDN and Google Fonts (Poppins + Playfair Display).

## GitHub Pages deployment

The site is deployed via **GitHub Pages** directly from the `main` branch, root folder (`/`). No build step is required — the static files are served as-is.

### GitHub Pages settings (Settings → Pages)

| Setting | Value |
|---|---|
| Source | Deploy from a branch |
| Branch | `main` |
| Folder | `/ (root)` |
| Custom domain | `www.configai.co` |
| Enforce HTTPS | Enable once certificate is issued (see below) |

### DNS configuration

Set the following records at your DNS provider:

| Type | Name | Value |
|---|---|---|
| CNAME | `www` | `ayushkumar1808.github.io` |
| A | `@` (apex) | `185.199.108.153` |
| A | `@` (apex) | `185.199.109.153` |
| A | `@` (apex) | `185.199.110.153` |
| A | `@` (apex) | `185.199.111.153` |

> **Note:** If using Cloudflare, set the `www` CNAME record to **DNS-only** (grey cloud, not orange) while GitHub is issuing the SSL certificate. You can re-enable proxying after HTTPS is enforced.

### HTTPS / SSL certificate

After setting the custom domain, GitHub automatically provisions a free SSL certificate via Let's Encrypt. This normally takes **10–60 minutes** (up to 24 hours in rare cases).

- While the certificate is pending, the **"Enforce HTTPS"** checkbox in Settings → Pages will be greyed out — this is expected.
- Once the certificate is issued, the checkbox becomes active. Enable it to redirect all HTTP traffic to HTTPS.
- You can check the current status at any time in **Settings → Pages** — look for the green "DNS check successful" message.
