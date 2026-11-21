# Wayfinder

Wayfinder draws a system's architecture, its planned changes and the reasons behind them from **one text model**. Agents write the model; people navigate the map, adjust it by hand and save it to a file.

It is built on spatial cognition: components keep their place, you zoom into a service to see its insides, and every view (flows, projects, decisions, areas) is a lens over the same map rather than a separate diagram.

## What it does

- **Map**: components and connections, with semantic zoom into a component's insides (C4 container → component).
- **Overlays**: runtime flows that continue inside components, Current → Target, Decisions, and changes since the baseline.
- **Areas**: named regions such as a team, a deployment or a compliance scope, drawn around their members.
- **Projects**: several projects as ordered steps over the same baseline, with dependencies across projects and warnings for undeclared needs and conflicts.
- **Decisions**: ADRs with a lifecycle (proposed → accepted or rejected → superseded), linked to components and areas, immutable once closed.
- **Search and Ask**: `Ctrl+F` searches everything (type `ADR` for the full decision history); start with `?` to ask graph questions such as "What breaks if the database goes down?".
- **Editing**: drag to move, edit text in the inspector, undo with `Ctrl+Z`.
- **Files**: maps autosave in the browser; **Save** writes a `.wayfinder.json` file (in Chrome and Edge, later saves overwrite the same file).

Wayfinder has no backend. Maps never leave the browser unless the user saves a file.

## For AI agents

The format guide lives at [`site/llms.txt`](site/llms.txt) and is served at `/llms.txt` next to the app. Give an agent the app's URL or that file, ask it to map a system, and import the `model.json` it returns.

## Run locally

Open `site/index.html` in a browser, or serve the folder:

```sh
npx serve site
```

## Tests

End-to-end tests drive the real page with Playwright:

```sh
npm ci
npx playwright install chromium
npm test
```

CI runs them on every push and pull request (`.github/workflows/ci.yml`).

## Deploy

The site is static and deploys to **GitHub Pages** from `main`, after the tests pass (`.github/workflows/ci.yml`). One-time setup: Settings → Pages → Source: **GitHub Actions**.

Security: GitHub Pages can't send custom headers, so the Content-Security-Policy is a `<meta>` tag in `site/index.html`. It blocks every network request from the app.

## Working on it

`CLAUDE.md` describes the code and its design rules; `ROADMAP.md` lists what comes next.

## License

[Apache-2.0](LICENSE)
