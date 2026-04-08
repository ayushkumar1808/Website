# ConfigAI Website

Landing page for **ConfigAI** — "The future of AI inference is here."

Live at: **https://www.configai.co**

## What's in this repo

- `index.html` — the full single-page website
- `CNAME` — custom domain (`www.configai.co`) for GitHub Pages
- `.nojekyll` — disables Jekyll processing so GitHub Pages serves the static files directly
- Branding / media assets:
  - `configai-logo.png`
  - `configai-icon.png`
  - `mpi-logo.png`
  - `gemini-folder.png`

## Deployment

Hosted on **GitHub Pages**, deployed from the `main` branch root (`/`).

Settings → Pages:
- Source: **Deploy from a branch**
- Branch: **main** / **/ (root)**
- Custom domain: **www.configai.co**

## DNS configuration (GoDaddy)

For the custom domain `www.configai.co` to work you need the following records in GoDaddy:

### `www` subdomain (required)

| Type  | Name | Value                        | TTL  |
|-------|------|------------------------------|------|
| CNAME | www  | ayushkumar1808.github.io     | 1 hr |

> **Important:** Delete any existing A or CNAME record for `www` before adding the one above.
> GoDaddy may also add a URL-forwarding / "Forwarding" rule for `www` by default — remove it if present.

### Apex / root domain `configai.co` (recommended)

| Type | Name | Value            | TTL  |
|------|------|------------------|------|
| A    | @    | 185.199.108.153  | 1 hr |
| A    | @    | 185.199.109.153  | 1 hr |
| A    | @    | 185.199.110.153  | 1 hr |
| A    | @    | 185.199.111.153  | 1 hr |

### Verify DNS propagation

```bash
# Check www CNAME
dig www.configai.co CNAME +short
# Expected: ayushkumar1808.github.io.

# Check apex A records
dig configai.co A +short
# Expected: 185.199.108.153
# 185.199.109.153
# 185.199.110.153
# 185.199.111.153

# Online checker
# https://dnschecker.org/#CNAME/www.configai.co
```

### Troubleshooting HTTPS / SSL certificate

GitHub Pages provisions a free Let's Encrypt certificate automatically once DNS is correct.
If **Enforce HTTPS** remains unavailable after 24 hours:

1. In **Settings → Pages**, clear the custom domain field and save.
2. Wait 5 minutes, re-enter `www.configai.co` and save.
3. GitHub will retry certificate provisioning.
4. GoDaddy-specific: make sure there is **no URL-forwarding / redirect** rule on `www` — forwarding overrides the CNAME and blocks cert issuance.
5. Check certificate status: `https://letsdebug.net/www.configai.co/new`

## Page overview

The homepage is designed as a scroll-snapping, section-based layout with a dark "space" aesthetic (starfield canvas background + subtle dot grid styling), using Tailwind via CDN and Google Fonts (Poppins + Playfair Display).
