import axios from 'axios'
import {
  mockTrainings, mockInsights, mockReports,
  mockNotifications, mockDashboardKPIs,
} from '../data/mockData'

// ─── Base Config ──────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request Interceptor ──────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dt360_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ─────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dt360_token')
      localStorage.removeItem('dt360_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Helper ───────────────────────────────────
export const isBackendUnavailable = (err) =>
  !err?.response && (err?.code === 'ERR_NETWORK' || err?.code === 'ECONNABORTED' || !navigator.onLine)

// ─────────────────────────────────────────────
//  MOCK MODE — set true for Vercel demo deploy
//  No backend needed. All data is local.
// ─────────────────────────────────────────────
export const MOCK_MODE = true

// Demo accounts (any password works)
const DEMO_USERS = {
  'admin@test.com':    { role: 'NDMA_ADMIN',        name: 'Rajiv Sharma',  token: 'demo-admin-token' },
  'provider@test.com': { role: 'TRAINING_PROVIDER', name: 'Priya Mehta',   token: 'demo-provider-token' },
  'user@test.com':     { role: 'PUBLIC_USER',        name: 'Arjun Singh',   token: 'demo-user-token' },
}

// ── Registered users store (persists across page refresh) ──
const STORAGE_KEY = 'dt360_registered_users'

const getRegisteredUsers = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

const saveRegisteredUser = (email, data) => {
  const users = getRegisteredUsers()
  users[email.toLowerCase()] = data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

// In-memory mock store (persists during session)
let _trainings = mockTrainings.map(t => ({ ...t, trainingId: t.id, trainingName: t.name }))
let _enrollments = []

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms))

// ─── Auth APIs ────────────────────────────────
export const loginUser = async (credentials) => {
  await delay(600)
  if (!MOCK_MODE) return api.post('/login', credentials)

  const email = (credentials.email || '').toLowerCase().trim()

  // 1. Check built-in demo accounts first
  const demoUser = DEMO_USERS[email]
  if (demoUser && credentials.password === 'password') {
    return { data: { token: demoUser.token, role: demoUser.role, name: demoUser.name, email } }
  }

  // 2. Check user-registered accounts (stored in localStorage)
  const registered = getRegisteredUsers()
  const regUser = registered[email]
  if (regUser && regUser.password === credentials.password) {
    return {
      data: {
        token: `user-token-${email}`,
        role:  regUser.role,
        name:  regUser.name,
        email,
      }
    }
  }

  // 3. Reject
  const err = new Error('Invalid email or password.')
  err.response = {
    data: { message: 'Invalid email or password. Check your credentials or use demo accounts.' }
  }
  throw err
}

export const registerUser = async (userData) => {
  await delay(500)
  if (!MOCK_MODE) return api.post('/register', userData)

  const email = (userData.email || '').toLowerCase().trim()

  // Check duplicate
  const registered = getRegisteredUsers()
  const allUsers   = { ...DEMO_USERS, ...registered }
  if (allUsers[email]) {
    const err = new Error('Email already registered')
    err.response = { data: { message: 'This email is already registered. Please sign in.' } }
    throw err
  }

  // Save new user
  saveRegisteredUser(email, {
    name:     userData.name,
    email,
    password: userData.password,
    role:     userData.role || 'PUBLIC_USER',
  })

  return { data: { message: 'Registration successful! You can now sign in.' } }
}

// ─── Training APIs ────────────────────────────
export const createTraining = async (trainingData) => {
  await delay(700)
  if (!MOCK_MODE) return api.post('/training', trainingData)
  const newTraining = {
    ...trainingData,
    trainingId:   `tr-${Date.now()}`,
    id:           `tr-${Date.now()}`,
    trainingName: trainingData.trainingName || trainingData.name,
    name:         trainingData.trainingName || trainingData.name,
    createdBy:    'provider@test.com',
    createdAt:    new Date().toISOString(),
  }
  _trainings = [newTraining, ..._trainings]
  return { data: newTraining }
}

export const getTrainings = async (params) => {
  await delay(400)
  if (!MOCK_MODE) return api.get('/training', { params })
  return { data: _trainings }
}

export const getTrainingById = async (id) => {
  await delay(200)
  if (!MOCK_MODE) return api.get(`/training/${id}`)
  return { data: _trainings.find(t => t.id === id || t.trainingId === id) || null }
}

export const getMyTrainings = async () => {
  await delay(300)
  if (!MOCK_MODE) return api.get('/training/my')
  // Return trainings created by the provider
  const mine = _trainings.filter(t => t.createdBy === 'provider@test.com' || t.createdBy === 'Training Provider' || t.createdBy === 'NGO Partner')
  return { data: mine }
}

// ─── Dashboard API ────────────────────────────
export const getDashboard = async () => {
  await delay(300)
  if (!MOCK_MODE) return api.get('/dashboard')
  return { data: mockDashboardKPIs }
}

