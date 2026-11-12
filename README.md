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
- **Building now** — the four resume projects, each clearly badged
  **In progress** (not finished yet):
  - **Cloud-Deployed Task & Team Workflow API** — FastAPI + PostgreSQL +
    JWT + Docker, deploying to EC2/RDS
  - **Serverless Internship Application Tracker** — Lambda + API Gateway +
    DynamoDB + S3/CloudFront
  - **Secure Personal File-Sharing & Portfolio Platform** — S3 + CloudFront
    + IAM + boto3
  - **Open Source Contributor — FastAPI** — docs/examples, issue
    reproduction, pytest tests; goal: first merged PR
- **Skills** — what I actually use, with honest labels (learning / coursework /
  in progress). No invented tools, no fake performance numbers.
- **Learning now** — AWS Cloud Practitioner Essentials (Modules 1–3 done;
  exam is a goal, not yet earned), the backend roadmap, and the goal of a
  first merged open-source pull request.
- **Contact** — email, GitHub, LinkedIn.

## How it is built

Plain HTML, CSS, and a little vanilla JavaScript. No frameworks, no build
step, no external scripts or fonts, no tracking.

- `index.html` — semantic HTML; all content is in the markup, so the site
  works with JavaScript and CSS disabled.
- `styles.css` — a design system built on CSS custom properties (color,
  type, spacing, and radius tokens). Dark navy/charcoal palette with a teal
  accent, inspired by the visual language of equo.dev and nextjs.org:
  gradient glows, a subtle dot-grid background, glassmorphism cards, big
  confident typography, and smooth motion. Mobile-first and responsive;
  single column under ~700px.
- `index.js` — progressive enhancement only: collapsible mobile navigation,
  footer year, scroll-reveal animations, scroll progress bar, active-section
  highlighting in the nav, and a back-to-top button.

Icons are hand-drawn inline SVG — no external icon fonts or scripts.

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
