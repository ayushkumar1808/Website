# ConfigAI Website

Landing page for **ConfigAI** — "The future of AI inference is here."

**Live site:** https://www.configai.co

## What's in this repo

- `index.html` — the full single-page website
- `CNAME` — custom domain (`www.configai.co`) for GitHub Pages
- `.nojekyll` — disables Jekyll processing so GitHub Pages serves files as-is
- Branding / media assets:
  - `configai-logo.png`
  - `configai-icon.png`
  - `mpi-logo.png`
  - `gemini-folder.png`

## Page overview

The homepage is designed as a scroll-snapping, section-based layout with a dark "space" aesthetic (starfield canvas background + subtle dot grid styling), using Tailwind via CDN and Google Fonts (Poppins + Playfair Display).

## GitHub Pages deployment

The site is deployed via **GitHub Pages** directly from the `main` branch root.

### Enable Pages (one-time setup)

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
3. Click **Save**.
4. Set **Custom domain** to `www.configai.co` and wait for DNS check to pass.
5. Enable **Enforce HTTPS** once the certificate is provisioned.

### DNS settings (at your domain registrar)

| Type  | Host | Value                      |
|-------|------|----------------------------|
| CNAME | www  | `ayushkumar1808.github.io` |
| A     | @    | `185.199.108.153`          |
| A     | @    | `185.199.109.153`          |
| A     | @    | `185.199.110.153`          |
| A     | @    | `185.199.111.153`          |

### Verification

After enabling Pages and DNS propagation (up to a few hours):

- **GitHub Pages URL**: https://ayushkumar1808.github.io/Website/
- **Custom domain**: https://www.configai.co
