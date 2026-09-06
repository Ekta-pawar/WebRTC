import { FiMicOff, FiVideoOff } from 'react-icons/fi'

export default function ParticipantsPanel({ participants, isHost, onMute, onRemove }) {
  return (
    <div className="participants-panel">
      <div className="participants-panel__count">{participants.length} in this meeting</div>
      <ul className="participants-list">
        {participants.map((p) => (
          <li key={p.id} className="participants-list__item">
            <span className="participants-list__avatar" style={{ background: p.color }}>
              {p.name[0].toUpperCase()}
            </span>
            <span className="participants-list__name">
              {p.isYou ? 'You' : p.name}
              {p.isHost && <span className="video-tile__host-tag">Host</span>}
            </span>
            <span className="participants-list__status">
              {!p.micOn && <FiMicOff />}
              {!p.cameraOn && <FiVideoOff />}
            </span>
            {isHost && !p.isYou && (
              <span className="participants-list__actions">
                {p.micOn && (
                  <button className="btn btn--ghost btn--sm" onClick={() => onMute?.(p.id)}>Mute</button>
                )}
                <button className="btn btn--ghost btn--sm" style={{ color: 'var(--color-danger)' }} onClick={() => onRemove?.(p.id)}>
                  Remove
                </button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
