# Andova Website

The public static website for **Andova**, a consent-based Android parental control and remote device management platform.

**Live site:** [advanced.andova.online](https://advanced.andova.online/)

## What is included

- Responsive Andova homepage
- Android safety and parental-control blog
- Privacy policy, terms of service, and disclaimer pages
- Local images, favicons, and PWA manifest
- `robots.txt` and `sitemap.xml` for search crawlers
- SEO metadata, canonical URLs, Open Graph previews, Twitter cards, and structured data

## Project structure

```text
.
├── index.html
├── blog/blog.html
├── legal/
├── img/
├── manifest.json
├── site.webmanifest
├── robots.txt
└── sitemap.xml
```

## Run locally

This is a static site and requires no build step or package installation.

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080/> in a browser.

## Deploy

Deploy the repository root as a static site with any standard host, including GitHub Pages, Cloudflare Pages, Netlify, or an equivalent static hosting provider. Configure the custom domain as:

```text
advanced.andova.online
```

The deployment must preserve the root-relative paths used by the homepage and serve these files directly:

- `/robots.txt`
- `/sitemap.xml`
- `/manifest.json`
- `/site.webmanifest`

After deployment, verify the canonical URLs and sitemap still use `https://advanced.andova.online/`.

## SEO checklist

- Keep the homepage title and description specific to Andova.
- Keep one meaningful H1 per public page.
- Keep canonical URLs, Open Graph URLs, and sitemap URLs on the production domain.
- Add a new sitemap entry when adding an indexable public page.
- Do not index payment, dashboard, or authenticated routes.
- Use descriptive image `alt` text and maintain internal links between related public pages.

## Security and privacy

Use this site only for lawful, authorized, and consent-based device management. Do not collect or transmit passwords or other sensitive credentials through client-side scripts. The packaged repository intentionally excludes the former plaintext credential-reporting helper and does not contain private keys or API credentials.

Analytics and API endpoints are deployment-specific. Configure them on the server side with appropriate consent, access controls, retention limits, and privacy disclosures before enabling them in production.
