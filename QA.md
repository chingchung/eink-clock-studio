# Validation — face and widget studio

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
