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
  [ROLES.TRAINING_PROVIDER]: '/training/manage',
  [ROLES.PUBLIC_USER]: '/discover',
}

// Which roles are allowed on each protected path.
export const ROUTE_PERMISSIONS = {
  '/dashboard':          [ROLES.NDMA_ADMIN],
  '/gis-map':            [ROLES.NDMA_ADMIN],
  '/insights':           [ROLES.NDMA_ADMIN],
  '/reports':            [ROLES.NDMA_ADMIN],
  '/evidence-review':    [ROLES.NDMA_ADMIN],
  '/training/create':    [ROLES.NDMA_ADMIN, ROLES.TRAINING_PROVIDER],
  '/training/manage':    [ROLES.NDMA_ADMIN, ROLES.TRAINING_PROVIDER],
  '/training/evidence':  [ROLES.TRAINING_PROVIDER],
  '/training-discovery': '*',       // unauthenticated guest access
  '/discover':           [ROLES.PUBLIC_USER],
  '/my-registrations':   [ROLES.PUBLIC_USER],
  '/certificates':       [ROLES.PUBLIC_USER],
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
