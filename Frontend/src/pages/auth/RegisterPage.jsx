import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AuthLayout from '../../components/common/AuthLayout.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { registerUser, clearAuthError } from '../../store/slices/authSlice.js'
import { isValidEmail, isStrongEnoughPassword, passwordsMatch } from '../../utils/validators.js'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (form.name.trim().length < 2) errs.name = 'Enter your full name.'
    if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address.'
    if (!isStrongEnoughPassword(form.password)) errs.password = 'Password must be at least 6 characters.'
    if (!passwordsMatch(form.password, form.confirmPassword)) errs.confirmPassword = 'Passwords do not match.'
    setFieldErrors(errs)
    if (Object.keys(errs).length) return

    dispatch(clearAuthError())
    const result = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(result)) navigate('/verify-email')
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start hosting smarter meetings in minutes"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" onClick={() => dispatch(clearAuthError())}>
            Login
          </Link>
        </>
      }
    >
      <form className="auth-layout__form" onSubmit={handleSubmit} noValidate>
        {error && <div className="form-error-banner">{error}</div>}

        <Input label="Name" name="name" placeholder="Jane Doe" value={form.name} onChange={handleChange} error={fieldErrors.name} autoComplete="name" />
        <Input label="Email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} error={fieldErrors.email} autoComplete="email" />
        <Input label="Password" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} error={fieldErrors.password} autoComplete="new-password" />
        <Input label="Confirm Password" type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} error={fieldErrors.confirmPassword} autoComplete="new-password" />

        <Button type="submit" variant="primary" block loading={status === 'loading'}>
          Create Account
        </Button>
      </form>
    </AuthLayout>
  )
}
