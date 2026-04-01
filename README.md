# Apostles4Jesus — apostles4jesus.com

Website for Apostles4Jesus, an Orthodox Christian teaching community with 15K+ followers across social media. Built and maintained by me since 2021, redesigned from scratch into what it is today.

The site delivers weekly faith content in English and Arabic, so everything — every page, every component — exists in both languages.

## What's on the site

- **Home** — mission, featured episodes, intro video
- **Episodes** — full YouTube playlist library
- **Live** — embedded live stream with active/offline detection
- **About** — team and mission
- **Contact** — form with real backend

## How it's built

Vanilla HTML, CSS, and JavaScript. No frameworks. Two shared stylesheets handle global styles and mobile responsiveness across all 10 pages. Arabic pages use RTL layout throughout.

The contact form runs on a real serverless backend — Netlify Functions (Node.js) with reCAPTCHA v3 spam detection, rate limiting, input sanitization, and email delivery through the Resend API.

The site is also a PWA — installable on mobile, works offline, and caches all pages and assets through a service worker.

## Tech used

- HTML / CSS / JavaScript
- Node.js (Netlify Functions)
- Google reCAPTCHA v3
- Resend API
- Netlify (hosting + CI/CD)
- GitHub (version control)
- Google Analytics

## Performance

All images converted to WebP. Lazy loading on below-fold images. YouTube facades replace iframes until clicked. Service worker pre-caches everything after first visit.

## Security

Content Security Policy, X-Frame-Options, rate limiting on the contact form, server-side input sanitization, and all API keys stored in environment variables — never in the code.

## Live site

[apostles4jesus.com](https://apostles4jesus.com)
