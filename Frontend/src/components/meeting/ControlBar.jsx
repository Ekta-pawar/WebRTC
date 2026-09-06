import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiMonitor, FiMessageSquare, FiUsers, FiPhoneOff } from 'react-icons/fi'
import { MdAutoAwesome } from 'react-icons/md'
import { BsRecordCircle } from 'react-icons/bs'

export default function ControlBar({
  micEnabled,
  cameraEnabled,
  screenSharing,
  recordingActive,
  chatOpen,
  participantsOpen,
  aiOpen,
  unreadChatCount = 0,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleChat,
  onToggleParticipants,
  onToggleAi,
  onToggleRecording,
  onLeave,
}) {
  return (
    <div className="control-bar">
      <button className={`control-btn ${!micEnabled ? 'is-off' : ''}`} onClick={onToggleMic} aria-label="Toggle microphone">
        {micEnabled ? <FiMic /> : <FiMicOff />}
      </button>
      <button className={`control-btn ${!cameraEnabled ? 'is-off' : ''}`} onClick={onToggleCamera} aria-label="Toggle camera">
        {cameraEnabled ? <FiVideo /> : <FiVideoOff />}
      </button>
      <button className={`control-btn ${screenSharing ? 'is-active' : ''}`} onClick={onToggleScreenShare} aria-label="Share screen">
        <FiMonitor />
      </button>
      <button className={`control-btn ${chatOpen ? 'is-active' : ''}`} onClick={onToggleChat} aria-label="Chat">
        <FiMessageSquare />
        {unreadChatCount > 0 && <span className="control-btn__dot" />}
      </button>
      <button className={`control-btn ${participantsOpen ? 'is-active' : ''}`} onClick={onToggleParticipants} aria-label="Participants">
        <FiUsers />
      </button>
      <button className={`control-btn control-btn--ai ${aiOpen ? 'is-active' : ''}`} onClick={onToggleAi} aria-label="AI Notes">
        <MdAutoAwesome />
      </button>
      <button className={`control-btn ${recordingActive ? 'is-recording' : ''}`} onClick={onToggleRecording} aria-label="Record">
        <BsRecordCircle />
      </button>
      <button className="control-btn control-btn--leave" onClick={onLeave} aria-label="Leave meeting">
        <FiPhoneOff /> Leave
      </button>
    </div>
  )
}
