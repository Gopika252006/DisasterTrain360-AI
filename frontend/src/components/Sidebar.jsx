import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiGrid, FiPlusSquare, FiMap, FiCpu, FiFileText,
  FiSearch, FiLogOut, FiShield, FiActivity, FiChevronRight,
  FiList, FiUploadCloud, FiAward, FiBookmark
} from 'react-icons/fi'
import { getStoredAuth, clearStoredAuth, ROLES } from '../auth/rbac'

// ─── Nav items per role ───────────────────────────────
const NAV_BY_ROLE = {
  [ROLES.NDMA_ADMIN]: [
    { path: '/dashboard',        label: 'Dashboard',       icon: FiGrid,        description: 'National overview' },
    { path: '/training/manage',  label: 'All Trainings',   icon: FiList,        description: 'View & manage all' },
    { path: '/training/create',  label: 'Create Training', icon: FiPlusSquare,  description: 'Schedule new program' },
    { path: '/gis-map',          label: 'GIS Monitoring',  icon: FiMap,         description: 'District heat map' },
    { path: '/insights',         label: 'AI Insights',     icon: FiCpu,         description: 'Recommendations' },
    { path: '/reports',          label: 'Reports',         icon: FiFileText,    description: 'Download reports' },
  ],
  [ROLES.TRAINING_PROVIDER]: [
    { path: '/training/create',   label: 'Create Training',   icon: FiPlusSquare,   description: 'Schedule new program' },
    { path: '/training/manage',   label: 'Manage Trainings',  icon: FiList,         description: 'View & edit programs' },
    { path: '/training/evidence', label: 'Upload Evidence',   icon: FiUploadCloud,  description: 'Photos & documents' },
  ],
  [ROLES.PUBLIC_USER]: [
    { path: '/discover',           label: 'Training Discovery', icon: FiSearch,    description: 'Find programs' },
    { path: '/my-registrations',   label: 'My Registrations',   icon: FiBookmark,  description: 'Your enrolled programs' },
    { path: '/certificates',       label: 'Certificates',        icon: FiAward,     description: 'Download certificates' },
  ],
}

// Role badge styling
const ROLE_BADGE = {
  [ROLES.NDMA_ADMIN]:       { label: 'NDMA Admin',         cls: 'text-blue-400' },
  [ROLES.TRAINING_PROVIDER]:{ label: 'Training Provider',   cls: 'text-amber-400' },
  [ROLES.PUBLIC_USER]:      { label: 'Public User',         cls: 'text-emerald-400' },
}

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate()
  const { user } = getStoredAuth()
  const role = user?.role || ROLES.PUBLIC_USER
  const navItems = NAV_BY_ROLE[role] || []
  const badge = ROLE_BADGE[role] || { label: role, cls: 'text-gray-400' }

  const handleLogout = () => {
    clearStoredAuth()
    navigate('/login', { state: { loggedOut: true } })
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800
          flex flex-col z-40 transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FiShield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">DisasterTrain360</h1>
              <p className="text-xs text-blue-400 font-medium">AI Intelligence Platform</p>
            </div>
          </div>

          {/* Status badge */}
          <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-emerald-900/20 border border-emerald-500/20 rounded-lg">
            <FiActivity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Platform Live</span>
            <span className="ml-auto text-xs text-gray-500">v2.4</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-3">
            Navigation
          </p>

          {navItems.map(({ path, label, icon: Icon, description }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) => `
                group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive ? 'bg-blue-500/20' : 'bg-gray-800 group-hover:bg-gray-700'
                  }`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-tight ${isActive ? 'text-blue-300' : 'group-hover:text-white'}`}>
                      {label}
                    </p>
                    <p className="text-xs text-gray-600 group-hover:text-gray-500 leading-tight mt-0.5 truncate">
                      {description}
                    </p>
                  </div>
                  {isActive && (
                    <FiChevronRight className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-800/50">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className={`text-xs truncate font-medium ${badge.cls}`}>{badge.label}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-all duration-200"
          >
            <FiLogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
