import React, { useState, useEffect } from 'react'
import {
  FiClipboard, FiCheckCircle, FiRefreshCw, FiExternalLink,
  FiAlertCircle, FiClock, FiCalendar, FiMapPin,
  FiCheck, FiList, FiUser, FiEye
} from 'react-icons/fi'
import { getTrainings } from '../services/api'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const statusConfig = {
  PENDING_APPROVAL: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  COMPLETED:        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  SCHEDULED:        'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  ONGOING:          'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  CANCELLED:        'bg-red-500/20 text-red-400 border border-red-500/30',
}

const StatusBadge = ({ status }) => (
  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[status] || statusConfig.SCHEDULED}`}>
    {status?.replace('_', ' ') || 'SCHEDULED'}
  </span>
)

const EvidenceReview = () => {
  const [trainings, setTrainings]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [approving, setApproving]       = useState(null)
  const [viewingFile, setViewingFile]   = useState(null)  // trainingId whose link is loading
  const [successMsg, setSuccessMsg]     = useState('')
  const [error, setError]               = useState('')
  const [filterStatus, setFilterStatus] = useState('PENDING_APPROVAL')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getTrainings()
      setTrainings(res?.data || [])
    } catch {
      setError('Failed to load trainings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleApprove = async (training) => {    setApproving(training.trainingId)
    setError('')
    setSuccessMsg('')
    try {
      await api.put(`/enrollment/training/${training.trainingId}/approve`)
      setSuccessMsg(`✓ "${training.trainingName}" has been approved and marked as Completed`)
      // Update local state instantly
      setTrainings(prev =>
        prev.map(t =>
          t.trainingId === training.trainingId ? { ...t, status: 'COMPLETED' } : t
        )
      )
      setTimeout(() => setSuccessMsg(''), 5000)
    } catch (err) {
      setError(err?.response?.data?.message || 'Approval failed. Try again.')
    } finally {
      setApproving(null)
    }
  }

  // Fetch a fresh presigned URL and open it in a new tab
  const handleViewFile = async (training) => {
    if (!training.photoUrl) return
    setViewingFile(training.trainingId)
    try {
      const res = await api.get(`/evidence/presigned?key=${encodeURIComponent(training.photoUrl)}`)
      window.open(res.data.url, '_blank', 'noopener,noreferrer')
    } catch {
      setError('Could not generate file link. Try again.')
    } finally {
      setViewingFile(null)
    }
  }

  const pendingList    = trainings.filter(t => t.status === 'PENDING_APPROVAL')
  const completedList  = trainings.filter(t => t.status === 'COMPLETED')
  const scheduledList  = trainings.filter(t => t.status === 'SCHEDULED' || t.status === 'ONGOING')

  const filtered = filterStatus === 'ALL'
    ? trainings
    : trainings.filter(t => t.status === filterStatus)

  return (
    <div className="page-container">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <FiClipboard className="w-6 h-6 text-blue-400" />
            Evidence Review
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Review submitted evidence and approve training completions
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg transition-all self-start"
        >
          <FiRefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 border border-amber-500/20 bg-amber-500/5 cursor-pointer" onClick={() => setFilterStatus('PENDING_APPROVAL')}>
          <p className="text-2xl font-bold text-amber-400">{pendingList.length}</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
            <FiClock className="w-3.5 h-3.5" /> Pending Approval
          </p>
        </div>
        <div className="glass-card p-4 border border-emerald-500/20 bg-emerald-500/5 cursor-pointer" onClick={() => setFilterStatus('COMPLETED')}>
          <p className="text-2xl font-bold text-emerald-400">{completedList.length}</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
            <FiCheckCircle className="w-3.5 h-3.5" /> Completed
          </p>
        </div>
        <div className="glass-card p-4 border border-blue-500/20 bg-blue-500/5 cursor-pointer" onClick={() => setFilterStatus('SCHEDULED')}>
          <p className="text-2xl font-bold text-blue-400">{scheduledList.length}</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
            <FiCalendar className="w-3.5 h-3.5" /> Scheduled
          </p>
        </div>
        <div className="glass-card p-4 border border-gray-700 cursor-pointer" onClick={() => setFilterStatus('ALL')}>
          <p className="text-2xl font-bold text-gray-300">{trainings.length}</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
            <FiList className="w-3.5 h-3.5" /> All Trainings
          </p>
        </div>
      </div>

      {/* Success / Error banners */}
      {successMsg && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-sm text-emerald-400">
          <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
          {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2.5 p-3.5 bg-red-900/20 border border-red-500/30 rounded-xl text-sm text-red-400">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'PENDING_APPROVAL', label: `Pending (${pendingList.length})` },
          { key: 'COMPLETED',        label: `Completed (${completedList.length})` },
          { key: 'ALL',              label: `All (${trainings.length})` },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              filterStatus === f.key
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:text-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" text="Loading trainings..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FiClipboard className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-400 font-medium">
              {filterStatus === 'PENDING_APPROVAL'
                ? 'No pending evidence submissions'
                : 'No records found'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {filterStatus === 'PENDING_APPROVAL'
                ? 'Evidence will appear here after trainers upload their files'
                : 'Try a different filter'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Training</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Provider</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Evidence</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filtered.map(t => (
                  <tr key={t.trainingId} className="hover:bg-gray-800/30 transition-colors">

                    {/* Training name */}
                    <td className="px-4 py-3">
                      <p className="text-gray-200 text-xs font-medium line-clamp-2 max-w-[200px]">
                        {t.trainingName}
                      </p>
                      <p className="text-gray-600 text-xs mt-0.5">{t.theme}</p>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FiMapPin className="w-3 h-3 flex-shrink-0" />
                        {t.district}, {t.state}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FiCalendar className="w-3 h-3 flex-shrink-0" />
                        {t.date
                          ? new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '—'}
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FiUser className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate max-w-[130px]">{t.createdBy || '—'}</span>
                      </div>
                    </td>

                    {/* Evidence link */}
                    <td className="px-4 py-3">
                      {t.photoUrl && t.status === 'PENDING_APPROVAL' ? (
                        <button
                          onClick={() => handleViewFile(t)}
                          disabled={viewingFile === t.trainingId}
                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-60"
                        >
                          {viewingFile === t.trainingId ? (
                            <span className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                          ) : (
                            <FiEye className="w-3 h-3" />
                          )}
                          View File
                        </button>
                      ) : t.status === 'PENDING_APPROVAL' ? (
                        <span className="text-xs text-amber-400">Awaiting file link</span>
                      ) : t.status === 'COMPLETED' ? (
                        <span className="text-xs text-emerald-400">Approved</span>
                      ) : (
                        <span className="text-xs text-gray-600">Not submitted</span>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-right">
                      {t.status === 'PENDING_APPROVAL' ? (
                        <button
                          onClick={() => handleApprove(t)}
                          disabled={approving === t.trainingId}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-all"
                        >
                          {approving === t.trainingId ? (
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <FiCheck className="w-3.5 h-3.5" />
                          )}
                          Approve
                        </button>
                      ) : t.status === 'COMPLETED' ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400 justify-end">
                          <FiCheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default EvidenceReview
