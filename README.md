# eink-clock-studio

## Still — E-ink Clock Studio

A dependency-free companion editor prototype for a round monochrome e-ink display with physical analog hands.

### Run on Windows or Mac

Download this private repository with GitHub's Code → Download ZIP and extract it, or clone it using your existing GitHub authentication. Open `index.html` in a modern browser. No installation, build, account, or internet access is required.

For stable browser storage, optionally run `python -m http.server 8000` (Windows) or `python3 -m http.server 8000` (Mac) from this folder, then open `http://localhost:8000` **on that same computer**. This is not a remotely accessible preview. Local file storage behavior varies by browser; the app reports storage failures.

### Included

- Quiet: local date and demo weather.
- Agenda: explicit AM/PM 12-hour windows, sample event sectors including 2–3 PM.
- Countdown: calendar days remaining, editable target/name, elapsed progress ring. Past targets clamp to zero. Date arithmetic uses UTC day indices of local calendar dates to avoid daylight-saving hour errors.
- Canvas: validated PNG/JPEG/WebP uploads (8 MB maximum), center crop, monochrome threshold/invert, remove image, pointer drawing, undo and clear.
- Independent marker/date/weather toggles; browser-local persistence; physical hand overlay above all artwork.
- Clearly labeled demo sign-in and simulated apply; no credentials, API integrations, telemetry or network calls.

### Continue on another workstation

Clone this private repository, read `AGENTS.md`, `PRODUCT_BRIEF.md`, `ROADMAP.md`, and `QA.md`, and open `index.html`. Browser-local artwork/settings do not sync across machines. Git transfers source only.

Files: `index.html` structure, `style.css` responsive presentation, `app.js` state/rendering/interactions. No package manager or dependencies.

### Validation status

Source was recovered from the originating task's known patch content and uploaded through the authenticated GitHub connector. It was not read back from the Windows filesystem, whose execution helper remained unavailable even after restart. JavaScript syntax compilation passed in a V8 isolate; browser rendering, interaction and device tests remain pending. See `QA.md`. No public site is deployed.
