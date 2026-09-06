import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiLogOut } from 'react-icons/fi'
import { navItems } from './navItems.js'
import { logout } from '../../store/slices/authSlice.js'
import { notifyInfo } from '../../utils/toast.jsx'

export default function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="brand">
          <span className="brand__mark">W</span>
          WebRTC
        </div>
      </div>

      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
        >
          <span className="nav-link__icon"><item.icon /></span>
          {item.label === 'Home' ? 'Dashboard' : item.label === 'New' ? 'Schedule Meeting' : item.label}
        </NavLink>
      ))}

      <div className="sidebar__footer">
        <button
          className="nav-link"
          style={{ width: '100%', border: 'none', background: 'none' }}
          onClick={() => {
            dispatch(logout())
            notifyInfo('You have been logged out.')
            navigate('/')
          }}
        >
          <span className="nav-link__icon"><FiLogOut /></span>
          Logout
        </button>
      </div>
    </aside>
  )
}
