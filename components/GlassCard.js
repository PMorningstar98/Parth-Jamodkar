export default function GlassCard({ children, className = '', hover = true, as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`glass ${hover ? 'glass-hover' : ''} rounded-xl p-6 ${className}`} {...rest}>
      <span className="relative z-[1] flex h-full flex-col">{children}</span>
    </Tag>
  );
}
