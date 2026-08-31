export default function VideoTile({ participant, videoRef, className = '' }) {
  const showVideo = participant.isYou && participant.cameraOn && videoRef
  const initial = participant.name?.[0]?.toUpperCase() || '?'

  return (
    <div className={`video-tile ${className}`}>
      {showVideo ? (
        <video ref={videoRef} autoPlay muted playsInline className="video-tile__video" />
      ) : (
        <div className="video-tile__avatar" style={{ background: participant.color }}>
          {initial}
        </div>
      )}

      <div className="video-tile__footer">
        <span className="video-tile__name">
          {participant.name}
          {participant.isHost && <span className="video-tile__host-tag">Host</span>}
        </span>
        {!participant.micOn && <span className="video-tile__mic-off" aria-label="Muted">🔇</span>}
      </div>
    </div>
  )
}
