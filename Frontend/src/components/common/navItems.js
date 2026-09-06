import { FiHome, FiCalendar, FiPlusCircle, FiFileText, FiUser } from 'react-icons/fi'

export const navItems = [
  { to: '/dashboard', icon: FiHome, label: 'Home' },
  { to: '/upcoming', icon: FiCalendar, label: 'Meetings' },
  { to: '/schedule', icon: FiPlusCircle, label: 'New', cta: true },
  { to: '/notes', icon: FiFileText, label: 'Notes' },
  { to: '/settings', icon: FiUser, label: 'Profile' },
]
