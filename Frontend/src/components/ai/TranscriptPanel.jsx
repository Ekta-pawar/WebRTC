export default function TranscriptPanel({ lines, className = '' }) {
  if (!lines.length) {
    return <div className="ai-panel__placeholder">The live transcript will appear here once the AI assistant is running.</div>
  }

  return (
    <div className={`transcript-panel scroll-y ${className}`}>
      {lines.map((line) => (
        <div key={line.id} className="transcript-line">
          <div className="transcript-line__meta">
            <strong>{line.speaker}</strong> <span>{line.time}</span>
          </div>
          <p>{line.text}</p>
        </div>
      ))}
    </div>
  )
}
