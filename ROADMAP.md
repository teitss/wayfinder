# Wayfinder roadmap

Each item has an id. To work on one with Claude Code: *"Implement roadmap item 2.1"*. Each item is one branch and one pull request, done when its acceptance criteria hold and `npm test` passes. Tick items off here in the same pull request.

## Phase 1: live on GitHub Pages

- [ ] **1.1 Turn on Pages.** Repository → Settings → Pages → Source: **GitHub Actions**. The next push to `main` deploys `site/` once the tests pass.
  - *Done when* the app opens at `https://teitss.github.io/wayfinder/` and `/llms.txt` is served next to it.
- [ ] **1.2 Smoke-check the live site.** Open the example, Save a file, import it back, try Ctrl+F and `?`.
  - *Done when* nothing in the browser console shows a Content-Security-Policy violation.

## Phase 2: a real codebase

- [ ] **2.1 Vite + TypeScript, no framework.** Move the app into `src/` with `index.html` as the entry; `npm run build` outputs to `dist/`, and CI deploys `dist/`.
  - *Done when* the built app behaves exactly as today and all end-to-end tests pass against `dist/`.
- [ ] **2.2 Split into modules.** `model/` (states, projects, validation, decisions, areas, graph queries), `render/` (map, areas, semantic zoom), `ui/` (inspector, search and Ask, sheet, start screen), `storage/` (library, import, Save), `history/` (undo).
  - *Done when* `model/` has no DOM access at all.
- [ ] **2.3 Unit tests for the model** with Vitest: current state, step order and cycles, undeclared needs, conflicts, closed-decision protection, `autoPlace()`, natural sort, import classification.
  - *Done when* `model/` has high branch coverage and CI runs unit tests before the end-to-end tests.
- [ ] **2.4 One source for the agent guide.** Write it once in Markdown; the build generates both `llms.txt` and the in-page guide.
  - *Done when* the guide exists in one file only.
- [ ] **2.5 Tighter security.** Self-host the fonts (no Google requests) and remove `'unsafe-inline'` from `script-src`.
  - *Done when* the CSP allows only `'self'` for scripts and fonts.

## Phase 3: validate v1

- [ ] **3.1 Scale test.** A script generates a realistic map with 60–80 components, 4 areas, 3 projects and 20 decisions.
  - *Done when* auto-placement stays readable, pan and zoom stay smooth, and an end-to-end test opens it within a time budget.
- [ ] **3.2 Real agent test.** A fresh agent, given only `llms.txt`, maps `keycloak-gateway` (or a slice of the monolith).
  - *Done when* the number of Model check issues and hand fixes is recorded, and the guide is improved where the agent went wrong.
- [ ] **3.3 Usability test with 3–5 colleagues.** Tasks such as "What breaks if Keycloak goes down?" and "What's planned for the API?".
  - *Done when* the findings are written down and the top problems are fixed.
- [ ] **3.4 Release v1.0.0.** Tag it and write release notes.

## Phase 4: after v1

- [ ] **4.1 Notes layer.** Loose notes with author, date and an optional `about` list of ids, on a layer that can be hidden, marked stale after some time.
- [ ] **4.2 Field pinning.** Values a person edited by hand are protected from agent overwrites, enforced on Apply like closed decisions.
- [ ] **4.3 Areas inside components.** Areas drawn at a component's inside zoom level (for example "Domain core" inside a service).
- [ ] **4.4 Offline app (PWA).** Installable, works without a connection.
- [ ] **4.5 Export an image** (SVG or PNG) of the current view.
- [ ] **4.6 Share links.** Needs storage outside the browser, so a backend. GitHub Pages can't host one; this is the point to reconsider hosting (for example Cloudflare Pages with Workers).
- [ ] **4.7 Drift check.** Compare the map with the real system (code or cloud inventory) and flag what's missing or extra.

## Out of scope for now

- General-purpose diagramming (org charts, flowcharts): use a diagram tool.
- Real-time collaboration.
- Migrations for old map formats (pre-1.0).
