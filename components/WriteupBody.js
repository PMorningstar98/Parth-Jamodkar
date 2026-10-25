'use client';

import { useState } from 'react';

// Render inline formatting: **bold**, `code`, *italic*, [text](url)
function Inline({ text }) {
  const parts = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) {
      parts.push(<strong key={key++} className="font-semibold text-ink">{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith('`')) {
      parts.push(
        <code key={key++} className="rounded bg-panel px-1.5 py-0.5 font-mono text-[0.85em] text-signal-cyan">
          {tok.slice(1, -1)}
        </code>
      );
    } else if (tok.startsWith('*')) {
      parts.push(<em key={key++} className="text-ink-muted">{tok.slice(1, -1)}</em>);
    } else {
      const mm = tok.match(/\[([^\]]+)\]\(([^)]+)\)/);
      parts.push(
        <a key={key++} href={mm[2]} target="_blank" rel="noreferrer" className="text-signal-blue underline decoration-signal-blue/40 underline-offset-2 transition-colors hover:decoration-signal-blue">
          {mm[1]}
        </a>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function CodeBlock({ lang, title, content }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-line bg-[#0b0f17]">
      <figcaption className="flex items-center justify-between gap-4 border-b border-line-soft bg-panel/60 px-4 py-2.5">
        <span className="truncate font-mono text-xs text-ink-faint">
          {title || lang}
        </span>
        <span className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">{lang}</span>
          <button
            type="button"
            onClick={copy}
            className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-ink-muted transition-colors hover:border-signal-blue/50 hover:text-ink"
          >
            {copied ? 'copied ✓' : 'copy'}
          </button>
        </span>
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-ink">
        <code>{content}</code>
      </pre>
    </figure>
  );
}

function DataTable({ headers, rows, mono, highlightRows }) {
  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-panel/60">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left font-mono text-xs font-medium uppercase tracking-wide text-ink-faint">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const hot = highlightRows && highlightRows.includes(i);
            return (
              <tr key={i} className={`border-b border-line-soft last:border-0 ${hot ? 'bg-signal-blue/[0.07]' : ''}`}>
                {row.map((cell, j) => (
                  <td key={j} className={`px-4 py-2.5 ${mono ? 'whitespace-nowrap font-mono text-xs' : 'text-ink-muted'} ${hot ? 'text-ink' : ''}`}>
                    {cell || <span className="text-ink-faint">—</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const CALLOUT_STYLES = {
  info: { border: 'border-signal-blue/40', title: 'text-signal-blue', icon: 'ℹ' },
  warn: { border: 'border-signal-violet/40', title: 'text-signal-violet', icon: '⚠' },
  signal: { border: 'border-signal-cyan/40', title: 'text-signal-cyan', icon: '⌖' },
};

function Callout({ variant = 'info', title, text }) {
  const s = CALLOUT_STYLES[variant] || CALLOUT_STYLES.info;
  return (
    <aside className={`my-8 rounded-xl border ${s.border} bg-panel/40 p-5`}>
      <p className={`mb-2 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wide ${s.title}`}>
        <span aria-hidden="true">{s.icon}</span> {title}
      </p>
      <p className="text-sm leading-relaxed text-ink-muted">
        <Inline text={text} />
      </p>
    </aside>
  );
}

function Figure({ src, alt, caption, base }) {
  return (
    <figure className="my-10">
      <img
        src={`${base}${src}`}
        alt={alt}
        loading="lazy"
        className="w-full rounded-xl border border-line"
      />
      {caption && (
        <figcaption className="mt-3 text-center font-mono text-xs leading-relaxed text-ink-faint">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function Download({ href, label, note, base }) {
  return (
    <a
      href={`${base}${href}`}
      download
      className="my-6 flex items-center justify-between gap-4 rounded-xl border border-line bg-panel/40 px-5 py-4 transition-colors hover:border-signal-blue/50"
    >
      <span>
        <span className="block font-mono text-sm text-signal-blue">↓ {label}</span>
        <span className="mt-0.5 block text-xs text-ink-faint">{note}</span>
      </span>
      <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">CSV</span>
    </a>
  );
}

export default function WriteupBody({ blocks, base = '' }) {
  return (
    <div className="writeup-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2':
            return (
              <h2 key={i} className="mt-14 mb-4 flex items-center gap-3 font-mono text-xl font-bold text-ink sm:text-2xl">
                <span className="inline-block h-5 w-1 rounded bg-gradient-to-b from-signal-blue to-signal-violet" aria-hidden="true" />
                {b.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} className="mt-10 mb-3 font-mono text-base font-semibold text-ink sm:text-lg">
                <span className="mr-2 text-signal-cyan" aria-hidden="true">›</span>
                {b.text}
              </h3>
            );
          case 'p':
            return (
              <p key={i} className="my-4 text-[15px] leading-[1.85] text-ink-muted sm:text-base">
                <Inline text={b.text} />
              </p>
            );
          case 'code':
            return <CodeBlock key={i} lang={b.lang} title={b.title} content={b.content} />;
          case 'table':
            return <DataTable key={i} headers={b.headers} rows={b.rows} mono={b.mono} highlightRows={b.highlightRows} />;
          case 'image':
            return <Figure key={i} src={b.src} alt={b.alt} caption={b.caption} base={base} />;
          case 'callout':
            return <Callout key={i} variant={b.variant} title={b.title} text={b.text} />;
          case 'download':
            return <Download key={i} href={b.href} label={b.label} note={b.note} base={base} />;
          case 'list':
            const Tag = b.ordered ? 'ol' : 'ul';
            return (
              <Tag key={i} className={`my-6 space-y-3 ${b.ordered ? 'list-decimal' : 'list-disc'} pl-6`}>
                {b.items.map((item, j) => (
                  <li key={j} className="text-[15px] leading-relaxed text-ink-muted sm:text-base">
                    <Inline text={item} />
                  </li>
                ))}
              </Tag>
            );
          case 'divider':
            return (
              <div key={i} className="my-10 flex items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-line" />
                <span className="font-mono text-xs text-ink-faint">//</span>
                <span className="h-px flex-1 bg-line" />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
