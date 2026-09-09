# Paradise Pressure Washing — Website Redesign

A complete, from-scratch redesign of the Paradise Pressure Washing website — a local,
family-owned exterior cleaning company serving New Smyrna Beach and Volusia County, Florida.

Built with vanilla HTML, CSS and JavaScript. No build step, no dependencies, no frameworks.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
index.html            Single-page site, semantic HTML + JSON-LD structured data
assets/css/styles.css Design system, layout, responsive rules
assets/js/main.js     Nav, scroll reveal, active-section tracking, quote form
favicon.svg           Favicon
robots.txt            Crawler directives
```

## Sections

Hero · Services · Why Soft Washing (process) · Real Results (before/after) ·
Our Work (gallery) · About · Testimonials · Contact + quote form · Footer

There is no FAQ section — the source site did not publish any FAQs, and no content
was invented to fill one.

## Contact details used

- Phone: (386) 643-3339
- Email: JC@Paradise-Pressure-Washing.com
- Service area: New Smyrna Beach and surrounding Volusia County, Florida

The source site does not publish a street address, so the contact section lists the
service area rather than inventing a location.

## Images

**Kept from the original site** (authentic photos of the company's own work, verified
by inspection — real Florida properties, phone-shot, matching the services offered):

| File | Used for |
| --- | --- |
| `logo.png` | Header and footer logo |
| `ser1c.jpg` | Roof soft washing — gallery |
| `ser2c.jpg` | Paver cleaning & sealing — gallery |
| `ser3c.jpg` | Driveway & walkway — gallery |
| `slide_pool.jpg` | Pool deck & lanai — gallery |
| `slide.jpg` | Before/after roof result band |

**Sourced from Pexels** for sections with no authentic photo available:

| Photo | Used for |
| --- | --- |
| Pexels 9245159 | Hero — low-pressure soft wash in action |
| Pexels 9245155 | Why Soft Washing — low-pressure wand on an exterior surface |

Both Pexels photos come from the same shoot, so the lighting and colour grading stay
consistent with the warm, sunlit look of the company's own job photos.

## Notes

- Responsive from 320px up, with a sticky mobile call bar.
- Respects `prefers-reduced-motion`; includes skip link, focus states and ARIA labelling.
- The quote form composes a pre-filled `mailto:` link — no backend, no external API.
