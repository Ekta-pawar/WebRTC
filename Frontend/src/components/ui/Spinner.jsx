export default function Spinner({ light, className = '' }) {
  return <span className={`spinner ${light ? 'spinner--light' : ''} ${className}`} />
}
