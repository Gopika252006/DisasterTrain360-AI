// ─────────────────────────────────────────────────────
//  DisasterTrain360 AI – RBAC Configuration
//  Single source of truth for roles, routes, and access.
// ─────────────────────────────────────────────────────

export const ROLES = {
  NDMA_ADMIN: 'NDMA_ADMIN',
  TRAINING_PROVIDER: 'TRAINING_PROVIDER',
  PUBLIC_USER: 'PUBLIC_USER',
}

// Default redirect per role after login
export const ROLE_HOME = {
  [ROLES.NDMA_ADMIN]: '/dashboard',
  [ROLES.TRAINING_PROVIDER]: '/training/create',
  [ROLES.PUBLIC_USER]: '/training-discovery',
}

// Which roles are allowed on each protected path.
// '*' means all authenticated roles.
export const ROUTE_PERMISSIONS = {
  '/dashboard': [ROLES.NDMA_ADMIN],
  '/gis-map': [ROLES.NDMA_ADMIN],
  '/insights': [ROLES.NDMA_ADMIN],
  '/reports': [ROLES.NDMA_ADMIN],
  '/training/create': [ROLES.NDMA_ADMIN, ROLES.TRAINING_PROVIDER],
  '/training/manage': [ROLES.NDMA_ADMIN, ROLES.TRAINING_PROVIDER],
  '/training/evidence': [ROLES.TRAINING_PROVIDER],
  '/training-discovery': '*',
  '/my-registrations': [ROLES.PUBLIC_USER],
  '/certificates': [ROLES.PUBLIC_USER],
}

// ── Mock Credentials (dev mode) ──────────────────────
export const MOCK_CREDENTIALS = {
  'admin@test.com': {
    role: ROLES.NDMA_ADMIN,
    name: 'Rajiv Sharma',
    department: 'National Disaster Management Authority',
  },
  'provider@test.com': {
    role: ROLES.TRAINING_PROVIDER,
    name: 'Priya Mehta',
    department: 'State ATI – Maharashtra',
  },
  'user@test.com': {
    role: ROLES.PUBLIC_USER,
    name: 'Arjun Singh',
    department: 'Public',
  },
}

// ── Auth helpers ─────────────────────────────────────
export const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('dt360_token')
    const user = JSON.parse(localStorage.getItem('dt360_user') || 'null')
    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

export const setStoredAuth = ({ token, role, name, email, department }) => {
  localStorage.setItem('dt360_token', token)
  localStorage.setItem('dt360_user', JSON.stringify({ token, role, name, email, department }))
}

export const clearStoredAuth = () => {
  localStorage.removeItem('dt360_token')
  localStorage.removeItem('dt360_user')
}

export const isRouteAllowed = (pathname, role) => {
  // Find the best matching route key
  const key = Object.keys(ROUTE_PERMISSIONS).find(
    (r) => pathname === r || pathname.startsWith(r + '/')
  )
  if (!key) return true // no restriction defined → allow
  const allowed = ROUTE_PERMISSIONS[key]
  if (allowed === '*') return true
  return Array.isArray(allowed) && allowed.includes(role)
}
