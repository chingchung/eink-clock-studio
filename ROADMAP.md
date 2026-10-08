# Roadmap / workstation handoff

1. Restore local shell/browser access or clone on the company Mac. Run the QA matrix and fix observed issues. Capture desktop/mobile screenshots through supported browser artifact tools.
2. Maintain the private GitHub repository as the workstation handoff. Source upload uses the authenticated GitHub connector because the Windows shell could not start. Public deployment and credential creation remain outside scope.
3. Add portable import/export of editable face settings and a hardware-ready monochrome image export, excluding physical hands. Add explicit storage management and per-face widget presets.
4. Validate design with actual display dimensions and mechanical clearances. Add image dithering and physical display simulation only after selecting panel requirements.
5. After explicit integration approval, design authentication, least-privilege calendar access, weather source/location consent, device pairing and secure transport. Replace demo controls gradually with visible connection and error states.

## Architecture

Single plain-JavaScript app with central serializable state, face-specific editor mounting, canvas image/drawing layer, SVG widget/sector layer, and CSS physical-hand overlay. localStorage uses key `still-studio-v1`. No backend or build tools. Future changes should split modules if complexity warrants it; preserve direct static preview or document a replacement run path.
