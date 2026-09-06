import { FiInbox } from 'react-icons/fi'

export default function EmptyState({ icon = <FiInbox size={22} />, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  )
}
