import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AuthLayout from '../../components/common/AuthLayout.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { loginUser, loginWithGoogle, clearAuthError } from '../../store/slices/authSlice.js'
import { isValidEmail } from '../../utils/validators.js'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})

  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address.'
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.'
    setFieldErrors(errs)
    if (Object.keys(errs).length) return

    dispatch(clearAuthError())
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) navigate(redirectTo, { replace: true })
  }

  const handleGoogleLogin = async () => {
    dispatch(clearAuthError())
    const result = await dispatch(loginWithGoogle())
    if (loginWithGoogle.fulfilled.match(result)) navigate(redirectTo, { replace: true })
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to Nexus"
      footer={
        <>
          Don’t have an account?{' '}
          <Link to="/register" onClick={() => dispatch(clearAuthError())}>
            Create one
          </Link>
        </>
      }
    >
      <form className="auth-layout__form" onSubmit={handleLogin} noValidate>
        {error && <div className="form-error-banner">{error}</div>}

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="current-password"
        />

        <Link to="/forgot-password" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', alignSelf: 'flex-end' }}>
          Forgot password?
        </Link>

        <Button type="submit" variant="primary" block loading={status === 'loading'}>
          Login
        </Button>

        <div className="auth-layout__divider">or</div>

        <Button type="button" variant="outline" block onClick={handleGoogleLogin} disabled={status === 'loading'}>
          Continue with Google
        </Button>
      </form>
    </AuthLayout>
  )
}
