# Still — Faces & Widgets

A dependency-free clock-face studio for a round monochrome e-ink display with separate physical hands.

Open index.html directly, or serve this folder with any static HTTP server. No build or installation is required. For consistent browser storage, use an HTTP server.

## Collection 001

Six faces: Everyday, Grotesk, Orbit, Petal, Roman, and Radial. Each shares two independent widget slots with None, Date, Digital time (24-hour), Week rhythm (Monday first), or Personal note. Both note slots use the same editable message, up to 24 characters. Time and date follow the viewer's device.

The October 2026 redesign focuses only on faces and widgets. Account simulation, device apply, drawing, uploads, weather, agenda, and countdown tools have been removed. The visible portion of the user's Pinterest clock board informed typography and geometric directions; the full board was obscured by a sign-in overlay. Designs are original interpretations.

Settings persist locally under still-faces-v2. Previous still-studio-v1 artwork is left untouched but is not read or displayed. No network integrations or hardware connection. The physical hands in the preview sit above all face artwork; they are not part of the e-ink layer.

Run `node --check app.js` and `node tests/state.test.cjs`. See QA.md for actual browser validation and remaining limits.
