import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import Switch from '../../components/ui/Switch.jsx'
import { logout } from '../../store/slices/authSlice.js'
import '../../styles/settings.css'

function SettingsSection({ icon, title, isOpen, onToggle, children }) {
  return (
    <div className={`settings-section ${isOpen ? 'is-open' : ''}`}>
      <button className="settings-section__header" onClick={onToggle}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="settings-section__header-icon">{icon}</span>
          {title}
        </span>
        <span className="settings-section__chevron">▾</span>
      </button>
      {isOpen && <div className="settings-section__body">{children}</div>}
    </div>
  )
}

export default function SettingsPage() {
  const user = useSelector((s) => s.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [openSection, setOpenSection] = useState('profile')
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })

  const [aiSettings, setAiSettings] = useState({
    autoStart: false,
    autoDetectActionItems: true,
    silentMode: true,
  })
  const [meetingSettings, setMeetingSettings] = useState({
    joinWithCameraOff: false,
    joinWithMicOff: false,
    waitingRoom: false,
  })
  const [notifications, setNotifications] = useState({
    emailBeforeMeeting: true,
    notifyActionItems: true,
  })

  const toggleSection = (key) => setOpenSection((prev) => (prev === key ? null : key))

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="settings-page">
      <div className="settings-profile">
        <div className="settings-profile__avatar">{profile.name?.[0]?.toUpperCase() || 'U'}</div>
        <div>
          <div className="settings-profile__name">{profile.name || 'Your name'}</div>
          <div className="settings-profile__email">{profile.email}</div>
        </div>
      </div>

      <SettingsSection icon="👤" title="Profile" isOpen={openSection === 'profile'} onToggle={() => toggleSection('profile')}>
        <Input label="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        <Button variant="primary">Save Changes</Button>
      </SettingsSection>

      <SettingsSection icon="🔐" title="Security" isOpen={openSection === 'security'} onToggle={() => toggleSection('security')}>
        <Input label="Current Password" type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} />
        <Input label="New Password" type="password" value={passwordForm.next} onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })} />
        <Input label="Confirm New Password" type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} />
        <Button variant="primary">Update Password</Button>
      </SettingsSection>

      <SettingsSection icon="🤖" title="AI Settings" isOpen={openSection === 'ai'} onToggle={() => toggleSection('ai')}>
        <Switch
          label="Start AI Notes automatically"
          description="Begin listening as soon as a meeting starts"
          checked={aiSettings.autoStart}
          onChange={(v) => setAiSettings({ ...aiSettings, autoStart: v })}
        />
        <hr className="settings-divider" />
        <Switch
          label="Auto-detect action items"
          description="Let the AI flag tasks and assignees automatically"
          checked={aiSettings.autoDetectActionItems}
          onChange={(v) => setAiSettings({ ...aiSettings, autoDetectActionItems: v })}
        />
        <hr className="settings-divider" />
        <Switch
          label="Silent mode"
          description="AI never interrupts the call, even for important topics"
          checked={aiSettings.silentMode}
          onChange={(v) => setAiSettings({ ...aiSettings, silentMode: v })}
        />
      </SettingsSection>

      <SettingsSection icon="🎥" title="Meeting Settings" isOpen={openSection === 'meeting'} onToggle={() => toggleSection('meeting')}>
        <Switch
          label="Join with camera off"
          checked={meetingSettings.joinWithCameraOff}
          onChange={(v) => setMeetingSettings({ ...meetingSettings, joinWithCameraOff: v })}
        />
        <hr className="settings-divider" />
        <Switch
          label="Join with microphone off"
          checked={meetingSettings.joinWithMicOff}
          onChange={(v) => setMeetingSettings({ ...meetingSettings, joinWithMicOff: v })}
        />
        <hr className="settings-divider" />
        <Switch
          label="Enable waiting room"
          description="Approve participants before they join, when you're the host"
          checked={meetingSettings.waitingRoom}
          onChange={(v) => setMeetingSettings({ ...meetingSettings, waitingRoom: v })}
        />
      </SettingsSection>

      <SettingsSection icon="🔔" title="Notifications" isOpen={openSection === 'notifications'} onToggle={() => toggleSection('notifications')}>
        <Switch
          label="Email me before meetings"
          checked={notifications.emailBeforeMeeting}
          onChange={(v) => setNotifications({ ...notifications, emailBeforeMeeting: v })}
        />
        <hr className="settings-divider" />
        <Switch
          label="Notify me about new action items"
          checked={notifications.notifyActionItems}
          onChange={(v) => setNotifications({ ...notifications, notifyActionItems: v })}
        />
      </SettingsSection>

      <div className="settings-section">
        <button className="settings-section__header settings-logout" onClick={handleLogout}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="settings-section__header-icon">🚪</span>
            Logout
          </span>
        </button>
      </div>
    </div>
  )
}
