# Motion graphics

Two original, dependency-free animations that show the core promise: the
document never leaves the visitor's device. Neither is on the homepage or a
tool page (a homepage "How it works" animation was tried and removed).

| Graphic | Where | Partial | What it shows |
| --- | --- | --- | --- |
| Offline bench | `/privacy/`, "Test it yourself" | `src/partials/motion-offline.html` | A tool page reaches "Ready to work offline" (the real indicator's wording and colours); a red ring then draws itself around the Wi-Fi switch with one soft halo, the switch turns off, the ring fades, and a PDF is still compressed and saved to Downloads. The static frame keeps the ring around the off switch. |
| In place | `/about/`, after "Why Qpdf.ca exists" | `src/partials/motion-inplace.html` | One page is compressed, merged and redacted in turn without leaving the frame. |

## How it loads (keep this intact)

| Layer | Where | On the critical path? |
| --- | --- | --- |
| Markup | inline in each partial | yes, ~1 KB gzipped per page |
| Layout-only CSS (sizes, aspect ratios, paddings, margins) | inline `<style>` in each partial and in `motion-base.html` | yes, ~0.4 KB gzipped |
| Everything visual + all animation | `src/css/qpdf-motion.css` (hashed) | **no**: `motion.ts` appends a `<link>` to it after the page's `load` event; without JS a `<noscript>` link (written by `scripts/qpdf/postbuild.mjs`) loads it |
| Controller | `src/js/qpdf/motion.ts`, imported by `site.ts` (adds ~0.7 KB gzipped to the existing `site` chunk; a no-op on pages without a graphic) | no (module script, no extra request) |

Until the stylesheet arrives the frames are reserved at their final size and
invisible (`visibility: var(--mo-vis, hidden)`), so nothing shifts and nothing
unstyled flashes. **Rule:** a property set in the inline layout layer is never
set again in `qpdf-motion.css`; box sizes live only inline. Otherwise the late
stylesheet can resize the box (layout shift).

Why not simpler (each was measured on the former homepage graphic and
rejected): inline CSS pushed the homepage HTML past what fits in the first
network round trip; a stylesheet in `<head>` or inside `site.css` added a
render-blocking round trip; a separate controller chunk, or any request
started before LCP, competed with the preloaded hero fonts. Each cost
Lighthouse's mobile LCP ~150–300 ms. Measured budgets: the homepage HTML can
grow ~2 KB gzipped and `site.css` ~1 KB before that happens, and nothing new
should be requested before the `load` event. Follow the same pattern for any
new graphic.

Side effect: because `site.js` references the stylesheet, tool pages' offline
preparation (`offline-manifest.json`) caches it too (3.7 KB). That keeps the
graphics working offline whichever page was visited first.

## Rules the artwork follows

- No document ever moves upward, nothing crosses the frame, and there are no
  clouds, servers, upload arrows or "sending" progress bars.
- The artwork is `aria-hidden`; the surrounding text (numbered test steps,
  About copy) carries the information.
- Labels are HTML, not SVG text, so they stay legible on phones.
- Colours come from the `--qp-*` tokens (light and dark). The privacy graphic
  sits in the always-dark panel and has its own fixed palette; its ring uses
  a brighter brand red (`#f0505d`) so it reads on the dark title bar.

## Behaviour

- **Static frame by default.** Without JavaScript, or with
  `prefers-reduced-motion: reduce`, each graphic shows a composed summary
  frame (e.g. Wi-Fi off and ringed, the compressed PDF saved to Downloads).
- **Plays only when useful.** `motion.ts` sets `data-mo="pause"` (animations
  attached, paused at frame 0) and switches to `"play"` only while the graphic
  is at least 30 % on screen and the tab is visible.
- **Pause / Play button** (WCAG 2.2.2). The choice is stored in this browser
  only (`localStorage["qpdf.motion"]`).
- **No layout shift.** Space is reserved with `aspect-ratio`; inline SVG
  shapes are not LCP candidates.
- **Cheap to run.** Only `transform` and `opacity` are animated, plus stroke
  offsets that draw the Wi-Fi slash and the attention ring.
- Don't hide an animated element with `display: none` in a media query:
  that restarts its animations and puts it out of step with the rest of the
  loop. Hide it visually instead (see `.mo-wifi-txt`).

## Weight and requests

On the two pages with a graphic: ~1.4 KB gzipped of inline HTML/CSS and one
same-origin, hashed, cached stylesheet loaded after the `load` event
(`qpdf-motion-*.css`). Every Qpdf page's `site` chunk grows by ~0.7 KB gzipped
(the controller). The homepage HTML and tool page HTML and CSS are unchanged.
No third-party requests, fonts or libraries; the graphics keep working
offline (the service worker caches `/assets/*`).

## Editing the timeline

Each graphic is one loop (`--mo-t`: 14 s on /privacy/, 15 s on /about/) and all its keyframes
use percentages of that loop, so the pieces stay in step. To review a frame,
pause every animation and seek, e.g. in DevTools:

```js
for (const a of document.getAnimations()) { a.pause(); a.currentTime = 6000 % a.effect.getTiming().duration; }
```
