# Roadmap

1. Review the six-face collection with the user and refine the strongest directions using individual reference pins.
2. Expand face and widget designs within the focused editor; avoid restoring removed product features without a user request.
3. Validate dial typography, hand occlusion and widget readability against actual display dimensions.
4. Consider per-face compositions and monochrome export after the core designs are approved. Export must exclude the physical-hand overlay.

## Architecture

Buildless HTML/CSS/JavaScript. SVG face and widget generation, CSS physical hands, validated serializable settings in localStorage under still-faces-v2. Older still-studio-v1 data is left untouched. No backend, telemetry, external fonts or dependencies. GitHub remains the cross-workstation source of truth.
