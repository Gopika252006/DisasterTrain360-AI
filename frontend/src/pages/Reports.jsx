import React, { useState, useEffect, useRef } from 'react'
import { FiFileText, FiSearch, FiFilter, FiRefreshCw, FiDownload, FiPlusCircle, FiX, FiAlertCircle, FiUploadCloud, FiLoader } from 'react-icons/fi'
import ReportCard from '../components/ReportCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { mockReports } from '../data/mockData'
import { getReports, uploadReportFile } from '../services/api'

const reportTypes = ['All Types', 'Quarterly Summary', 'State Assessment', 'Performance Report', 'Risk Analysis', 'Annual Report', 'Action Plan']

const Reports = () => {
  const [reports, setReports]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [typeFilter, setTypeFilter]     = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('All')

  // Upload modal state
  const [showUpload, setShowUpload]     = useState(false)
  const [uploadForm, setUploadForm]     = useState({ reportName: '', type: 'Quarterly Summary', description: '' })
  const [uploadFile, setUploadFile]     = useState(null)
  const [uploading, setUploading]       = useState(false)
  const [uploadError, setUploadError]   = useState('')
  const fileRef                         = useRef()

  const loadReports = async () => {
    setLoading(true)
    try {
      const res = await getReports()
      const data = res?.data
      setReports(data && data.length > 0 ? data : mockReports)
    } catch {
      setReports(mockReports)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadReports() }, [])

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!uploadFile) { setUploadError('Please select a PDF file.'); return }
    if (!uploadForm.reportName.trim()) { setUploadError('Report name is required.'); return }
    setUploading(true)
    setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file',        uploadFile)
      fd.append('reportName',  uploadForm.reportName)
      fd.append('type',        uploadForm.type)
      fd.append('description', uploadForm.description)
      await uploadReportFile(fd)
      setShowUpload(false)
      setUploadForm({ reportName: '', type: 'Quarterly Summary', description: '' })
      setUploadFile(null)
      await loadReports()          // refresh list
    } catch (err) {
      setUploadError(err?.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const filtered = reports.filter(r => {
    const q = search.toLowerCase()
    // support both backend (reportName) and mock (name) field
    const nameVal = (r.reportName || r.name || '').toLowerCase()
    const matchSearch = nameVal.includes(q) || (r.generatedBy || '').toLowerCase().includes(q)
    const matchType = typeFilter === 'All Types' || r.type === typeFilter
    const matchStatus = statusFilter === 'All' || r.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const readyCount = reports.filter(r => r.status === 'Ready').length
  const processingCount = reports.filter(r => r.status === 'Processing').length

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <FiFileText className="w-6 h-6 text-blue-400" />
            Intelligence Reports
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Download national and state-level disaster training analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadReports}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg transition-all"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-all"
          >
            <FiPlusCircle className="w-3.5 h-3.5" />
            Upload Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: reports.length, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
          { label: 'Ready to Download', value: readyCount, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
          { label: 'Processing', value: processingCount, color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
          { label: 'Total Size', value: `${reports.reduce((sum, r) => sum + parseFloat(r.size), 0).toFixed(1)} MB`, color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/5' },
        ].map(s => (
          <div key={s.label} className={`glass-card p-4 border ${s.border} ${s.bg} text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field text-sm">
            {reportTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field text-sm">
          <option value="All">All Status</option>
          <option value="Ready">Ready</option>
          <option value="Processing">Processing</option>
        </select>
        <div className="flex items-center gap-3 ml-auto text-sm text-gray-400">
          <span>{filtered.length} reports</span>
          <button className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
            <FiDownload className="w-3.5 h-3.5" />
            Download All
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading reports..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <FiFileText className="w-12 h-12 mx-auto mb-3 text-gray-700" />
          <p className="text-gray-400 font-medium">No reports match your criteria</p>
          <p className="text-sm text-gray-600 mt-1">Try adjusting the search or filter settings</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(report => (
            <ReportCard key={report.reportId || report.id} report={report} />
          ))}
        </div>
      )}

      {/* Info Footer */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <FiFileText className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-gray-300 font-medium">NDMA Analytics & Reporting Platform</span>
        </div>
        <span>|</span>
        <span>Reports are generated using verified NDMA data sources</span>
        <span>|</span>
        <span>All downloads are encrypted and audit-logged</span>
      </div>

      {/* Upload Report Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FiUploadCloud className="w-5 h-5 text-blue-400" />
                Upload Report PDF
              </h2>
              <button onClick={() => { setShowUpload(false); setUploadError('') }} className="text-gray-500 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-sm text-red-400">
                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="label">Report Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={uploadForm.reportName}
                  onChange={e => setUploadForm(f => ({ ...f, reportName: e.target.value }))}
                  placeholder="e.g., Q2 2026 National Disaster Training Summary"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Report Type</label>
                <select
                  value={uploadForm.type}
                  onChange={e => setUploadForm(f => ({ ...f, type: e.target.value }))}
                  className="input-field"
                >
                  {reportTypes.filter(t => t !== 'All Types').map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Description (optional)</label>
                <textarea
                  rows={2}
                  value={uploadForm.description}
                  onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of this report"
                  className="input-field resize-none"
                />
              </div>
              <div>
                <label className="label">PDF File <span className="text-red-400">*</span></label>
                <label
                  htmlFor="report-pdf"
                  className="flex items-center gap-3 p-3 border border-dashed border-gray-700 hover:border-blue-500/50 rounded-lg cursor-pointer transition-all"
                >
                  <FiUploadCloud className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-400">
                    {uploadFile ? uploadFile.name : 'Click to select PDF…'}
                  </span>
                  <input
                    id="report-pdf"
                    ref={fileRef}
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={e => { setUploadFile(e.target.files[0] || null); setUploadError('') }}
                  />
                </label>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploading
                    ? <><FiLoader className="w-4 h-4 animate-spin" /> Uploading to S3...</>
                    : <><FiUploadCloud className="w-4 h-4" /> Upload Report</>
                  }
                </button>
                <button type="button" onClick={() => { setShowUpload(false); setUploadError('') }} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports
