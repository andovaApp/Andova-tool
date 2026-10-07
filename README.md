# Andova Website

The public static website for **Andova**, a consent-based Android parental control and remote device management platform.

**Live site:** [advanced.andova.online](https://advanced.andova.online/)

[![Live Website](https://img.shields.io/badge/Live%20Website-advanced.andova.online-0f766e?style=flat)](https://advanced.andova.online/)
[![Repository Visitors](https://visitor-badge.laobi.icu/badge?page_id=andovaApp.andova-website&left_text=repository%20visitors)](https://github.com/andovaApp/andova-website)

Andova helps authorized families manage connected Android devices with clear, consent-based tools for digital safety, device visibility, and responsible remote administration.

## What is included

- Responsive Andova homepage
- Android safety and parental-control blog
- Privacy policy, terms of service, and disclaimer pages
- Local images, favicons, and PWA manifest
- `robots.txt` and `sitemap.xml` for search crawlers
- SEO metadata, canonical URLs, Open Graph previews, Twitter cards, and structured data

## Features

- Live screen view and device status
- Screen-time and app-activity insights
- App and device management
- Location awareness with explicit consent
- Contacts, call-log, SMS, and notification views
- File manager and downloads
- Camera and audio controls for authorized safety checks
- System information and secure device pairing
- Real-time dashboard for connected devices
- Blog and legal pages for user education, privacy, and responsible use

## Interface previews

![Andova device dashboard](img/slide2.png)

![Andova remote device controls](img/slide13.jpg)

![Andova family safety interface](img/slide3.png)

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
