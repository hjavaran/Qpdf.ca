// Qpdf motion graphics controller (homepage "How it works", /privacy/ offline
// test, /about/). Each graphic is an element with [data-qp-motion]; its
// markup and CSS live in src/partials/motion-*.html.
//
// Without JavaScript, or with prefers-reduced-motion, the CSS shows a static
// summary frame. Here we:
//   - set data-mo="pause" (CSS animations attached but paused at frame 0),
//   - switch to data-mo="play" only while the graphic is on screen, the tab is
//     visible and the visitor has not paused it,
//   - add a Pause / Play button (WCAG 2.2.2), remembered in this browser only.
// Nothing here makes a network request.

const KEY = 'qpdf.motion';
const roots = Array.from(
  document.querySelectorAll<HTMLElement>('[data-qp-motion]')
);

if (roots.length) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set<HTMLElement>();
  let userPaused = false;
  try {
    userPaused = localStorage.getItem(KEY) === 'paused';
  } catch {
    /* storage unavailable: animations play */
  }

  const NS = 'http://www.w3.org/2000/svg';
  const icon = (cls: string, d: string): SVGSVGElement => {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', cls);
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    svg.append(path);
    return svg;
  };

  const buttons = new Map<HTMLElement, HTMLButtonElement>();
  for (const root of roots) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mo-toggle';
    btn.append(
      icon('mo-i-pause', 'M5.5 3.5v9M10.5 3.5v9'),
      icon('mo-i-play', 'M5.5 3.5v9l7-4.5z')
    );
    btn.addEventListener('click', () => {
      userPaused = !userPaused;
      try {
        localStorage.setItem(KEY, userPaused ? 'paused' : 'play');
      } catch {
        /* remembered for this page view only */
      }
      sync();
    });
    (root.querySelector('.mo-frame') ?? root).append(btn);
    buttons.set(root, btn);
  }

  function sync(): void {
    for (const root of roots) {
      const btn = buttons.get(root)!;
      if (reduce.matches) {
        delete root.dataset.mo; // static frame from CSS
        btn.hidden = true;
        continue;
      }
      btn.hidden = false;
      const play = visible.has(root) && !document.hidden && !userPaused;
      root.dataset.mo = play ? 'play' : 'pause';
      const label = userPaused ? 'Play animation' : 'Pause animation';
      if (btn.getAttribute('aria-label') !== label) {
        btn.setAttribute('aria-label', label);
        btn.title = label;
        btn.dataset.paused = String(userPaused);
      }
    }
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) visible.add(el);
          else visible.delete(el);
        }
        sync();
      },
      { threshold: 0.3 }
    );
    for (const root of roots) io.observe(root);
  } else {
    for (const root of roots) visible.add(root);
  }

  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener?.('change', sync);
  sync();
}
