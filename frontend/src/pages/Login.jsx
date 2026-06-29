import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  FiShield, FiMail, FiLock, FiEye, FiEyeOff,
  FiAlertCircle, FiActivity, FiUserPlus, FiCheckCircle
} from 'react-icons/fi'
import { loginUser } from '../services/api'
import {
  ROLE_HOME,
  getStoredAuth, setStoredAuth
} from '../auth/rbac'

const stats = [
  { label: 'Districts Covered', value: '420+' },
  { label: 'Trainings Completed', value: '1,164' },
  { label: 'Participants Trained', value: '284K+' },
  { label: 'AI Recommendations', value: '2,800+' },
]

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Show success banner if redirected from /register
  const justRegistered = !!location.state?.registered
  const registeredRole = location.state?.role

  // Already logged in → redirect to role home
  // Only auto-redirect if user didn't explicitly come to /login to log out
  useEffect(() => {
    const { token, user } = getStoredAuth()
    // If there's a valid session AND the user wasn't sent here by clearStoredAuth (logout),
    // skip the login page and go straight to their home.
    if (token && user && !location.state?.loggedOut) {
      const home = ROLE_HOME[user.role] || '/dashboard'
      navigate(home, { replace: true })
    }
  }, [])

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = form
    if (!email || !password) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    try {
      const res = await loginUser({ email: email.toLowerCase().trim(), password })
      const { token, role, name } = res.data
      setStoredAuth({ token, role, name, email: email.toLowerCase().trim(), department: '' })
      const redirectTo = location.state?.from?.pathname
      const home = ROLE_HOME[role] || '/dashboard'
      navigate(redirectTo || home, { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || 'Invalid email or password.'
      setError(typeof msg === 'string' ? msg : 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col lg:flex-row">
      {/* ── Left Panel – Hero ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-gray-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #1e40af 0%, transparent 50%)',
            }}
          />
        </div>

        {/* Animated circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-700/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Top Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur border border-white/20 rounded-xl flex items-center justify-center">
              <FiShield className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">DisasterTrain360 AI</p>
              <p className="text-blue-300 text-xs">Powered by AWS & National AI Infrastructure</p>
            </div>
          </div>

          {/* Center Content */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-medium mb-4">
                <FiActivity className="w-3.5 h-3.5" />
                Real-Time National Intelligence Platform
              </div>
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                National Disaster<br />
                <span className="text-blue-400">Training Intelligence</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Empowering India's disaster preparedness through AI-driven training analytics, real-time insights, and national coverage monitoring.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom footer */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">Ministry of Home Affairs, GoI</span>
            </div>
            <span className="text-gray-700">•</span>
            <span className="text-sm text-gray-500">NDMA Certified Platform</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel – Login Form ──────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FiShield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">DisasterTrain360 AI</p>
              <p className="text-gray-400 text-xs">National Disaster Training Platform</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Sign in to platform</h1>
            <p className="text-gray-400 text-sm">Access the National Disaster Training Intelligence System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Registration success banner */}
            {justRegistered && (
              <div className="flex items-start gap-2.5 p-3.5 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-sm text-emerald-400">
                <FiCheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  {registeredRole === 'TRAINING_PROVIDER'
                    ? 'Registration submitted! Your Training Provider account is under review.'
                    : 'Registration successful! Sign in to get started.'}
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 bg-red-900/20 border border-red-500/30 rounded-xl text-sm text-red-400">
                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="label" htmlFor="email">
                <FiMail className="inline w-3.5 h-3.5 mr-1.5" />
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your.email@ndma.gov.in"
                  className="input-field pl-10"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="password">
                <FiLock className="inline w-3.5 h-3.5 mr-1.5" />
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <FiShield className="w-4 h-4" />
                  Sign In Securely
                </>
              )}
            </button>
          </form>

          {/* Create Account CTA */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 mb-3">Don't have an account?</p>
            <Link
              to="/register"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-400/40 rounded-xl transition-all duration-200 bg-blue-500/5 hover:bg-blue-500/10"
            >
              <FiUserPlus className="w-4 h-4" />
              Create Account
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <span>🔒 256-bit AES Encryption</span>
              <span>🛡️ CERT-In Compliant</span>
              <span>✅ ISO 27001 Certified</span>
            </div>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-xl text-xs text-blue-300 space-y-1.5">
            <p className="font-semibold text-blue-400 flex items-center gap-1.5">
              <FiShield className="w-3.5 h-3.5" /> Admin Access
            </p>
            <p className="text-gray-400">Email: <span className="font-mono text-white">admin@test.com</span></p>
            <p className="text-gray-400">Password: <span className="font-mono text-white">password</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
