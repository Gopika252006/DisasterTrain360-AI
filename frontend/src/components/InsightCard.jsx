import React, { useState } from 'react'
import {
  FiAlertTriangle, FiAlertCircle, FiCheckCircle, FiInfo,
  FiTrendingUp, FiTarget, FiChevronDown, FiChevronUp,
  FiMapPin, FiCpu
} from 'react-icons/fi'

const riskConfig = {
  Critical: {
    border: 'border-red-500/40',
    bg: 'from-red-900/20 to-red-800/10',
    badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
    icon: FiAlertTriangle,
    iconColor: 'text-red-400',
    dot: 'bg-red-400',
  },
  High: {
    border: 'border-amber-500/40',
    bg: 'from-amber-900/20 to-amber-800/10',
    badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    icon: FiAlertCircle,
    iconColor: 'text-amber-400',
    dot: 'bg-amber-400',
  },
  Moderate: {
    border: 'border-blue-500/40',
    bg: 'from-blue-900/20 to-blue-800/10',
    badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    icon: FiInfo,
    iconColor: 'text-blue-400',
    dot: 'bg-blue-400',
  },
  Low: {
    border: 'border-emerald-500/40',
    bg: 'from-emerald-900/20 to-emerald-800/10',
    badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    icon: FiCheckCircle,
    iconColor: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
}

const scoreColor = (score) => {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-blue-400'
  if (score >= 40) return 'text-amber-400'
  return 'text-red-400'
}

const scoreBarColor = (score) => {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-blue-500'
  if (score >= 40) return 'bg-amber-500'
  return 'bg-red-500'
}

const InsightCard = ({ insight }) => {
  const [expanded, setExpanded] = useState(false)
  const rc = riskConfig[insight.riskLevel] || riskConfig.Moderate
  const RiskIcon = rc.icon

  return (
    <div
      className={`rounded-xl border ${rc.border} bg-gradient-to-br ${rc.bg} backdrop-blur-sm
        hover:shadow-lg transition-all duration-300 overflow-hidden`}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg bg-black/20 flex items-center justify-center flex-shrink-0`}>
              <RiskIcon className={`w-5 h-5 ${rc.iconColor}`} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">{insight.district}</h3>
              <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                <FiMapPin className="w-3 h-3" />
                <span>{insight.state}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${rc.badge}`}>
              {insight.riskLevel} Risk
            </span>
            <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
              {insight.coverageStatus}
            </span>
          </div>
        </div>

        {/* Score Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-400">Preparedness Score</span>
            <span className={`text-lg font-bold ${scoreColor(insight.preparednessScore)}`}>
              {insight.preparednessScore}%
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(insight.preparednessScore)}`}
              style={{ width: `${insight.preparednessScore}%` }}
            />
          </div>
        </div>

        {/* AI Confidence */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <FiCpu className="w-3.5 h-3.5 text-blue-400" />
          <span>AI Confidence: <span className="text-blue-400 font-medium">{insight.aiConfidence}%</span></span>
          <span className="ml-auto text-gray-600">{new Date(insight.lastUpdated).toLocaleDateString('en-IN')}</span>
        </div>

        {/* Gap Analysis Preview */}
        <div className="bg-black/20 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-300 mb-1.5">
            <FiTrendingUp className="w-3.5 h-3.5" />
            Gap Analysis
          </div>
          <p className={`text-xs text-gray-400 ${expanded ? '' : 'line-clamp-2'}`}>
            {insight.gapAnalysis}
          </p>
        </div>

        {/* Recommendation (expandable) */}
        {expanded && (
          <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-blue-400 mb-1.5">
              <FiTarget className="w-3.5 h-3.5" />
              AI Recommendation
            </div>
            <p className="text-xs text-gray-300">{insight.recommendation}</p>
          </div>
        )}

        {/* Toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          {expanded ? (
            <><FiChevronUp className="w-3.5 h-3.5" /> Show Less</>
          ) : (
            <><FiChevronDown className="w-3.5 h-3.5" /> View Recommendation</>
          )}
        </button>
      </div>
    </div>
  )
}

export default InsightCard
