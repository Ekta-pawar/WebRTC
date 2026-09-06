import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../../components/common/AuthLayout.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { resetPassword } from '../../services/auth.js'
import { isStrongEnoughPassword, passwordsMatch } from '../../utils/validators.js'
import { notifySuccess } from '../../utils/toast.jsx'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!isStrongEnoughPassword(form.password)) errs.password = 'Password must be at least 6 characters.'
    if (!passwordsMatch(form.password, form.confirmPassword)) errs.confirmPassword = 'Passwords do not match.'
    setFieldErrors(errs)
    if (Object.keys(errs).length) return

    setLoading(true)
    setFormError('')
    try {
      await resetPassword({ token: searchParams.get('token'), password: form.password })
      notifySuccess('Password reset. Please log in.')
      navigate('/login')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Choose a new password for your account">
      <form className="auth-layout__form" onSubmit={handleSubmit} noValidate>
        {formError && <div className="form-error-banner">{formError}</div>}
        <Input label="New Password" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} error={fieldErrors.password} autoComplete="new-password" />
        <Input label="Confirm Password" type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} error={fieldErrors.confirmPassword} autoComplete="new-password" />
        <Button type="submit" variant="primary" block loading={loading}>
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  )
}