// ─── Insights API ─────────────────────────────
export const getInsights = async () => {
  await delay(400)
  if (!MOCK_MODE) return api.get('/insights')
  return { data: mockInsights }
}

// ─── Reports API ──────────────────────────────
export const getReports = async () => {
  await delay(300)
  if (!MOCK_MODE) return api.get('/reports')
  return { data: mockReports }
}

// ─── Enrollment APIs ──────────────────────────
export const enrollInTraining = async (trainingId) => {
  await delay(500)
  if (!MOCK_MODE) return api.post(`/enrollment/${trainingId}`)
  const training = _trainings.find(t => t.id === trainingId || t.trainingId === trainingId)
  if (!training) throw new Error('Training not found')
  if (_enrollments.find(e => e.trainingId === trainingId)) {
    const err = new Error('Already enrolled')
    err.response = { data: { message: 'Already enrolled in this training' } }
    throw err
  }
  const enrollment = {
    enrollmentId: `enr-${Date.now()}`,
    trainingId,
    trainingName:  training.name || training.trainingName,
    userEmail:     'user@test.com',
    userName:      'Arjun Singh',
    state:         training.state,
    district:      training.district,
    date:          training.date,
    status:        'REGISTERED',
    enrolledAt:    new Date().toISOString(),
    evidenceUrl:   '',
  }
  _enrollments.push(enrollment)
  return { data: enrollment }
}

export const getMyEnrollments = async () => {
  await delay(300)
  if (!MOCK_MODE) return api.get('/enrollment/my')
  return { data: _enrollments }
}

export const getMyCertificates = async () => {
  await delay(300)
  if (!MOCK_MODE) return api.get('/enrollment/certificates')
  return { data: _enrollments.filter(e => e.status === 'COMPLETED') }
}

export const checkEnrollment = async (trainingId) => {
  await delay(200)
  if (!MOCK_MODE) return api.get(`/enrollment/check/${trainingId}`)
  const enrolled = !!_enrollments.find(e => e.trainingId === trainingId)
  return { data: { enrolled: String(enrolled) } }
}

export const getEnrollmentsByTraining = async (trainingId) => {
  await delay(300)
  if (!MOCK_MODE) return api.get(`/enrollment/training/${trainingId}`)
  return { data: _enrollments.filter(e => e.trainingId === trainingId) }
}

export const approveEnrollment = async (enrollmentId) => {
  await delay(400)
  if (!MOCK_MODE) return api.put(`/enrollment/${enrollmentId}/approve`)
  const e = _enrollments.find(e => e.enrollmentId === enrollmentId)
  if (e) e.status = 'COMPLETED'
  return { data: { message: 'Approved', status: 'COMPLETED' } }
}

export const approveTraining = async (trainingId) => {
  await delay(400)
  if (!MOCK_MODE) return api.put(`/enrollment/training/${trainingId}/approve`)
  const t = _trainings.find(t => t.id === trainingId || t.trainingId === trainingId)
  if (t) t.status = 'COMPLETED'
  return { data: { message: 'Training approved and marked as Completed', status: 'COMPLETED' } }
}

// ─── Evidence / Upload API ────────────────────
export const uploadEvidence = async (formData) => {
  await delay(800)
  if (!MOCK_MODE) return api.post('/evidence', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  const trainingId = formData.get?.('trainingId')
  if (trainingId) {
    const t = _trainings.find(t => t.id === trainingId || t.trainingId === trainingId)
    if (t) t.status = 'PENDING_APPROVAL'
  }
  return { data: { message: 'Evidence uploaded successfully. Pending admin approval.', filesUploaded: 1, urls: ['#demo-upload'] } }
}

// ─── S3 File Upload APIs ──────────────────────
export const uploadTrainingPhoto = async (file, trainingId = '') => {
  await delay(500)
  if (!MOCK_MODE) {
    const formData = new FormData()
    formData.append('photo', file)
    if (trainingId) formData.append('trainingId', trainingId)
    return api.post('/training/upload-photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  }
  return { data: { photoUrl: '' } }
}

export const getReportDownloadUrl = async (reportId) => {
  await delay(200)
  if (!MOCK_MODE) return api.get(`/reports/${reportId}/download`)
  return { data: { downloadUrl: null, message: 'Demo mode — PDF download not available in demo.' } }
}

export const uploadReportFile = async (formData) => {
  await delay(600)
  if (!MOCK_MODE) return api.post('/reports/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return { data: { message: 'Report uploaded (Demo mode — not persisted)' } }
}

export const getCertificateDownloadUrl = async (enrollmentId) => {
  await delay(300)
  if (!MOCK_MODE) return api.get(`/enrollment/certificates/${enrollmentId}/download`)
  return { data: { downloadUrl: null, message: 'Certificate PDF not available in demo mode. In production, certificates are generated after admin approval.' } }
}

export default api
