# Apostles4Jesus | apostles4jesus.com

A fully bilingual Orthodox Christian teaching website built for a real community with 15K+ followers across social media platforms. Every page, every component, and every line of copy exists in both English and Arabic with full RTL layout support.

Live at [apostles4jesus.com](https://apostles4jesus.com)

---

## What it is

Five pages in English, five in Arabic. Each language has its own complete experience including navigation, banners, forms, and content — not a translation overlay, but a fully mirrored site.

- **Home** - mission statement, featured episodes, intro video
- **Episodes** - full YouTube playlist library organized by series
- **Live** - embedded live stream with real-time active/offline detection via YouTube IFrame API
- **About** - team bios and organizational mission
- **Contact** - form with a real serverless backend

---

## How it's built

No frameworks. Vanilla HTML, CSS, and JavaScript from scratch.

Two shared stylesheets keep everything consistent — `style.css` for global design tokens, components, and layout, and `mobile.css` for 1300+ lines of responsive overrides across every breakpoint. Arabic pages use RTL layout throughout with mirrored spacing, flex direction, and border logic.

The contact form is backed by a real **Node.js serverless function** on Netlify with:
- Google reCAPTCHA v3 (invisible, score-based spam detection)
- IP-based rate limiting (5 submissions per hour)
- Server-side input sanitization and email validation
- Transactional email delivery via Resend API
- All secrets stored in environment variables, nothing hardcoded

The site is a **PWA** — installable from the browser, fully cached by a service worker, and functional offline.

---

## Tech stack

| Area | Tech |
|------|------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js (Netlify Functions) |
| Spam protection | Google reCAPTCHA v3 |
| Email | Resend API |
| Hosting | Netlify |
| Version control | GitHub |
| Analytics | Google Analytics |

---

## Performance

- All images converted to WebP (cut image weight by ~80%)
- Native lazy loading on all below-fold images
- YouTube click-to-load facades replace iframes until user interaction
- Service worker pre-caches all 10 pages, CSS, JS, and images on first visit
- Repeat visits load near-instantly from cache

## Security

- Content Security Policy, X-Frame-Options, X-Content-Type-Options via Netlify headers
- Rate limiting, input sanitization, and email validation on the contact backend
- No API keys or secrets anywhere in the codebase

## SEO

- Full meta tags, Open Graph, and Twitter Card on all 10 pages
- hreflang tags linking each English page to its Arabic counterpart
- sitemap.xml and robots.txt
- Language memory via localStorage with automatic redirect for returning Arabic users
