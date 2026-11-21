# Wayfinder: notes for Claude Code

Wayfinder draws a system's architecture, planned changes and decisions from one JSON model. Agents write the model; people navigate the map, adjust it and save it as a file. There is no backend: maps live in the browser (localStorage) and in files the user saves.

Read `ROADMAP.md` for what to build next. Work on one roadmap item at a time, on its own branch, and open a pull request.

## Commands

```sh
npm ci                          # install (Playwright only)
npx playwright install chromium # once per machine
npm test                        # end-to-end tests against site/index.html
npx serve site                  # run locally (or open site/index.html)
```

CI (`.github/workflows/ci.yml`) runs the tests on every push and pull request, and deploys `site/` to GitHub Pages from `main` only when they pass.

## Layout

- `site/index.html`: the whole app, one file for now (Phase 2 splits it). In order: CSS tokens and styles, static HTML (header, map, panel, side sheet with the agent guide), then one script with sections marked by `/* ---------- name ---------- */` comments: sample model, helpers, model → states, view, SVG drawing, pan/zoom/drag, search, graph queries, panel rendering, decision lifecycle, inline editing, floating search and Ask, side sheet, import, map library and Save, toolbar/timeline/legend, actions, undo/redo, boot.
- `site/llms.txt`: the format guide for AI agents, served next to the app.
- `tests/smoke.test.mjs`: Playwright end-to-end tests (Node's built-in test runner).

The agent guide exists twice: the `<article id="guide">` in `index.html` and `site/llms.txt`. **Change both together** until roadmap item 2.4 generates them from one source. A test checks that the guide's example imports cleanly.

## Design rules (keep these)

These came out of deliberate decisions. Don't change them without asking.

1. **One model, many views.** Overlays, projects, decisions and areas are lenses over the same model, never copies of the diagram.
2. **Layout is separate from meaning.** `model` holds semantics; `layout` holds positions. Moving a box must never look like an architecture change.
3. **Positions are stable and belong to people.** Never move a position that exists. New components get one from `autoPlace()`. Agents never write coordinates.
4. **Ids are permanent.** Component, connection, area, step and map ids never change; the map `id` is how an update is recognized. `system` is only a display name.
5. **Closed decisions are immutable.** Accepted, rejected and superseded decisions can't be edited or deleted; the only allowed change is accepted → superseded. Enforced in `closedDecisionChanges()`.
6. **Projects are changesets over one baseline.** Current = baseline + done steps of all projects, in `done` order. Dependencies are declared per step (`depends_on`, across projects allowed); Wayfinder derives undeclared needs and conflicts. No project-to-project dependencies.
7. **Areas have no geometry.** They're drawn around their members.
8. **Edits change the definition.** An inspector edit changes where an element is defined: the baseline, or the project step that adds it.
9. **No network.** The app makes no requests. The Content-Security-Policy meta tag in `index.html` sets `connect-src 'none'`; keep it.
10. **No backward compatibility.** The project is pre-1.0. Change the format freely and update the guide and sample; don't add migration code or fallbacks for old files unless asked.

## Conventions

- **Escape everything from the model** with `esc()` before it goes into HTML. Maps come from agents and other people; one missed escape is an XSS hole.
- Plain JavaScript, no framework, no dependencies in the page (Phase 2 adds Vite + TypeScript, still no framework).
- Colors only through the CSS tokens on `:root`, defined for light and dark. Check both themes and a 400px-wide screen.
- User-facing text: plain, short, active voice. Name things the way users do ("components", not "nodes").
- Every new feature or fixed bug gets a test in `tests/`.
- Keep the sample model (`SAMPLE_MODEL`) passing the Model check with zero issues.

## Definition of done

- `npm test` passes, with a new test for the change.
- The example opens with a clean Model check.
- Agent guide updated in both places if the format changed.
- Works in light and dark, and at phone width.
