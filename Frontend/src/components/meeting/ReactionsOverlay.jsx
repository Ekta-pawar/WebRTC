export default function ReactionsOverlay({ reactions }) {
  return (
    <div className="reactions-overlay" aria-hidden="true">
      {reactions.map((r) => (
        <span key={r.id} className="reactions-overlay__bubble" style={{ left: `${r.x}%` }}>
          {r.emoji}
        </span>
      ))}
    </div>
  )
}
