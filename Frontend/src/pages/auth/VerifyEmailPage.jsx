import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/common/AuthLayout.jsx'
import Button from '../../components/ui/Button.jsx'
import { resendVerificationEmail } from '../../services/auth.js'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleResend = async () => {
    setSending(true)
    await resendVerificationEmail()
    setSending(false)
    setSent(true)
  }

  return (
    <AuthLayout title="Check your email" subtitle="We’ve sent a verification link to your inbox.">
      <div className="auth-layout__form">
        <div style={{ textAlign: 'center', fontSize: '2.4rem' }}>📩</div>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Click the link in the email to activate your account. {sent && 'A new link is on its way.'}
        </p>

        <Button variant="secondary" block onClick={handleResend} loading={sending}>
          Resend Email
        </Button>
        <Button variant="ghost" block onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </div>
    </AuthLayout>
  )
}
