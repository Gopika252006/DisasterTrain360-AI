import axios from 'axios'

// ─── Base Config ──────────────────────────────
const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor (attach token) ───────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dt360_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
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

// ─── Mock Mode Flag ───────────────────────────
export const MOCK_MODE = false // Backend is now running at VITE_API_URL

// ─── Auth APIs ────────────────────────────────
export const loginUser = (credentials) => {
  if (MOCK_MODE) return Promise.resolve({ data: { token: 'mock-jwt-token', user: credentials } })
  return api.post('/login', credentials)
}

export const registerUser = (userData) => {
  if (MOCK_MODE) return Promise.resolve({ data: { message: 'User Registered Successfully' } })
  return api.post('/register', userData)
}

// ─── Training APIs ────────────────────────────
export const createTraining = (trainingData) => {
  if (MOCK_MODE) return Promise.resolve({ data: { id: `tr${Date.now()}`, ...trainingData } })
  return api.post('/training', trainingData)
}

export const getTrainings = (params) => {
  if (MOCK_MODE) return Promise.resolve({ data: [] }) // overridden at call site with mock data
  return api.get('/training', { params })
}

export const getTrainingById = (id) => {
  if (MOCK_MODE) return Promise.resolve({ data: null })
  return api.get(`/training/${id}`)
}

// ─── Dashboard API ────────────────────────────
export const getDashboard = () => {
  if (MOCK_MODE) return Promise.resolve({ data: null })
  return api.get('/dashboard')
}

// ─── Insights API ─────────────────────────────
export const getInsights = () => {
  if (MOCK_MODE) return Promise.resolve({ data: [] })
  return api.get('/insights')
}

// ─── Reports API ──────────────────────────────
export const getReports = () => {
  if (MOCK_MODE) return Promise.resolve({ data: [] })
  return api.get('/reports')
}

export default api
