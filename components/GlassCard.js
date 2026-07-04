export default function GlassCard({ children, className = '', hover = true, as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`glass ${hover ? 'glass-hover' : ''} rounded-xl p-6 ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
