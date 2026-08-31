export default function Badge({ variant = 'neutral', dot, pulse, children, className = '' }) {
  return (
    <span className={`badge badge--${variant} ${className}`}>
      {dot && <span className={`badge__dot ${pulse ? 'badge__dot--pulse' : ''}`} />}
      {children}
    </span>
  )
}
