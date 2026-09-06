import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail } from 'react-icons/fi'
import AuthLayout from '../../components/common/AuthLayout.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { forgotPassword } from '../../services/auth.js'
import { isValidEmail } from '../../utils/validators.js'
import { notifySuccess } from '../../utils/toast.jsx'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) return setError('Enter a valid email address.')
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
      notifySuccess('Reset link sent.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout title="Check your inbox" subtitle={`We’ve sent a reset link to ${email}`}>
        <div style={{ display: 'flex', justifyContent: 'center', fontSize: '2.4rem', color: 'var(--color-primary)' }}>
          <FiMail />
        </div>
        <div className="auth-layout__footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we’ll send you a reset link"
      footer={<Link to="/login">Back to Login</Link>}
    >
      <form className="auth-layout__form" onSubmit={handleSubmit} noValidate>
        <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={error} autoComplete="email" />
        <Button type="submit" variant="primary" block loading={loading}>
          Send Reset Link
        </Button>
      </form>
    </AuthLayout>
  )
}
