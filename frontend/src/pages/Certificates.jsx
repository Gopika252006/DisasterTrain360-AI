import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiAward, FiDownload, FiCalendar, FiCheckCircle,
  FiRefreshCw, FiAlertCircle, FiBookOpen, FiMapPin, FiLoader
} from 'react-icons/fi'
import { getMyCertificates, getCertificateDownloadUrl } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Certificates = () => {
  const navigate = useNavigate()
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [downloading, setDownloading]   = useState({}) // { enrollmentId: true/false }

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getMyCertificates()
      setCertificates(res?.data || [])
    } catch {
      setError('Failed to load certificates. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDownload = async (enrollmentId, trainingName) => {
    setDownloading(d => ({ ...d, [enrollmentId]: true }))
    try {
      const res = await getCertificateDownloadUrl(enrollmentId)
      const url = res?.data?.downloadUrl
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        // Certificate PDF not yet uploaded — show a note
        alert(res?.data?.message || `Certificate for "${trainingName}" is not yet available for download.`)
      }
    } catch {
      alert('Download failed. Please try again.')
    } finally {
      setDownloading(d => ({ ...d, [enrollmentId]: false }))
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <FiAward className="w-6 h-6 text-blue-400" />
            My Certificates
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            NDMA-issued training completion certificates
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
          <LoadingSpinner size="lg" text="Loading your certificates..." />
        </div>
      ) : certificates.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FiAward className="w-12 h-12 mx-auto mb-3 text-gray-700" />
          <p className="text-gray-400 font-medium">No certificates yet</p>
          <p className="text-sm text-gray-600 mt-1 mb-5">
            Complete a training program to earn your NDMA certificate
          </p>
          <button
            onClick={() => navigate('/my-registrations')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiBookOpen className="w-4 h-4" />
            View My Registrations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map(c => (
            <div
              key={c.enrollmentId}
              className="glass-card p-5 border-emerald-500/20 bg-gradient-to-br from-emerald-900/10 to-transparent"
            >
              {/* Certificate header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiAward className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wide mb-0.5">
                    Certificate of Completion
                  </p>
                  <h3 className="font-bold text-white text-sm leading-snug">{c.trainingName}</h3>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Status: <span className="text-emerald-400 font-medium">Completed</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-3.5 h-3.5 text-gray-600" />
                  <span>{c.district}, {c.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-3.5 h-3.5 text-gray-600" />
                  <span>
                    Completed:{' '}
                    {c.date
                      ? new Date(c.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
                      : '—'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-800/60 rounded-lg px-3 py-2 mb-4">
                <p className="text-xs text-gray-500">Credential ID</p>
                <p className="text-xs font-mono text-gray-300 mt-0.5">
                  NDMA-{c.enrollmentId?.slice(0, 8).toUpperCase() || 'XXXXXXXX'}
                </p>
              </div>

              <button
                onClick={() => handleDownload(c.enrollmentId, c.trainingName)}
                disabled={downloading[c.enrollmentId]}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {downloading[c.enrollmentId]
                  ? <><FiLoader className="w-4 h-4 animate-spin" /> Getting link...</>
                  : <><FiDownload className="w-4 h-4" /> Download Certificate</>
                }
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Certificates
