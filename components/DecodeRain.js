'use client';

import { useEffect, useRef } from 'react';

// A duotone "digital rain" tuned to the site's thesis: every column is either
// a KNOWN signal (blue, resolves into clean hex bytes and holds) or an
// UNKNOWN one (violet, scrambles through glyphs and never quite settles).
// This is the one deliberately loud element on the page — everywhere else
// stays quiet on purpose.
const GLYPHS = '01ABCDEF{}[]<>#$%*+-/\\'.split('');

export default function DecodeRain({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let columns = [];
    const fontSize = 15;
    // Canvas can't read CSS custom properties directly inside ctx.font,
    // so resolve the actual font-family string next/font generated.
    const resolvedFont =
      getComputedStyle(document.documentElement).getPropertyValue('--font-jbmono').trim() ||
      'monospace';
    const fontStack = `${fontSize}px ${resolvedFont}, monospace`;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      const columnCount = Math.floor(width / fontSize);
      columns = new Array(columnCount).fill(0).map((_, i) => ({
        x: i * fontSize,
        y: Math.random() * -height,
        speed: 0.4 + Math.random() * 0.9,
        known: Math.random() > 0.45,
        resolved: false,
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        flicker: Math.floor(Math.random() * 12),
      }));
    }

    resize();
    window.addEventListener('resize', resize);

    let raf;
    function draw() {
      ctx.fillStyle = 'rgba(5, 6, 15, 0.18)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = fontStack;

      columns.forEach((col) => {
        col.flicker -= 1;
        if (col.flicker <= 0) {
          col.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          col.flicker = col.known ? 20 + Math.random() * 30 : 4 + Math.random() * 6;
        }

        ctx.fillStyle = col.known ? 'rgba(76, 124, 243, 0.85)' : 'rgba(157, 92, 255, 0.75)';
        ctx.fillText(col.glyph, col.x, col.y);

        col.y += col.speed * (prefersReducedMotion ? 0.15 : 1);
        if (col.y > height + fontSize) {
          col.y = -fontSize;
          col.known = Math.random() > 0.45;
        }
      });

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
