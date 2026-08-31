import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Badge from '../../components/ui/Badge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import VideoTile from '../../components/meeting/VideoTile.jsx'
import ControlBar from '../../components/meeting/ControlBar.jsx'
import ParticipantsPanel from '../../components/meeting/ParticipantsPanel.jsx'
import RecordingBadge from '../../components/meeting/RecordingBadge.jsx'
import ReactionsOverlay from '../../components/meeting/ReactionsOverlay.jsx'
import ChatPanel from '../../components/chat/ChatPanel.jsx'
import AiPanel from '../../components/ai/AiPanel.jsx'
import Sheet from '../../components/ui/Sheet.jsx'
import { useLocalMedia } from '../../hooks/useLocalMedia.js'
import { useScreenShare } from '../../hooks/useScreenShare.js'
import { useMeetingRecorder } from '../../hooks/useMeetingRecorder.js'
import { useMeetingSocket } from '../../hooks/useMeetingSocket.js'
import { useAiAssistant } from '../../hooks/useAiAssistant.js'
import { useIsMobile } from '../../hooks/useMediaQuery.js'
import { getMeetingById } from '../../services/meeting.js'
import {
  meetingJoined,
  meetingLeft,
  micToggled,
  cameraToggled,
  screenShareStarted,
  screenShareStopped,
  participantMutedByHost,
  participantRemoved,
} from '../../store/slices/meetingSlice.js'
import { aiReset } from '../../store/slices/aiSlice.js'
import '../../styles/meetingroom.css'

const PANEL_TITLES = { chat: 'Chat', participants: 'Participants', ai: 'AI Assistant' }

export default function MeetingRoomPage() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isMobile = useIsMobile()

  const { isLive, meetingName, micEnabled, cameraEnabled, screenSharing, participants, chatMessages } =
    useSelector((s) => s.meeting)
  const ai = useSelector((s) => s.ai)

  const [activePanel, setActivePanel] = useState(null)
  const [reactions, setReactions] = useState([])

  const { stream, videoRef } = useLocalMedia({ micEnabled, cameraEnabled })
  const screenShare = useScreenShare({
    onStart: () => dispatch(screenShareStarted()),
    onStop: () => dispatch(screenShareStopped()),
  })
  const recorder = useMeetingRecorder(stream)
  const { sendMessage } = useMeetingSocket()
  const aiAssistant = useAiAssistant()

  useEffect(() => {
    let active = true
    getMeetingById(meetingId).then((meeting) => {
      if (active) dispatch(meetingJoined({ meetingId, meetingName: meeting.title }))
    })
    return () => {
      active = false
      dispatch(meetingLeft())
      dispatch(aiReset())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId])

  const handleLeave = () => {
    stream?.getTracks().forEach((t) => t.stop())
    if (screenShare.sharing) screenShare.stop()
    if (recorder.active) recorder.stop()
    navigate('/dashboard')
  }

  const handleReact = (emoji) => {
    const id = Date.now() + Math.random()
    setReactions((prev) => [...prev, { id, emoji, x: 20 + Math.random() * 60 }])
    setTimeout(() => setReactions((prev) => prev.filter((r) => r.id !== id)), 2400)
  }

  if (!isLive) {
    return (
      <div className="meeting-room" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Spinner light />
          <span>Connecting to meeting…</span>
        </div>
      </div>
    )
  }

  const isHost = participants.find((p) => p.isYou)?.isHost
  const mainSpeaker = participants.find((p) => !p.isYou) || participants[0]
  const thumbnails = participants.filter((p) => p.id !== mainSpeaker?.id)

  const renderPanelContent = () => {
    if (activePanel === 'chat') return <ChatPanel messages={chatMessages} onSend={sendMessage} onReact={handleReact} />
    if (activePanel === 'participants')
      return (
        <ParticipantsPanel
          participants={participants}
          isHost={isHost}
          onMute={(id) => dispatch(participantMutedByHost(id))}
          onRemove={(id) => dispatch(participantRemoved(id))}
        />
      )
    if (activePanel === 'ai')
      return (
        <AiPanel
          status={ai.status}
          notes={ai.notes}
          transcript={ai.transcript}
          onStart={aiAssistant.start}
          onStop={aiAssistant.stop}
          onRetry={aiAssistant.retry}
        />
      )
    return null
  }

  return (
    <div className="meeting-room">
      <header className="meeting-room__topbar">
        <div className="meeting-room__topbar-left">
          <button className="meeting-room__back" onClick={handleLeave} aria-label="Leave meeting">←</button>
          <span className="meeting-room__name">{meetingName || 'Meeting'}</span>
          <Badge variant="live" dot pulse>LIVE</Badge>
        </div>
        {recorder.active && <RecordingBadge seconds={recorder.seconds} />}
      </header>

      <div className="meeting-room__body">
        <div className="meeting-room__stage">
          {screenSharing && (
            <div className="screen-share-tile">
              <video ref={screenShare.videoRef} autoPlay playsInline className="screen-share-tile__video" />
              <span className="screen-share-tile__label">🖥 Sharing Screen</span>
            </div>
          )}

          {isMobile ? (
            <div className="video-grid--mobile">
              {mainSpeaker && (
                <VideoTile
                  participant={mainSpeaker}
                  videoRef={mainSpeaker.isYou ? videoRef : undefined}
                  className="video-tile--main"
                />
              )}
              <div className="video-thumb-strip">
                {thumbnails.map((p) => (
                  <VideoTile key={p.id} participant={p} videoRef={p.isYou ? videoRef : undefined} />
                ))}
              </div>
            </div>
          ) : (
            <div className="video-grid">
              {participants.map((p) => (
                <VideoTile key={p.id} participant={p} videoRef={p.isYou ? videoRef : undefined} />
              ))}
            </div>
          )}

          <ReactionsOverlay reactions={reactions} />
        </div>

        {!isMobile && activePanel && (
          <aside className="meeting-room__side-panel">
            <div className="side-panel__header">
              <span>{PANEL_TITLES[activePanel]}</span>
              <button onClick={() => setActivePanel(null)} aria-label="Close panel">✕</button>
            </div>
            <div className="side-panel__body">{renderPanelContent()}</div>
          </aside>
        )}
      </div>

      <ControlBar
        micEnabled={micEnabled}
        cameraEnabled={cameraEnabled}
        screenSharing={screenSharing}
        recordingActive={recorder.active}
        chatOpen={activePanel === 'chat'}
        participantsOpen={activePanel === 'participants'}
        aiOpen={activePanel === 'ai'}
        onToggleMic={() => dispatch(micToggled())}
        onToggleCamera={() => dispatch(cameraToggled())}
        onToggleScreenShare={() => (screenSharing ? screenShare.stop() : screenShare.start())}
        onToggleChat={() => setActivePanel((p) => (p === 'chat' ? null : 'chat'))}
        onToggleParticipants={() => setActivePanel((p) => (p === 'participants' ? null : 'participants'))}
        onToggleAi={() => setActivePanel((p) => (p === 'ai' ? null : 'ai'))}
        onToggleRecording={() => (recorder.active ? recorder.stop() : recorder.start())}
        onLeave={handleLeave}
      />

      {isMobile && (
        <Sheet
          open={Boolean(activePanel)}
          onClose={() => setActivePanel(null)}
          side="bottom"
          dark
          title={activePanel && PANEL_TITLES[activePanel]}
        >
          {renderPanelContent()}
        </Sheet>
      )}
    </div>
  )
}
