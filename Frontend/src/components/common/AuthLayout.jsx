import { Link } from 'react-router-dom'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__card">
        <Link to="/" className="auth-layout__brand">
          <div className="brand">
            <span className="brand__mark">N</span>
            Nexus
          </div>
        </Link>

        <div className="card card--padded">
          <div className="auth-layout__heading">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
        </div>

        {footer && <div className="auth-layout__footer">{footer}</div>}
      </div>
    </div>
  )
}
