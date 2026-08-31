import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function TopBar({ title, onMenuClick, onBack }) {
  const user = useSelector((s) => s.auth.user)
  const navigate = useNavigate()
  const initial = user?.name?.[0]?.toUpperCase() || 'U'

  return (
    <header className="topbar">
      <div className="topbar__left">
        {onBack ? (
          <button className="topbar__menu-btn topbar__back-btn" onClick={() => navigate(onBack)} aria-label="Go back">←</button>
        ) : (
          <button className="topbar__menu-btn" onClick={onMenuClick} aria-label="Open menu">☰</button>
        )}
        <span className="topbar__title">{title}</span>
      </div>
      <Link to="/settings" className="topbar__avatar" aria-label="Profile and settings">
        {initial}
      </Link>
    </header>
  )
}
