export default function SectionHeading({ eyebrow, title, description, className = '', gradient = false }) {
  return (
    <div className={`mb-10 ${className}`}>
      {eyebrow && (
        <p className="eyebrow mb-3 flex items-center gap-2">
          <span className="inline-block h-px w-6 bg-gradient-to-r from-signal-cyan to-transparent" />
          {eyebrow}
        </p>
      )}
      <h2 className={`font-mono text-2xl font-bold sm:text-3xl ${gradient ? 'text-gradient' : 'text-ink'}`}>
        {title}
      </h2>
      {description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">{description}</p>}
    </div>
  );
}
