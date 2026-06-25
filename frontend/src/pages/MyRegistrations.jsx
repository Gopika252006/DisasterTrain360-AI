import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiBookmark, FiCalendar, FiMapPin, FiCheckCircle,
  FiClock, FiRefreshCw, FiAlertCircle, FiBookOpen
} from 'react-icons/fi'
import { getMyEnrollments } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const statusConfig = {
  REGISTERED: { cls: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',    label: 'Registered' },
  COMPLETED:  { cls: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', label: 'Completed' },
  CANCELLED:  { cls: 'bg-red-500/20 text-red-400 border border-red-500/30',        label: 'Cancelled' },
}

const MyRegistrations = () => {
  const navigate = useNavigate()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getMyEnrollments()
      setRegistrations(res?.data || [])
    } catch (err) {
      setError('Failed to load registrations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <FiBookmark className="w-6 h-6 text-blue-400" />
            My Registrations
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Training programs you have enrolled in
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg transition-all disabled:opacity-50"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 p-3.5 bg-red-900/20 border border-red-500/30 rounded-xl text-sm text-red-400">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading your registrations..." />
        </div>
      ) : registrations.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FiBookmark className="w-12 h-12 mx-auto mb-3 text-gray-700" />
          <p className="text-gray-400 font-medium">No registrations yet</p>
          <p className="text-sm text-gray-600 mt-1 mb-5">
            Browse available training programs and register to get started
          </p>
          <button
            onClick={() => navigate('/discover')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiBookOpen className="w-4 h-4" />
            Browse Trainings
          </button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Enrolled',  value: registrations.length,                                       color: 'text-blue-400',    border: 'border-blue-500/20',    bg: 'bg-blue-500/5' },
              { label: 'Completed',       value: registrations.filter(r => r.status === 'COMPLETED').length, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
              { label: 'Upcoming',        value: registrations.filter(r => r.status === 'REGISTERED').length,color: 'text-amber-400',   border: 'border-amber-500/20',   bg: 'bg-amber-500/5' },
            ].map(s => (
              <div key={s.label} className={`glass-card p-4 border ${s.border} ${s.bg} text-center`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {registrations.map(r => {
              const sc = statusConfig[r.status] || statusConfig.REGISTERED
              return (
                <div key={r.enrollmentId} className="glass-card p-5 hover:border-blue-500/30 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-white text-sm leading-snug">{r.trainingName}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${sc.cls}`}>
                      {sc.label}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-3.5 h-3.5 text-gray-600" />
                      <span>{r.district}, {r.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-3.5 h-3.5 text-gray-600" />
                      <span>
                        Training date:{' '}
                        {r.date
                          ? new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
                          : '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="w-3.5 h-3.5 text-gray-600" />
                      <span>
                        Registered on:{' '}
                        {r.enrolledAt
                          ? new Date(r.enrolledAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
                          : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      ID: <span className="text-gray-300 font-mono">{r.enrollmentId?.slice(0, 8).toUpperCase()}</span>
                    </span>
                    {r.status === 'COMPLETED' && (
                      <button
                        onClick={() => navigate('/certificates')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                      >
                        <FiCheckCircle className="w-3.5 h-3.5" /> View Certificate →
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default MyRegistrations
