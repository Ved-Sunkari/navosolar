(function () {
  'use strict';

  // Market zoom — tab-controlled TAM/SAM/SOM views.
  // Animate the SVG viewBox (rather than CSS transform) so paths stay crisp
  // throughout the transition instead of the browser scaling a cached bitmap.
  const ZOOM_VIEWS = {
    tam: { x: 0,      y: 0,      w: 700, h: 700 },
    sam: { x: 464.44, y: 326.82, w: 20,  h: 20  },
    som: { x: 464.44, y: 326.82, w: 20,  h: 20  },
  };
  const ZOOM_DURATION = 850; // ms

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  document.querySelectorAll('.market-zoom').forEach(function (zoom) {
    const tabs = zoom.querySelectorAll('.zoom-tab');
    const svg = zoom.querySelector('.zoom-svg');
    let currentVB = Object.assign({}, ZOOM_VIEWS.som);
    let raf = null;

    function setVB(vb) {
      svg.setAttribute('viewBox', vb.x + ' ' + vb.y + ' ' + vb.w + ' ' + vb.h);
    }

    function animateTo(target) {
      if (raf) cancelAnimationFrame(raf);
      const from = Object.assign({}, currentVB);
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / ZOOM_DURATION);
        const e = easeInOutCubic(t);
        currentVB = {
          x: from.x + (target.x - from.x) * e,
          y: from.y + (target.y - from.y) * e,
          w: from.w + (target.w - from.w) * e,
          h: from.h + (target.h - from.h) * e,
        };
        setVB(currentVB);
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = null;
        }
      }
      raf = requestAnimationFrame(tick);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const view = tab.getAttribute('data-view');
        zoom.setAttribute('data-view', view);
        tabs.forEach(function (t) {
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
        animateTo(ZOOM_VIEWS[view]);
      });
    });
  });
})();
