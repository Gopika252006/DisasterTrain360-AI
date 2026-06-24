import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiBell, FiLogOut, FiUser, FiMenu, FiX,
  FiChevronDown, FiSettings, FiShield
} from 'react-icons/fi'
import { mockNotifications } from '../data/mockData'
import { getStoredAuth, clearStoredAuth, ROLES, ROLE_HOME } from '../auth/rbac'

// Human-readable label for each role key
const ROLE_LABELS = {
  [ROLES.NDMA_ADMIN]:        'NDMA Admin',
  [ROLES.TRAINING_PROVIDER]: 'Training Provider',
  [ROLES.PUBLIC_USER]:       'Public User',
}

const Navbar = ({ onMenuToggle, sidebarOpen }) => {
  const navigate = useNavigate()
  const [showNotif, setShowNotif] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPrefsModal, setShowPrefsModal] = useState(false)
  const notifRef = useRef(null)
  const userRef = useRef(null)

  const { user } = getStoredAuth()
  const roleLabel = ROLE_LABELS[user?.role] || user?.role || 'User'
  const unread = mockNotifications.filter(n => !n.read).length

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false)
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    clearStoredAuth()
    navigate('/login', { state: { loggedOut: true } })
  }

  return (
    <>
    <nav className="h-16 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 flex items-center px-4 md:px-6 gap-4 sticky top-0 z-40">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      {/* Brand (mobile) */}
      <div className="lg:hidden flex items-center gap-2 flex-1">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <FiShield className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white">DT360 AI</span>
      </div>

      {/* Center – platform title (desktop) */}
      <div className="hidden lg:flex flex-1 items-center gap-3">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span>System Status: <span className="text-emerald-400 font-medium">Operational</span></span>
        </div>
        <span className="text-gray-700">|</span>
        <span className="text-gray-500 text-sm">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotif(s => !s); setShowUser(false) }}
            className="relative p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold leading-none">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {unread > 0 && <span className="badge-red">{unread} new</span>}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-800">
                {mockNotifications.slice(0, 5).map(n => (
                  <div key={n.id} className={`p-3.5 hover:bg-gray-800/50 transition-colors ${!n.read ? 'bg-blue-900/10' : ''}`}>
                    <div className="flex items-start gap-2.5">
                      {!n.read && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />}
                      <div>
                        <p className={`text-xs font-medium ${!n.read ? 'text-white' : 'text-gray-300'}`}>{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-800">
                <button
                  onClick={() => { navigate(ROLE_HOME[user?.role] || '/dashboard'); setShowNotif(false) }}
                  className="w-full text-xs text-blue-400 hover:text-blue-300 transition-colors text-center"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div ref={userRef} className="relative flex items-center gap-2">
          {/* User pill – click to open profile/preferences dropdown */}
          <button
            onClick={() => { setShowUser(s => !s); setShowNotif(false) }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 leading-tight">{roleLabel}</p>
            </div>
            <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform hidden md:block ${showUser ? 'rotate-180' : ''}`} />
          </button>

          {/* Direct Sign Out button – always visible in top bar */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 transition-all text-xs font-medium"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          {/* Profile / Preferences dropdown */}
          {showUser && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 border-b border-gray-800">
                <p className="text-xs font-semibold text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400">{user?.email || ''}</p>
                <p className="text-xs text-blue-400 mt-0.5">{roleLabel}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => { setShowUser(false); setShowProfileModal(true) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FiUser className="w-4 h-4" /> Profile Settings
                </button>
                <button
                  onClick={() => { setShowUser(false); setShowPrefsModal(true) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FiSettings className="w-4 h-4" /> Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>

    {/* ── Profile Settings Modal ─────────────────── */}
    {showProfileModal && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FiUser className="w-4 h-4 text-blue-400" /> Profile Settings
            </h3>
            <button onClick={() => setShowProfileModal(false)} className="text-gray-500 hover:text-white transition-colors text-xl leading-none">×</button>
          </div>
          <div className="p-5 space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-bold">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-blue-400">{roleLabel}</p>
              </div>
            </div>
            {/* Fields */}
            <div className="space-y-3">
              <div>
                <label className="label">Full Name</label>
                <input defaultValue={user?.name || ''} className="input-field text-sm" placeholder="Your name" />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input defaultValue={user?.email || ''} className="input-field text-sm" placeholder="your@email.com" readOnly />
              </div>
              <div>
                <label className="label">Department</label>
                <input defaultValue={user?.department || ''} className="input-field text-sm" placeholder="Department" />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowProfileModal(false)}
                className="btn-primary flex-1 py-2 text-sm"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="btn-secondary px-5 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* ── Preferences Modal ──────────────────────── */}
    {showPrefsModal && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FiSettings className="w-4 h-4 text-blue-400" /> Preferences
            </h3>
            <button onClick={() => setShowPrefsModal(false)} className="text-gray-500 hover:text-white transition-colors text-xl leading-none">×</button>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: 'Email Notifications', desc: 'Receive alerts and updates via email', defaultOn: true },
              { label: 'SMS Alerts', desc: 'Critical disaster alerts via SMS', defaultOn: false },
              { label: 'Dashboard Auto-Refresh', desc: 'Refresh data every 5 minutes', defaultOn: true },
              { label: 'Compact Sidebar', desc: 'Show icons only in sidebar', defaultOn: false },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-200 font-medium">{pref.label}</p>
                  <p className="text-xs text-gray-500">{pref.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" defaultChecked={pref.defaultOn} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-700 peer-checked:bg-blue-600 rounded-full transition-colors
                    after:content-[''] after:absolute after:top-0.5 after:left-0.5
                    after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all
                    peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowPrefsModal(false)}
                className="btn-primary flex-1 py-2 text-sm"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowPrefsModal(false)}
                className="btn-secondary px-5 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  )
}

export default Navbar
