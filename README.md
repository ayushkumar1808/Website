# ConfigAI Website

Landing page for **ConfigAI** — "The future of AI inference is here."

Live at: **[www.configai.co](https://www.configai.co)**

## What's in this repo

- `index.html` — the full single-page website
- `CNAME` — custom domain for GitHub Pages (`www.configai.co`)
- Branding / media assets:
  - `configai-logo.png`
  - `configai-icon.png`
  - `mpi-logo.png`
  - `gemini-folder.png`

## Page overview

The homepage is designed as a scroll-snapping, section-based layout with a dark "space" aesthetic (starfield canvas background + subtle dot grid styling), using Tailwind via CDN and Google Fonts (Poppins + Playfair Display).

## Deploying with GitHub Pages

This site is served as static HTML/CSS/JS — no build step required.

### 1 — Enable GitHub Pages

1. Go to **Settings → Pages** in this repository.
2. Under **Source**, select **Deploy from a branch**.
3. Set the branch to **`main`** and the folder to **`/ (root)`**.
4. Click **Save**.

GitHub will publish the site at `https://ayushkumar1808.github.io/Website/` within a few minutes.

### 2 — Configure the custom domain

1. In **Settings → Pages**, enter `www.configai.co` in the **Custom domain** field and click **Save**.  
   (The `CNAME` file at the root of this repo already contains this value, so GitHub Pages will accept it automatically.)
2. Once DNS has propagated, tick **Enforce HTTPS** to enable the free TLS certificate.

### 3 — DNS records (set at your registrar / DNS provider)

| Type  | Name / Host | Value                      | Purpose                    |
|-------|-------------|----------------------------|----------------------------|
| CNAME | `www`       | `ayushkumar1808.github.io` | Serves `www.configai.co`   |
| A     | `@`         | `185.199.108.153`          | Apex domain → GitHub Pages |
| A     | `@`         | `185.199.109.153`          | Apex domain → GitHub Pages |
| A     | `@`         | `185.199.110.153`          | Apex domain → GitHub Pages |
| A     | `@`         | `185.199.111.153`          | Apex domain → GitHub Pages |

> **Note:** If your DNS provider supports `ALIAS` or `ANAME` records for the apex domain, you can use `ALIAS @ ayushkumar1808.github.io` instead of the four `A` records above.

After DNS propagates (up to 24 hours, usually much faster), GitHub Pages will automatically provision an HTTPS certificate via Let's Encrypt. Enable **Enforce HTTPS** in Settings → Pages once the certificate is active.
