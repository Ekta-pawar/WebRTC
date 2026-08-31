import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import TopBar from './TopBar.jsx'
import Sidebar from './Sidebar.jsx'
import BottomNav from './BottomNav.jsx'
import Sheet from '../ui/Sheet.jsx'
import { navItems } from './navItems.js'
import { logout } from '../../store/slices/authSlice.js'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/upcoming': 'Upcoming Meetings',
  '/previous': 'Previous Meetings',
  '/schedule': 'Schedule Meeting',
  '/notes': 'My Notes',
  '/settings': 'Settings',
}

// Dashboard is the hub (hamburger opens the nav drawer); every other
// section is a drill-down page, so its top bar shows a back arrow instead.
const BACK_TARGETS = {
  '/upcoming': '/dashboard',
  '/previous': '/dashboard',
  '/schedule': '/dashboard',
  '/notes': '/dashboard',
  '/settings': '/dashboard',
}

export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const title = PAGE_TITLES[location.pathname] || 'Nexus'
  const backTarget = BACK_TARGETS[location.pathname]

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="app-shell">
      <TopBar title={title} onMenuClick={() => setDrawerOpen(true)} onBack={backTarget} />

      <div className="app-shell__body">
        <Sidebar />
        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>

      <BottomNav />

      <Sheet open={drawerOpen} onClose={() => setDrawerOpen(false)} side="left" title="Menu">
        <nav className="drawer-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setDrawerOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
            >
              <span className="nav-link__icon">{item.icon}</span>
              {item.label === 'Home' ? 'Dashboard' : item.label === 'New' ? 'Schedule Meeting' : item.label}
            </NavLink>
          ))}
          <NavLink to="/previous" onClick={() => setDrawerOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
            <span className="nav-link__icon">🕘</span>
            Previous Meetings
          </NavLink>
          <button className="nav-link" style={{ width: '100%', border: 'none', background: 'none' }} onClick={handleLogout}>
            <span className="nav-link__icon">🚪</span>
            Logout
          </button>
        </nav>
      </Sheet>
    </div>
  )
}
