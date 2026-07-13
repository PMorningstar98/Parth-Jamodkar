'use client';

import status from '@/data/status.json';

function Corner({ className }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-4 w-4 border-signal-blue/70 ${className}`}
    />
  );
}

function Row({ label, value, tone }) {
  const toneClass =
    tone === 'accent' ? 'text-signal-blue' : tone === 'muted' ? 'italic text-ink-muted' : 'text-ink';
  return (
    <div className="flex gap-3">
      <span className="w-16 shrink-0 text-ink-faint">{label}</span>
      <span className={toneClass}>{value}</span>
    </div>
  );
}

// A Solo-Leveling-style "System" status window — corner brackets, blue glow,
// monospace — but the attributes are real security disciplines instead of
// STR/AGI/INT. A quiet homage that also happens to be a useful capability view.
// Rendered as plain markup (visible by default in the HTML); the bar fill is a
// pure-CSS animation so nothing depends on client JS to become visible.
export default function StatusWindow() {
  return (
    <div className="relative mx-auto max-w-xl rounded-xl border border-signal-blue/25 bg-void/70 p-6 shadow-[0_0_40px_-8px_rgba(76,124,243,0.45)] backdrop-blur-sm sm:p-7">
      <Corner className="left-2 top-2 border-l-2 border-t-2" />
      <Corner className="right-2 top-2 border-r-2 border-t-2" />
      <Corner className="bottom-2 left-2 border-b-2 border-l-2" />
      <Corner className="bottom-2 right-2 border-b-2 border-r-2" />

      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-signal-blue/[0.05] to-transparent" />

      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-signal-blue">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-signal-blue" />
            ⟨ STATUS ⟩
          </div>
          <span className="font-mono text-[11px] text-ink-faint">LV. {status.level}</span>
        </div>

        <div className="mb-6 space-y-1.5 font-mono text-sm">
          <Row label="NAME" value="Parth Jamodkar" />
          <Row label="CLASS" value={status.class} tone="accent" />
          <Row label="RANK" value={`${status.rank} · ${status.rankNote}`} tone="accent" />
          <Row label="TITLE" value={status.title} tone="muted" />
        </div>

        <p className="eyebrow mb-3">Attributes</p>
        <div className="space-y-3">
          {status.attributes.map((attr, i) => (
            <div key={attr.name}>
              <div className="mb-1 flex items-center justify-between font-mono text-xs">
                <span className="text-ink-muted">{attr.name}</span>
                <span className="text-signal-blue">{attr.value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className="stat-bar h-full rounded-full bg-gradient-to-r from-signal-blue-dim to-signal-blue"
                  style={{ '--bar-w': `${attr.value}%`, '--bar-delay': `${0.15 + i * 0.08}s` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 font-mono text-[11px] italic text-ink-faint">
          // the System has determined your class.
        </p>
      </div>
    </div>
  );
}
