import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import { ROLES, getStoredAuth, ROLE_HOME } from '../auth/rbac'

import Login                   from '../pages/Login'
import Register                from '../pages/Register'
import Dashboard               from '../pages/Dashboard'
import TrainingForm            from '../pages/TrainingForm'
import GISMap                  from '../pages/GISMap'
import Insights                from '../pages/Insights'
import Reports                 from '../pages/Reports'
import PublicTrainingDiscovery from '../pages/PublicTrainingDiscovery'
import ManageTrainings         from '../pages/ManageTrainings'
import UploadEvidence          from '../pages/UploadEvidence'
import MyRegistrations         from '../pages/MyRegistrations'
import Certificates            from '../pages/Certificates'

// Sends an already-authenticated user to their role home
const RoleRedirect = () => {
  const { token, user } = getStoredAuth()
  if (!token || !user) return <Navigate to="/login" replace />
  return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public (no auth needed) ─────────────── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Guest access to training discovery (no sidebar) */}
        <Route path="/training-discovery" element={<PublicTrainingDiscovery />} />

        {/* ── Authenticated shell (has sidebar+navbar) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Root → role-specific home */}
          <Route index element={<RoleRedirect />} />

          {/* ── NDMA_ADMIN only ─────────────────── */}
          <Route path="dashboard"
            element={<ProtectedRoute allowedRoles={[ROLES.NDMA_ADMIN]}><Dashboard /></ProtectedRoute>}
          />
          <Route path="gis-map"
            element={<ProtectedRoute allowedRoles={[ROLES.NDMA_ADMIN]}><GISMap /></ProtectedRoute>}
          />
          <Route path="insights"
            element={<ProtectedRoute allowedRoles={[ROLES.NDMA_ADMIN]}><Insights /></ProtectedRoute>}
          />
          <Route path="reports"
            element={<ProtectedRoute allowedRoles={[ROLES.NDMA_ADMIN]}><Reports /></ProtectedRoute>}
          />

          {/* ── NDMA_ADMIN + TRAINING_PROVIDER ─── */}
          <Route path="training/create"
            element={<ProtectedRoute allowedRoles={[ROLES.NDMA_ADMIN, ROLES.TRAINING_PROVIDER]}><TrainingForm /></ProtectedRoute>}
          />
          <Route path="training/manage"
            element={<ProtectedRoute allowedRoles={[ROLES.NDMA_ADMIN, ROLES.TRAINING_PROVIDER]}><ManageTrainings /></ProtectedRoute>}
          />

          {/* ── TRAINING_PROVIDER only ──────────── */}
          <Route path="training/evidence"
            element={<ProtectedRoute allowedRoles={[ROLES.TRAINING_PROVIDER]}><UploadEvidence /></ProtectedRoute>}
          />

          {/* ── PUBLIC_USER — inside sidebar layout  */}
          <Route path="discover"
            element={<ProtectedRoute allowedRoles={[ROLES.PUBLIC_USER]}><PublicTrainingDiscovery /></ProtectedRoute>}
          />
          <Route path="my-registrations"
            element={<ProtectedRoute allowedRoles={[ROLES.PUBLIC_USER]}><MyRegistrations /></ProtectedRoute>}
          />
          <Route path="certificates"
            element={<ProtectedRoute allowedRoles={[ROLES.PUBLIC_USER]}><Certificates /></ProtectedRoute>}
          />
        </Route>

        {/* ── Catch-all ────────────────────────────── */}
        <Route path="*" element={<RoleRedirect />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
