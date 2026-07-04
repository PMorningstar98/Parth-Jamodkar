export default function SectionHeading({ eyebrow, title, description, className = '' }) {
  return (
    <div className={`mb-10 ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-mono text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">{description}</p>}
    </div>
  );
}
