import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiSearch, FiMapPin, FiCalendar, FiUsers, FiFilter,
  FiShield, FiBookOpen, FiArrowRight, FiCheckCircle,
  FiLogIn, FiLogOut, FiTag, FiX
} from 'react-icons/fi'
import { mockTrainings, statesAndDistricts } from '../data/mockData'
import { getTrainings } from '../services/api'
import { getStoredAuth, clearStoredAuth } from '../auth/rbac'

const statusConfig = {
  Scheduled: { cls: 'badge-blue', dot: 'bg-blue-400' },
  Ongoing: { cls: 'badge-yellow', dot: 'bg-amber-400 animate-pulse' },
  Completed: { cls: 'badge-green', dot: 'bg-emerald-400' },
}

const PublicTrainingDiscovery = () => {
  const navigate = useNavigate()
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [registeredIds, setRegisteredIds] = useState(new Set())
  const [showRegModal, setShowRegModal] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await getTrainings()
        const data = res?.data
        if (data && data.length > 0) {
          // Normalize backend field trainingName → name for display
          const normalized = data.map(t => ({
            ...t,
            id: t.trainingId || t.id,
            name: t.trainingName || t.name,
          }))
          setTrainings(normalized)
        } else {
          setTrainings(mockTrainings)
        }
      } catch {
        setTrainings(mockTrainings)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = trainings.filter(t => {
    const q = search.toLowerCase()
    const matchSearch = t.name.toLowerCase().includes(q) ||
      t.theme.toLowerCase().includes(q) ||
      t.district.toLowerCase().includes(q) ||
      t.state.toLowerCase().includes(q)
    const matchState = !stateFilter || t.state === stateFilter
    const matchStatus = statusFilter === 'All' || t.status === statusFilter
    return matchSearch && matchState && matchStatus
  })

  const handleRegister = (training) => {
    if (registeredIds.has(training.id)) return
    setShowRegModal(training)
  }

  const confirmRegister = () => {
    if (showRegModal) {
      setRegisteredIds(prev => new Set([...prev, showRegModal.id]))
      setShowRegModal(null)
    }
  }

  const { token } = getStoredAuth()
  const isLoggedIn = !!token

  const handleLogout = () => {
    clearStoredAuth()
    navigate('/login', { state: { loggedOut: true } })
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Bar */}
      <header className="bg-gray-900/95 backdrop-blur border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiShield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">DisasterTrain360 AI</p>
              <p className="text-xs text-gray-400 hidden sm:block">Public Training Discovery</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-all"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all"
              >
                <FiLogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900/50 to-gray-950 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-medium mb-4">
            <FiBookOpen className="w-3.5 h-3.5" />
            National Disaster Preparedness Training Programs
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Find Disaster Training Programs
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Discover and register for government-certified disaster preparedness training programs across India.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by training name, theme, district, or state..."
              className="w-full bg-gray-900/80 backdrop-blur border border-gray-600 rounded-xl pl-12 pr-4 py-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-400">
            <span><span className="text-white font-semibold">{trainings.length}</span> Programs Available</span>
            <span><span className="text-white font-semibold">{trainings.filter(t => t.status === 'Scheduled').length}</span> Upcoming</span>
            <span><span className="text-white font-semibold">{trainings.filter(t => t.status === 'Ongoing').length}</span> Ongoing</span>
            <span><span className="text-white font-semibold">{Object.keys(statesAndDistricts).length}</span> States Covered</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Filters */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 flex-shrink-0">
            <FiFilter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400 font-medium">Filter by:</span>
          </div>

          {/* State */}
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All States</option>
            {Object.keys(statesAndDistricts).sort().map(s => <option key={s}>{s}</option>)}
          </select>

          {/* Status */}
          {['All', 'Scheduled', 'Ongoing', 'Completed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${
                statusFilter === s
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
              }`}
            >
              {s}
            </button>
          ))}

          <span className="ml-auto text-sm text-gray-400">{filtered.length} results</span>
        </div>

        {/* Training Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-400">Loading available programs...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/40 rounded-xl border border-gray-800">
            <FiBookOpen className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-400 font-medium">No training programs found</p>
            <p className="text-sm text-gray-600 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(t => {
              const sc = statusConfig[t.status] || statusConfig.Scheduled
              const isRegistered = registeredIds.has(t.id)
              const canRegister = t.status === 'Scheduled' || t.status === 'Ongoing'
              return (
                <div
                  key={t.id}
                  className="bg-gray-900/70 border border-gray-800 hover:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
                >
                  {/* Card Header */}
                  <div className="p-5 pb-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className={`${sc.cls} flex items-center gap-1.5`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {t.status}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <FiTag className="w-3 h-3" />
                        {t.theme}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors leading-snug mb-4">
                      {t.name}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FiMapPin className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <span className="truncate">{t.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FiMapPin className="w-4 h-4 text-blue-500/60 flex-shrink-0" />
                        <span>{t.district}, {t.state}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FiCalendar className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <span>{new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FiUsers className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <span>{t.participants.toLocaleString()} participants expected</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 pb-5">
                    <div className="h-px bg-gray-800 mb-4" />
                    {canRegister ? (
                      <button
                        onClick={() => handleRegister(t)}
                        disabled={isRegistered}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                          ${isRegistered
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 cursor-default'
                            : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95 shadow-sm'
                          }`}
                      >
                        {isRegistered ? (
                          <span className="flex items-center justify-center gap-2">
                            <FiCheckCircle className="w-4 h-4" /> Registered Successfully
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <FiUsers className="w-4 h-4" /> Register Now
                          </span>
                        )}
                      </button>
                    ) : (
                      <div className="w-full py-2.5 rounded-lg text-sm font-medium text-center bg-gray-800/60 text-gray-500 border border-gray-700">
                        Registration Closed
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Register Modal */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Register for Training</h3>
              <button onClick={() => setShowRegModal(null)} className="text-gray-500 hover:text-white transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-800/60 rounded-xl p-4 mb-5 space-y-2">
              <p className="text-sm font-semibold text-white">{showRegModal.name}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FiMapPin className="w-3.5 h-3.5" />
                <span>{showRegModal.district}, {showRegModal.state}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FiCalendar className="w-3.5 h-3.5" />
                <span>{new Date(showRegModal.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-5">
              By registering, you confirm your intent to participate. You will receive a confirmation notification with further details.
            </p>

            <div className="flex gap-3">
              <button onClick={confirmRegister} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <FiCheckCircle className="w-4 h-4" />
                Confirm Registration
              </button>
              <button onClick={() => setShowRegModal(null)} className="btn-secondary px-5">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 mt-12 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <span>© 2026 NDMA – National Disaster Management Authority, Government of India</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              Platform Operational
            </span>
            <span>DisasterTrain360 AI v2.4</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicTrainingDiscovery
