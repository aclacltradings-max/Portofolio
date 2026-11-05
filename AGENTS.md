# Repository notes

Portfolio site for AROMIRE KEHINDE (Web & App Developer).

## Layout

Static, dependency-free site — plain HTML/CSS/JS, no build step.

- `index.html` — all sections, in order: hero, about, skills, services, projects, contact
- `styles.css` — design tokens live in `:root` at the top; theme is dark purple/black with violet gradients
- `script.js` — nav, scroll reveal, typed role, counters, 3D tilt, mailto form
- `assets/` — `avatar.svg`, `favicon.svg`, `og-image.png`

## Conventions

- Text content is edited directly in `index.html`, grouped by section comments.
- Change colours and spacing through the CSS custom properties in `:root`, not by editing rules.
- Animations must respect `prefers-reduced-motion`; `script.js` reads it once into `reduceMotion`.
- `.reveal` elements use a long (0.85s) transform transition, so anything that manipulates
  `transform` per frame (the tilt handler) adds `.is-tilting` to disable that transition and
  clears its inline transform when it settles, handing control back to CSS hover.

## Local preview

```bash
python3 -m http.server 8000
```

## Deploy

GitHub Pages from `main`, root folder.

## Known constraint

The `GITHUB_TOKEN` available in the sandbox is read-only for this repository. `git push` and
all write API calls (contents, refs, pulls) return 403 `Resource not accessible by integration`,
even though the API reports `push: true`. Commits therefore have to be pushed by the user or by
a credential with real write access.
