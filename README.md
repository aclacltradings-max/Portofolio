# AROMIRE KEHINDE — Portfolio

A one-page personal portfolio website for **AROMIRE KEHINDE**, Web & App Developer.

> DESIGN. DEVELOP. DELIVER.

## Highlights

- Dark purple / black theme with glowing violet gradients
- Animated hero with a custom SVG developer avatar
- Interactive 3D tilt on cards and the avatar frame
- Smooth scrolling, scroll-reveal animations, animated skill bars and counters
- Fully responsive: desktop, tablet and mobile layouts
- Accessible: semantic markup, keyboard focus styles, `prefers-reduced-motion` support
- Zero dependencies — plain HTML, CSS and JavaScript

## Sections

| Section | Contents |
| --- | --- |
| Hero | Name, title, tagline, introduction, avatar |
| About me | Short bio and working principles |
| My skills | HTML and CSS with proficiency bars |
| My services | Website, Web App and Mobile App Development |
| My projects | Placeholder cards, ready for real case studies |
| Contact me | WhatsApp, email and a message form |

## Contact

- WhatsApp: [08163145267](https://wa.me/2348163145267)
- Email: [heisbale@gmail.com](mailto:heisbale@gmail.com)

## Project structure

```
.
├── index.html            # All page content and sections
├── styles.css            # Theme, layout, animations, responsive rules
├── script.js             # Nav, scroll reveal, tilt, counters, form handling
└── assets/
    ├── avatar.svg        # Illustrated developer avatar
    ├── favicon.svg       # AK monogram favicon
    └── og-image.png      # Social share preview (1200x630)
```

## Run locally

The site is static, so any web server works:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy

The site is ready for GitHub Pages:

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Set **Source** to *Deploy from a branch*, branch `main`, folder `/ (root)`.
4. Save. The site publishes at `https://<owner>.github.io/Portofolio/`.

## Editing content

- Text lives directly in `index.html`, grouped by section comments.
- Colors and spacing are controlled by CSS custom properties at the top of `styles.css`.
- Replace the placeholder project cards in `#projects` with real work when ready.
