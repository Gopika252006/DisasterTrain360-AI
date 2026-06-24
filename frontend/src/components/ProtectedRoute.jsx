import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getStoredAuth, isRouteAllowed, ROLE_HOME } from '../auth/rbac'

/**
 * ProtectedRoute
 *
 * Wraps any route that requires authentication.
 * - No token/user  → redirect to /login
 * - Token present but role not permitted on this path
 *   → redirect to role's own home page (no login loop)
 * - All good → render children
 *
 * Optionally accepts `allowedRoles` prop for inline per-route overrides.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation()
  const { token, user } = getStoredAuth()

  // 1. Not authenticated at all
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const role = user.role

  // 2. Inline allowedRoles override (from AppRoutes)
  if (allowedRoles && !allowedRoles.includes(role)) {
    const home = ROLE_HOME[role] || '/login'
    return <Navigate to={home} replace />
  }

  // 3. RBAC permission map check
  if (!isRouteAllowed(location.pathname, role)) {
    const home = ROLE_HOME[role] || '/login'
    return <Navigate to={home} replace />
  }

  return children
}

export default ProtectedRoute
