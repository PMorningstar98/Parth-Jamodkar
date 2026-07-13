'use client';

import { useEffect, useRef } from 'react';

// A duotone "digital rain" tuned to the site's thesis: every stream is either
// a KNOWN signal (blue) that periodically RESOLVES into a stable hex byte and
// locks in place — the moment of identifying a signal — or an UNKNOWN one
// (violet) that keeps scrambling and never settles. Bright falling heads leave
// fading tails behind them. This is the one deliberately loud element on the
// page — everywhere else stays quiet on purpose.
const SCRAMBLE = '01ABCDEF{}[]<>#$%*+-/\\!?=;:'.split('');
const HEX = '0123456789ABCDEF'.split('');

const KNOWN = { head: 'rgba(214, 228, 255, 0.96)', body: '76, 124, 243' };
const UNKNOWN = { head: 'rgba(233, 216, 255, 0.95)', body: '157, 92, 255' };

function pick(arr) {
  return arr[(Math.random() * arr.length) | 0];
}

export default function DecodeRain({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fontSize = 14;
    const resolvedFont =
      getComputedStyle(document.documentElement).getPropertyValue('--font-jbmono').trim() ||
      'monospace';

    let width = 0;
    let height = 0;
    let rows = 0;
    let dpr = 1;
    let columns = [];
    let locks = [];

    function makeColumn(x) {
      const known = Math.random() > 0.42;
      return {
        x,
        row: -2 - ((Math.random() * 40) | 0),
        speed: 0.18 + Math.random() * 0.42,
        acc: 0,
        known,
        glyph: pick(known ? HEX : SCRAMBLE),
      };
    }

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rows = Math.ceil(height / fontSize);
      const colCount = Math.ceil(width / fontSize);
      columns = new Array(colCount).fill(0).map((_, i) => makeColumn(i * fontSize));
      locks = [];
      ctx.fillStyle = '#05060f';
      ctx.fillRect(0, 0, width, height);
    }

    resize();
    window.addEventListener('resize', resize);

    let raf;
    function draw() {
      // Translucent wash each frame — this is what turns bright heads into
      // gently fading tails.
      ctx.fillStyle = 'rgba(5, 6, 15, 0.11)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px ${resolvedFont}, monospace`;
      ctx.textBaseline = 'top';

      const step = prefersReduced ? 0.14 : 1;

      columns.forEach((col) => {
        col.acc += col.speed * step;
        while (col.acc >= 1) {
          col.acc -= 1;
          col.row += 1;
          col.glyph = pick(col.known ? HEX : SCRAMBLE);

          // Known streams occasionally resolve a byte that locks and glows.
          if (col.known && Math.random() < 0.06 && col.row > 0 && col.row < rows) {
            locks.push({ x: col.x, y: col.row * fontSize, glyph: col.glyph, life: 1 });
          }

          if (col.row > rows + 2) {
            col.row = -2 - ((Math.random() * 24) | 0);
            col.known = Math.random() > 0.42;
            col.speed = 0.18 + Math.random() * 0.42;
          }
        }

        const y = col.row * fontSize;
        if (y >= -fontSize && y <= height) {
          const c = col.known ? KNOWN : UNKNOWN;
          // Soft colored glow just behind the head to thicken the trail start.
          ctx.fillStyle = `rgba(${c.body}, 0.5)`;
          ctx.fillText(col.glyph, col.x, y - fontSize);
          // Bright head, redrawn every frame so it stays crisp between steps.
          ctx.fillStyle = c.head;
          ctx.fillText(col.glyph, col.x, y);
        }
      });

      // Age and render locked "resolved" bytes.
      locks = locks.filter((l) => {
        l.life -= 0.012;
        if (l.life <= 0) return false;
        const a = Math.min(1, l.life * 1.4);
        ctx.fillStyle = `rgba(140, 180, 255, ${0.85 * a})`;
        ctx.fillText(l.glyph, l.x, l.y);
        return true;
      });
      if (locks.length > 80) locks.splice(0, locks.length - 80);

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
