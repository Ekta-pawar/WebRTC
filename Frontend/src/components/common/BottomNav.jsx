import { NavLink } from 'react-router-dom'
import { navItems } from './navItems.js'

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `bottom-nav__item ${item.cta ? 'bottom-nav__item--cta' : ''} ${isActive ? 'is-active' : ''}`
          }
        >
          <span className="bottom-nav__icon"><item.icon /></span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
