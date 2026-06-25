import React, { useState } from 'react'
import {
  FiFileText, FiDownload, FiCalendar, FiCpu, FiHardDrive,
  FiLoader, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi'
import { getReportDownloadUrl } from '../services/api'

const typeConfig = {
  'Quarterly Summary': { color: 'blue', icon: '📊' },
  'State Assessment': { color: 'amber', icon: '🗺️' },
  'Performance Report': { color: 'purple', icon: '📈' },
  'Risk Analysis': { color: 'red', icon: '⚠️' },
  'Annual Report': { color: 'emerald', icon: '📋' },
  'Action Plan': { color: 'cyan', icon: '🎯' },
}

const colorMap = {
  blue: { border: 'border-blue-500/20', badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30', btn: 'bg-blue-600 hover:bg-blue-700' },
  amber: { border: 'border-amber-500/20', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', btn: 'bg-amber-600 hover:bg-amber-700' },
  purple: { border: 'border-purple-500/20', badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30', btn: 'bg-purple-600 hover:bg-purple-700' },
  red: { border: 'border-red-500/20', badge: 'bg-red-500/15 text-red-400 border-red-500/30', btn: 'bg-red-600 hover:bg-red-700' },
  emerald: { border: 'border-emerald-500/20', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  cyan: { border: 'border-cyan-500/20', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', btn: 'bg-cyan-600 hover:bg-cyan-700' },
}

const ReportCard = ({ report }) => {
  const [downloading, setDownloading] = useState(false)
  const [dlError, setDlError]         = useState('')

  // Support both backend (reportName) and mock (name) field names
  const displayName = report.reportName || report.name || 'Untitled Report'
  const reportId    = report.reportId   || report.id
  const tc = typeConfig[report.type] || typeConfig['Quarterly Summary']
  const c  = colorMap[tc.color] || colorMap.blue
  const isReady = report.status === 'Ready'

  const handleDownload = async () => {
    if (!reportId) return
    setDownloading(true)
    setDlError('')
    try {
      const res = await getReportDownloadUrl(reportId)
      const url = res?.data?.downloadUrl
      if (url) {
        // open presigned S3 URL in a new tab — browser triggers download
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        setDlError(res?.data?.message || 'No file attached to this report.')
      }
    } catch {
      setDlError('Download failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className={`rounded-xl border ${c.border} bg-gray-900/60 backdrop-blur-sm hover:bg-gray-900/80 hover:shadow-lg transition-all duration-300 group`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
            {tc.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm leading-snug mb-1 group-hover:text-blue-300 transition-colors line-clamp-2">
              {displayName}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${c.badge}`}>
              {report.type}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 mb-4 leading-relaxed line-clamp-2">
          {report.description}
        </p>

        {/* Meta */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiCalendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Generated: {new Date(report.generatedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiCpu className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{report.generatedBy}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FiHardDrive className="w-3.5 h-3.5" />
              <span>{report.size}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FiFileText className="w-3.5 h-3.5" />
              <span>{report.format}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs ml-auto">
              {isReady
                ? <><FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Ready</span></>
                : <><FiLoader className="w-3.5 h-3.5 text-amber-400 animate-spin" /><span className="text-amber-400">Processing</span></>
              }
            </div>
          </div>
        </div>

        {/* Download error */}
        {dlError && (
          <div className="flex items-center gap-2 mb-2 text-xs text-red-400">
            <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {dlError}
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!isReady || downloading}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-200
            ${isReady
              ? `${c.btn} active:scale-95 shadow-sm`
              : 'bg-gray-700 cursor-not-allowed opacity-60'
            }`}
        >
          {downloading
            ? <><FiLoader className="w-4 h-4 animate-spin" /> Getting link...</>
            : isReady
              ? <><FiDownload className="w-4 h-4" /> Download Report</>
              : <><FiLoader className="w-4 h-4 animate-spin" /> Processing...</>
          }
        </button>
      </div>
    </div>
  )
}

export default ReportCard
