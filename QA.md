# Validation — face and widget studio

## Reference-inspired faces — 2026-10-11

- Added Equation, Tumble, Cutout, and Now; collection now contains ten faces. Equation expressions checked against hours 1–12, using degrees and base-10 logarithm.
- JavaScript syntax and Node state/date harness passed, including restoring each new face with widgets and correct 07–10 / 10 numbering. Existing year rollover, leap day, Monday indicator, escaping, invalid settings and unavailable-storage cases passed.
- Codex in-app browser: three rounds through all ten faces (30 switches), asserting the selected title after every switch. All five options exercised in both widget slots.
- Reload preserved Now, upper Week rhythm, lower Personal note, and edited text. Keyboard Enter selected Tumble; the focused face button had a visible solid outline.
- Visually inspected all four new faces. At 375 × 812, inspected full-page Now layout with both widgets; document width 360px, no horizontal overflow. Reset viewport after testing.
- Browser error/warning logs empty after interactions and final preview. Saved full-page Equation preview locally. No reference images included in the repository.
- Hardware fidelity and physical display readability remain unverified. Date boundaries are tested by the Node harness, not by changing the browser clock.

Validated on 2026-10-11 using Node 24 and the Codex in-app browser.

## Passed

- JavaScript syntax: node --check app.js.
- Node state/date checks: invalid JSON, unknown face/widget IDs, year rollover, leap day, Monday week indicator, note escaping and unavailable storage. These use a lightweight DOM stub, not a browser.
- Real browser: ten complete rounds through all six faces (60 switches), followed by successful widget editing.
- All five choices selected in each widget slot; personal-note editor appears when needed and hides otherwise.
- Reload preserved Radial face, Week rhythm upper slot, Personal note lower slot and edited note text.
- Markup-like note text rendered literally in the SVG; keyboard Enter activated a face. Visible focus ring verified on note input.
- Desktop visual inspection and 375px mobile viewport: stacked layout, usable controls, no horizontal overflow (document scroll width 360 <= viewport 375). Full-page mobile and desktop screenshots inspected.
- Browser error/warning log empty after interaction checks and after final reload.
- Final short-note sizing adjustment reloaded and visually checked. Git diff whitespace check passed.

## Scope and limits

Uploads, drawing, account, apply, weather, agenda and countdown were removed at the user's request; their previous checks and image-restore regression test are obsolete. Existing v1 local data is preserved but unused.

No real hardware, panel fidelity or refresh cadence validation. No full assistive-technology audit. Blocked-storage and date-boundary checks ran under a VM test harness, not through browser settings or clock changes. The full Pinterest board was obscured by a login overlay; only visible references informed the initial collection.

Work is delivered on a feature branch for review, not publicly deployed.

## Corrected schedule demo — 2026-10-11

- PASS: syntax, existing state/date/face tests, and new schedule checks (one sector, 60°–180° mapping, nine free/boundary dividers, no internal dividers at 3/4/5, toggle restores compact controls).
- PASS in browser: enabled schedule, switched through all ten faces, reloaded with schedule retained, disabled it and observed previous slot choices return. Final Everyday preview visually inspected. No console errors or warnings.
- The event is fixed sample data (2–6 PM), not an editable event/calendar integration. Physical hands remain above the sector. Schedule-only responsive regression was not independently completed; existing responsive layout is retained.
