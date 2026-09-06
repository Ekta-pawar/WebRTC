import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiVideo, FiLink } from 'react-icons/fi'
import AuthLayout from '../../components/common/AuthLayout.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { validateJoinCode } from '../../services/meeting.js'

export default function JoinMeetingPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [link, setLink] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleJoin = async (value) => {
    setError('')
    setLoading(true)
    try {
      const { meetingId } = await validateJoinCode(value)
      navigate(`/meeting/${meetingId}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Join Meeting" subtitle="Enter a meeting code or paste a link to join">
      <div className="auth-layout__form">
        {error && <div className="form-error-banner">{error}</div>}

        <Input
          label="Meeting Code"
          placeholder="ABC-123-XYZ"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button variant="primary" block icon={<FiVideo />} loading={loading} onClick={() => handleJoin(code)} disabled={!code.trim()}>
          Join Meeting
        </Button>

        <div className="auth-layout__divider">or</div>

        <Input
          label="Paste Meeting Link"
          placeholder="https://webrtc.app/meeting/..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <Button variant="outline" block icon={<FiLink />} loading={loading} onClick={() => handleJoin(link)} disabled={!link.trim()}>
          Join with Link
        </Button>
      </div>
    </AuthLayout>
  )
}
