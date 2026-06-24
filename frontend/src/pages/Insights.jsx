import React, { useState, useEffect } from 'react'
import {
  FiCpu, FiFilter, FiSearch, FiRefreshCw,
  FiTrendingUp, FiAlertTriangle, FiCheckCircle
} from 'react-icons/fi'
import InsightCard from '../components/InsightCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { mockInsights } from '../data/mockData'
import { getInsights } from '../services/api'

// Normalize backend UPPERCASE enums → frontend display values
const toTitleRisk = (r) => {
  const map = { LOW: 'Low', MODERATE: 'Moderate', HIGH: 'High', CRITICAL: 'Critical' }
  return map[r?.toUpperCase()] || r || 'Moderate'
}

const toCoverageDisplay = (c) => {
  const map = {
    WELL_COVERED:          'Well Covered',
    ADEQUATELY_COVERED:    'Adequately Covered',
    PARTIALLY_COVERED:     'Partially Covered',
    UNDER_COVERED:         'Under-Covered',
    SEVERELY_UNDER_COVERED:'Severely Under-Covered',
  }
  return map[c?.toUpperCase()] || c || 'Partially Covered'
}

const riskLevels = ['All', 'Critical', 'High', 'Moderate', 'Low']
const coverageOptions = ['All Coverage', 'Severely Under-Covered', 'Under-Covered', 'Partially Covered', 'Adequately Covered', 'Well Covered']

const Insights = () => {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('All')
  const [coverageFilter, setCoverageFilter] = useState('All Coverage')
  const [sortBy, setSortBy] = useState('score-asc')

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true)
      try {
        const res = await getInsights()
        const data = res?.data
        if (data && data.length > 0) {
          // Normalize backend format to frontend format
          const normalized = data.map(i => ({
            ...i,
            id: i.insightId || i.id,
            // Backend uses UPPERCASE (LOW/HIGH/CRITICAL), frontend uses Title case
            riskLevel: toTitleRisk(i.riskLevel),
            // Backend uses UNDERSCORE format, frontend uses display format
            coverageStatus: toCoverageDisplay(i.coverageStatus),
          }))
          setInsights(normalized)
        } else {
          setInsights(mockInsights)
        }
      } catch {
        setInsights(mockInsights)
      } finally {
        setLoading(false)
      }
    }
    loadInsights()
  }, [])

  const filtered = insights
    .filter(i => {
      const q = search.toLowerCase()
      const matchSearch = i.district.toLowerCase().includes(q) || i.state.toLowerCase().includes(q)
      const matchRisk = riskFilter === 'All' || i.riskLevel === riskFilter
      const matchCoverage = coverageFilter === 'All Coverage' || i.coverageStatus === coverageFilter
      return matchSearch && matchRisk && matchCoverage
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score-asc': return a.preparednessScore - b.preparednessScore
        case 'score-desc': return b.preparednessScore - a.preparednessScore
        case 'confidence': return b.aiConfidence - a.aiConfidence
        default: return 0
      }
    })

  const stats = {
    critical: insights.filter(i => i.riskLevel === 'Critical').length,
    high: insights.filter(i => i.riskLevel === 'High').length,
    avgScore: insights.length ? Math.round(insights.reduce((s, i) => s + i.preparednessScore, 0) / insights.length) : 0,
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <FiCpu className="w-6 h-6 text-blue-400" />
            AI District Insights
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            AI-generated preparedness analysis and gap recommendations
          </p>
        </div>
        <button
          onClick={() => {
          setLoading(true)
          getInsights().then(res => {
            const data = res?.data
            if (data && data.length > 0) {
              setInsights(data.map(i => ({
                ...i,
                id: i.insightId || i.id,
                riskLevel: toTitleRisk(i.riskLevel),
                coverageStatus: toCoverageDisplay(i.coverageStatus),
              })))
            } else {
              setInsights([...mockInsights])
            }
          }).catch(() => setInsights([...mockInsights]))
            .finally(() => setLoading(false))
        }}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg transition-all"
        >
          <FiRefreshCw className="w-3.5 h-3.5" />
          Refresh Insights
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Districts Analyzed', value: insights.length, icon: FiTrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Critical Risk Districts', value: stats.critical, icon: FiAlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
          { label: 'High Risk Districts', value: stats.high, icon: FiAlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Avg Preparedness Score', value: `${stats.avgScore}%`, icon: FiCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`glass-card p-4 border ${s.border}`}>
              <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search district or state..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>

        {/* Risk Filter */}
        <div className="flex items-center gap-2">
          <FiFilter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="input-field text-sm">
            {riskLevels.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* Coverage Filter */}
        <select value={coverageFilter} onChange={e => setCoverageFilter(e.target.value)} className="input-field text-sm">
          {coverageOptions.map(c => <option key={c}>{c}</option>)}
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field text-sm">
          <option value="score-asc">Score: Low → High</option>
          <option value="score-desc">Score: High → Low</option>
          <option value="confidence">AI Confidence</option>
        </select>

        <div className="flex items-center text-sm text-gray-400 ml-auto">
          {filtered.length} of {insights.length} insights
        </div>
      </div>

      {/* Insights Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading AI insights..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <FiCpu className="w-12 h-12 mx-auto mb-3 text-gray-700" />
          <p className="text-gray-400 font-medium">No insights match your filters</p>
          <p className="text-sm text-gray-600 mt-1">Try adjusting the search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      {/* AI Model Info Footer */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <FiCpu className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-gray-300 font-medium">DisasterTrain360 AI Engine v2.4</span>
        </div>
        <span>|</span>
        <span>Model: Ensemble Risk Prediction + Coverage Gap Analysis</span>
        <span>|</span>
        <span>Data sources: NDMA, IMD, SDMA, Census 2021</span>
        <span>|</span>
        <span className="text-emerald-400">Last inference: {new Date().toLocaleTimeString('en-IN')}</span>
      </div>
    </div>
  )
}

export default Insights
