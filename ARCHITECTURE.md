# Architecture

Vanilla TypeScript + Vite. No framework runtime — this page measures the
browser, so it ships minimal JS (~5 KB gzip).

```
index.html          Vite entry, semantic sections + SVG diagram shell
src/main.ts         DOMContentLoaded: hydrate icons, initApp
src/icons.ts        Inline Phosphor SVG paths (no webfont)
src/styles/         CSS custom-property theme (light/dark, reduced-motion)
src/lib/safe.ts     safeProbe guard for optional APIs
src/probes/
  collectors.ts     window/screen collectors (pure reads, guarded)
  heuristics.ts     Pure logic: zoom, viewport, extended-display, OS/VM
  fingerprints.ts   WebGL renderer probe for the VM hint (guarded)
src/ui/
  diagram.ts        Pure geometry in the screen-local frame
                      (screen at origin, window by compLeft/compTop) + SVG render
  render.ts         Wiring: refresh on resize/visualViewport/DPR/slider,
                    pointer cursor marker via pointermove + rAF transform
tests/unit/         Vitest: heuristics + diagram geometry
tests/e2e/          Playwright: built-page smoke, zero console/page errors
```

Data flow: `displayProperties()` re-collects window/screen, recomputes the
SVG viewBox + result cards. Pointer position paints at most once per frame.
Refresh is event-driven (resize, visualViewport, DPR, slider) plus a 1s
position-key check, since window moves fire no event. No blind re-render loop.
