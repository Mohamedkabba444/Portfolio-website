# Mohamed Kabba — Portfolio

Personal portfolio of Mohamed Kabba, a software engineering student at the
University of the Potomac (Washington, DC), building backend skills with
Python and FastAPI and learning AWS. Seeking a Summer 2027 software
engineering internship.

Live site: https://mohamedkabba444.github.io/Portfolio-website/

## What is on the site

- **About** — degree, GPA (3.08), credits earned, and what I am working toward.
- **Projects** — only real work, honestly labeled:
  - **TabSnapshot** — JavaScript browser extension (WebExtensions, Manifest V3)
  - **LinkSnip** — full-stack URL shortener prototype
  - **Task API** — FastAPI task manager, in progress
  - **AWS hands-on** — EC2 + nginx, SQS-triggered Lambda, CloudWatch, in progress
- **Skills** — what I actually use, with honest labels (learning / coursework /
  in progress). No invented tools, no fake performance numbers.
- **Learning now** — AWS Cloud Practitioner Essentials (Modules 1–3 done),
  the backend roadmap, and the goal of a first merged open-source pull request.
- **Contact** — email, GitHub, LinkedIn.

## How it is built

Plain HTML, CSS, and a little vanilla JavaScript. No frameworks, no build
step, no external scripts or fonts, no tracking.

- `index.html` — semantic HTML; all content is in the markup, so the site
  works with JavaScript and CSS disabled.
- `styles.css` — a small design system built on CSS custom properties
  (color, type, spacing, and radius tokens). Dark navy/charcoal palette
  with a teal accent. Mobile-first and responsive; single column under
  ~700px.
- `index.js` — progressive enhancement only: collapsible mobile navigation
  and the footer year.

Accessibility: skip-to-content link, semantic landmarks, headings in order,
visible focus states, sufficient color contrast, and
`prefers-reduced-motion` support.

## Run it locally

```sh
python3 -m http.server
```

Then open http://localhost:8000 in a browser.

## Deployment

Hosted on GitHub Pages from the `main` branch. Pushing to `main` updates
the live site (allow a few minutes for Pages to rebuild).
