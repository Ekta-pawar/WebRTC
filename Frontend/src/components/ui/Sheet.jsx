import { FiX } from 'react-icons/fi'

export default function Sheet({ open, onClose, side = 'bottom', title, dark, children }) {
  if (!open) return null

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className={`sheet sheet--${side} ${dark ? 'sheet--dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        {side === 'bottom' && <div className="sheet__grip" />}
        {title && (
          <div className="sheet__header">
            <h3>{title}</h3>
            <button className="modal__close" onClick={onClose} aria-label="Close"><FiX /></button>
          </div>
        )}
        <div className="sheet__body scroll-y">{children}</div>
      </div>
    </div>
  )
}
