import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  FiShield, FiMail, FiLock, FiUser, FiEye, FiEyeOff,
  FiAlertCircle, FiCheckCircle, FiActivity, FiUsers, FiBriefcase
} from 'react-icons/fi'
import { registerUser } from '../services/api'
import { getStoredAuth, ROLE_HOME, ROLES } from '../auth/rbac'

// ── Role options (NDMA_ADMIN is NOT self-registerable) ──
const REGISTER_ROLES = [
  {
    value: ROLES.PUBLIC_USER,
    label: 'Public User',
    description: 'Discover & register for disaster training programs',
    icon: FiUsers,
  },
  {
    value: ROLES.TRAINING_PROVIDER,
    label: 'NGO / Training Provider',
    description: 'Create and manage disaster training programs',
    icon: FiBriefcase,
  },
]

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: ROLES.PUBLIC_USER,
}

// ── Validation ────────────────────────────────────────
const validate = (form) => {
  const errors = {}
  if (!form.name.trim()) {
    errors.name = 'Full name is required'
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  if (!form.email.trim()) {
    errors.email = 'Email address is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(form.password)) {
    errors.password = 'Password must contain at least one letter and one number'
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  // Already logged in → redirect
  useEffect(() => {
    const { token, user } = getStoredAuth()
    if (token && user) {
      navigate(ROLE_HOME[user.role] || '/', { replace: true })
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    // Clear field error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (apiError) setApiError('')
  }

  const handleRoleSelect = (role) => {
    setForm(f => ({ ...f, role }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      // POST /register
      await registerUser({
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        role: form.role,
      })
      setSuccess(true)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.'
      setApiError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccessRedirect = () => {
    navigate('/login', { state: { registered: true, role: form.role } })
  }

  // ── Password strength indicator ──────────────────
  const passwordStrength = (() => {
    const p = form.password
    if (!p) return null
    if (p.length < 6) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' }
    if (p.length < 8) return { label: 'Fair', color: 'bg-amber-500', width: 'w-2/4' }
    if (/(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/.test(p))
      return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' }
    return { label: 'Good', color: 'bg-blue-500', width: 'w-3/4' }
  })()

  // ── Success Screen ────────────────────────────────
  if (success) {
    const isProvider = form.role === ROLES.TRAINING_PROVIDER
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center animate-slide-up">
          <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isProvider ? 'Registration Submitted Successfully' : 'Registration Successful'}
          </h2>
          <p className="text-gray-400 mb-2">
            Welcome, <span className="text-white font-medium">{form.name}</span>!
          </p>
          {isProvider ? (
            <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-8">
              Your Training Provider account is pending review. You will be notified once approved.
            </p>
          ) : (
            <p className="text-sm text-gray-400 mb-8">
              Your account has been created. Sign in to start exploring disaster training programs.
            </p>
          )}
          <button onClick={handleSuccessRedirect} className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
            <FiShield className="w-4 h-4" />
            Continue to Sign In
          </button>
        </div>
      </div>
    )
  }

  // ── Main Register Form ────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col lg:flex-row">

      {/* ── Left Panel – Hero ──────────────────────── */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-gray-900">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 30%, #3b82f6 0%, transparent 55%), radial-gradient(circle at 70% 70%, #1e40af 0%, transparent 55%)',
          }}
        />
        <div className="absolute top-16 left-16 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-16 right-16 w-72 h-72 bg-blue-700/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur border border-white/20 rounded-xl flex items-center justify-center">
              <FiShield className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">DisasterTrain360 AI</p>
              <p className="text-blue-300 text-xs">Powered by AWS & National AI Infrastructure</p>
            </div>
          </div>

          {/* Center */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-medium">
              <FiActivity className="w-3.5 h-3.5" />
              Join the National Disaster Preparedness Network
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
              Create Your<br />
              <span className="text-blue-400">Platform Account</span>
            </h2>
            <p className="text-gray-300 leading-relaxed max-w-sm">
              Register to access training programs, track your preparedness progress, or deliver disaster training as a certified provider.
            </p>

            {/* Role info cards */}
            <div className="space-y-3">
              {[
                { icon: '👤', title: 'Public User', desc: 'Browse & register for trainings, download certificates' },
                { icon: '🏢', title: 'Training Provider', desc: 'Submit and manage government-approved training programs' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span>Ministry of Home Affairs, GoI</span>
            <span>•</span>
            <span>NDMA Certified</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel – Form ─────────────────────── */}
      <div className="flex-1 flex items-start justify-center p-6 md:p-10 overflow-y-auto">
        <div className="w-full max-w-md py-6">

          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FiShield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">DisasterTrain360 AI</p>
              <p className="text-gray-400 text-xs">Create your account</p>
            </div>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-white mb-1">Create an account</h1>
            <p className="text-gray-400 text-sm">Join the National Disaster Training Intelligence Platform</p>
          </div>

          {/* API error */}
          {apiError && (
            <div className="flex items-center gap-2.5 p-3.5 mb-5 bg-red-900/20 border border-red-500/30 rounded-xl text-sm text-red-400">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* ── Register As ──────────────────────── */}
            <div>
              <label className="label mb-2">Register As</label>
              <div className="grid grid-cols-2 gap-3">
                {REGISTER_ROLES.map(({ value, label, description, icon: Icon }) => {
                  const selected = form.role === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRoleSelect(value)}
                      className={`
                        flex flex-col items-start gap-2 p-3.5 rounded-xl border text-left transition-all duration-200
                        ${selected
                          ? 'bg-blue-600/20 border-blue-500/50 ring-1 ring-blue-500/30'
                          : 'bg-gray-800/40 border-gray-700 hover:border-gray-500 hover:bg-gray-800/60'
                        }
                      `}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected ? 'bg-blue-500/30' : 'bg-gray-700'}`}>
                        <Icon className={`w-4 h-4 ${selected ? 'text-blue-400' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <p className={`text-xs font-semibold leading-tight ${selected ? 'text-blue-300' : 'text-gray-200'}`}>
                          {label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-tight">{description}</p>
                      </div>
                      {/* Radio indicator */}
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center self-end ml-auto mt-1 ${selected ? 'border-blue-400' : 'border-gray-600'}`}>
                        {selected && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Full Name ──────────────────────────── */}
            <div>
              <label className="label" htmlFor="name">
                <FiUser className="inline w-3.5 h-3.5 mr-1.5" />
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={`input-field pl-10 ${errors.name ? 'border-red-500/50 focus:ring-red-500' : ''}`}
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
                  <FiAlertCircle className="w-3 h-3 flex-shrink-0" />{errors.name}
                </p>
              )}
            </div>

            {/* ── Email ──────────────────────────────── */}
            <div>
              <label className="label" htmlFor="reg-email">
                <FiMail className="inline w-3.5 h-3.5 mr-1.5" />
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500/50 focus:ring-red-500' : ''}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
                  <FiAlertCircle className="w-3 h-3 flex-shrink-0" />{errors.email}
                </p>
              )}
            </div>

            {/* ── Password ───────────────────────────── */}
            <div>
              <label className="label" htmlFor="reg-password">
                <FiLock className="inline w-3.5 h-3.5 mr-1.5" />
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500/50 focus:ring-red-500' : ''}`}
                  autoComplete="new-password"
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
              {/* Strength bar */}
              {passwordStrength && (
                <div className="mt-2 space-y-1">
                  <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`} />
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength.label === 'Weak' ? 'text-red-400' :
                    passwordStrength.label === 'Fair' ? 'text-amber-400' :
                    passwordStrength.label === 'Good' ? 'text-blue-400' : 'text-emerald-400'
                  }`}>
                    {passwordStrength.label} password
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
                  <FiAlertCircle className="w-3 h-3 flex-shrink-0" />{errors.password}
                </p>
              )}
            </div>

            {/* ── Confirm Password ───────────────────── */}
            <div>
              <label className="label" htmlFor="confirmPassword">
                <FiLock className="inline w-3.5 h-3.5 mr-1.5" />
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500/50 focus:ring-red-500' : ''}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showConfirm ? 'Hide' : 'Show'}
                >
                  {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {/* Match indicator */}
              {form.confirmPassword && !errors.confirmPassword && form.password === form.confirmPassword && (
                <p className="flex items-center gap-1 text-xs text-emerald-400 mt-1.5">
                  <FiCheckCircle className="w-3 h-3" /> Passwords match
                </p>
              )}
              {errors.confirmPassword && (
                <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
                  <FiAlertCircle className="w-3 h-3 flex-shrink-0" />{errors.confirmPassword}
                </p>
              )}
            </div>

            {/* ── Submit ─────────────────────────────── */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* ── Already have account ─────────────────── */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Footer trust badges */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <span>🔒 256-bit AES Encryption</span>
              <span>🛡️ CERT-In Compliant</span>
              <span>✅ ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
