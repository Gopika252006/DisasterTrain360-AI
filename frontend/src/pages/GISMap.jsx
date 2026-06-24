import React, { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap } from 'react-leaflet'
import {
  FiMap, FiRefreshCw, FiAlertTriangle, FiActivity,
  FiLayers, FiSearch, FiX, FiChevronRight,
  FiInfo, FiTrendingUp, FiBarChart2, FiShield
} from 'react-icons/fi'
import {
  INDIA_STATES, STATE_DISTRICTS,
  getColor, getRiskLevel, getCoverageStatus, getRiskBadge,
  getNationalSummary
} from '../data/gisData'
import LoadingSpinner from '../components/LoadingSpinner'
import { getInsights, MOCK_MODE } from '../services/api'

// ── Fly-to map helper ─────────────────────────────────
const FlyToState = ({ coords }) => {
  const map = useMap()
  useEffect(() => {
    if (coords) map.flyTo(coords, 6, { duration: 1.2 })
  }, [coords, map])
  return null
}

// ── Score bar ─────────────────────────────────────────
const ScoreBar = ({ score, height = 'h-1.5' }) => (
  <div className={`w-full ${height} bg-gray-700/60 rounded-full overflow-hidden`}>
    <div
      className="h-full rounded-full transition-all duration-700"
      style={{ width: `${score}%`, background: getColor(score) }}
    />
  </div>
)

// ── KPI stat card ─────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, color }) => {
  const colorMap = {
    blue:    { bg:'from-blue-600/20 to-blue-700/10',       border:'border-blue-500/20',    icon:'bg-blue-500/20 text-blue-400' },
    emerald: { bg:'from-emerald-600/20 to-emerald-700/10', border:'border-emerald-500/20', icon:'bg-emerald-500/20 text-emerald-400' },
    amber:   { bg:'from-amber-600/20 to-amber-700/10',     border:'border-amber-500/20',   icon:'bg-amber-500/20 text-amber-400' },
    red:     { bg:'from-red-600/20 to-red-700/10',         border:'border-red-500/20',     icon:'bg-red-500/20 text-red-400' },
  }
  const c = colorMap[color] || colorMap.blue
  return (
    <div className={`rounded-xl border ${c.border} bg-gradient-to-br ${c.bg} p-4 hover:-translate-y-0.5 transition-transform`}>
      <div className={`w-9 h-9 rounded-lg ${c.icon} flex items-center justify-center mb-3`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm font-medium text-gray-300 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  )
}

// ── Main GISMap component ─────────────────────────────
const GISMap = () => {
  const [states, setStates]               = useState(INDIA_STATES)
  const [loading, setLoading]             = useState(true)
  const [mapReady, setMapReady]           = useState(false)
  const [selectedState, setSelectedState] = useState(null)
  const [flyTo, setFlyTo]                 = useState(null)
  const [search, setSearch]               = useState('')
  const [scoreFilter, setScoreFilter]     = useState('All')
  const [lastSync, setLastSync]           = useState(new Date())

  const summary = getNationalSummary(states)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        if (!MOCK_MODE) {
          // Backend returns district-level insights (no lat/lng).
          // GIS map always uses INDIA_STATES for coordinates.
          // Optionally enrich state scores by averaging district scores per state.
          const res = await getInsights()
          if (res?.data?.length) {
            const insights = res.data
            const updated = INDIA_STATES.map(st => {
              const stateInsights = insights.filter(i =>
                (i.state || '').toLowerCase() === st.name.toLowerCase()
              )
              if (stateInsights.length === 0) return st
              const avgScore = Math.round(
                stateInsights.reduce((sum, i) => sum + (i.preparednessScore || st.score), 0) / stateInsights.length
              )
              return { ...st, score: avgScore }
            })
            setStates(updated)
          }
        }
      } catch { /* use demo data */ }
      setTimeout(() => { setMapReady(true); setLoading(false) }, 400)
    }
    load()
  }, [])

  const handleRefresh = () => {
    setLastSync(new Date())
    setSelectedState(null)
  }

  const handleStateClick = useCallback((st) => {
    setSelectedState(st)
    setFlyTo([st.lat, st.lng])
  }, [])

  const filteredStates = states.filter(s => {
    if (!s || !s.name) return false
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    switch (scoreFilter) {
      case 'Well Prepared (>80)':  return matchSearch && s.score > 80
      case 'Moderate (50-80)':     return matchSearch && s.score >= 50 && s.score <= 80
      case 'Under-Prepared (<50)': return matchSearch && s.score < 50
      default: return matchSearch
    }
  })

  const districts = selectedState ? (STATE_DISTRICTS[selectedState.id] || []) : []

  return (
    <div className="page-container">

      {/* ── Header ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <FiMap className="w-6 h-6 text-blue-400" />
            National Preparedness Command Center
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            State-wise disaster preparedness monitoring across all 31 states &amp; UTs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Synced {lastSync.toLocaleTimeString('en-IN')}
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg transition-all"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            Sync Data
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="States Monitored"     value={summary.totalStates}         sub="All states & UTs"          icon={FiLayers}        color="blue" />
        <StatCard label="Districts Monitored"  value={`${summary.totalDistricts}+`} sub="District-level tracking"  icon={FiMap}           color="emerald" />
        <StatCard label="Avg National Score"   value={`${summary.avgScore}%`}      sub="Preparedness index"        icon={FiBarChart2}     color="amber" />
        <StatCard label="High Risk States"     value={summary.highRiskStates}      sub="Score < 50 — urgent"       icon={FiAlertTriangle} color="red" />
      </div>

      {/* ── Legend ──────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { color:'#10b981', label:'Well Prepared',  count: states.filter(s => s.score > 80).length,                      desc:'Score > 80',  bg:'from-emerald-900/20 to-transparent', border:'border-emerald-500/20' },
          { color:'#f59e0b', label:'Moderate Risk',  count: states.filter(s => s.score >= 50 && s.score <= 80).length,    desc:'Score 50–80', bg:'from-amber-900/20 to-transparent',   border:'border-amber-500/20' },
          { color:'#ef4444', label:'Under-Prepared', count: states.filter(s => s.score < 50).length,                      desc:'Score < 50',  bg:'from-red-900/20 to-transparent',     border:'border-red-500/20' },
        ].map(item => (
          <div key={item.label} className={`rounded-xl border ${item.border} bg-gradient-to-br ${item.bg} p-3 sm:p-4 flex items-center gap-3`}>
            <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{ borderColor: item.color, background: item.color + '22' }}>
              <span className="text-base font-bold" style={{ color: item.color }}>{item.count}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ─────────────────────────────────── */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search state..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <select
          value={scoreFilter}
          onChange={e => setScoreFilter(e.target.value)}
          className="input-field text-sm sm:w-56"
        >
          {['All', 'Well Prepared (>80)', 'Moderate (50-80)', 'Under-Prepared (<50)'].map(o => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <span className="text-sm text-gray-400 flex items-center gap-2 flex-shrink-0">
          <FiLayers className="w-3.5 h-3.5" />
          {filteredStates.length} states
        </span>
      </div>

      {/* ── Map + State List ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Map */}
        <div className="lg:col-span-2 glass-card overflow-hidden" style={{ minHeight: 520 }}>
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <LoadingSpinner text="Loading national map..." />
            </div>
          ) : (
            <MapContainer
              center={[22.5, 80.0]}
              zoom={5}
              style={{ height: '520px', width: '100%' }}
              zoomControl={false}
              className="rounded-xl"
            >
              <ZoomControl position="bottomright" />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              {flyTo && <FlyToState coords={flyTo} />}

              {filteredStates.map(st => {
                const isSelected = selectedState?.id === st.id
                const color = getColor(st.score)
                const radius = st.score > 80 ? 18 : st.score >= 50 ? 22 : 26
                return (
                  <CircleMarker
                    key={st.id}
                    center={[st.lat, st.lng]}
                    radius={isSelected ? radius + 5 : radius}
                    pathOptions={{
                      color:       isSelected ? '#ffffff' : color,
                      fillColor:   color,
                      fillOpacity: isSelected ? 0.95 : 0.72,
                      weight:      isSelected ? 3 : 1.5,
                    }}
                    eventHandlers={{ click: () => handleStateClick(st) }}
                  >
                    <Popup>
                      <div style={{ background:'#111827', color:'#fff', borderRadius:10, padding:'12px 14px', minWidth:210 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                          <div>
                            <p style={{ fontWeight:700, fontSize:14, margin:0 }}>{st.name}</p>
                            <p style={{ color:'#9ca3af', fontSize:11, margin:'2px 0 0' }}>{st.capital}</p>
                          </div>
                          <span style={{ fontSize:22, fontWeight:800, color }}>{st.score}</span>
                        </div>
                        <div style={{ background:'#374151', borderRadius:4, height:6, marginBottom:8, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${st.score}%`, background:color, borderRadius:4 }} />
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:8 }}>
                          {[
                            { l:'Risk Level',   v: getRiskLevel(st.score) },
                            { l:'Trainings',    v: st.trainings },
                            { l:'Districts',    v: st.districts },
                            { l:'Primary Risk', v: st.primaryRisk.split(',')[0] },
                          ].map(item => (
                            <div key={item.l} style={{ background:'#1f2937', borderRadius:6, padding:'4px 8px' }}>
                              <p style={{ color:'#6b7280', fontSize:10, margin:0 }}>{item.l}</p>
                              <p style={{ color:'#f9fafb', fontSize:11, fontWeight:600, margin:'2px 0 0' }}>{item.v}</p>
                            </div>
                          ))}
                        </div>
                        <p style={{ color:'#60a5fa', fontSize:11, textAlign:'center' }}>Click marker to expand details ↓</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                )
              })}
            </MapContainer>
          )}
        </div>

        {/* State list panel */}
        <div className="glass-card p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <FiInfo className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">State Preparedness</h3>
            <span className="ml-auto text-xs text-gray-500">{filteredStates.length} states</span>
          </div>
          <div className="overflow-y-auto flex-1 space-y-2" style={{ maxHeight: 462 }}>
            {filteredStates
              .slice()
              .sort((a, b) => b.score - a.score)
              .map(st => {
                const isSelected = selectedState?.id === st.id
                const color = getColor(st.score)
                const risk  = getRiskLevel(st.score)
                return (
                  <div
                    key={st.id}
                    onClick={() => handleStateClick(st)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all duration-200
                      ${isSelected
                        ? 'border-blue-500/50 bg-blue-900/20 shadow-lg shadow-blue-500/10'
                        : 'border-gray-700/50 bg-gray-800/40 hover:border-gray-600 hover:bg-gray-800/70'}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                        <p className="text-sm font-medium text-white truncate">{st.name}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        <span className="text-sm font-bold" style={{ color }}>{st.score}</span>
                        {isSelected && <FiChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                    </div>
                    <ScoreBar score={st.score} />
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs text-gray-500">{st.trainings} trainings</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${getRiskBadge(risk)}`}>
                        {risk}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* ── State Detail Panel ───────────────────────── */}
      {selectedState && (
        <div className="glass-card border-blue-500/20 animate-slide-up overflow-hidden">

          {/* State header */}
          <div className="flex items-start justify-between p-5 border-b border-gray-800">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold text-white"
                style={{ background: getColor(selectedState.score) + '28', border: `2px solid ${getColor(selectedState.score)}50` }}
              >
                {selectedState.score}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{selectedState.name}</h2>
                <p className="text-sm text-gray-400">Capital: {selectedState.capital}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getRiskBadge(getRiskLevel(selectedState.score))}`}>
                    {getRiskLevel(selectedState.score)} Risk
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400">{getCoverageStatus(selectedState.score)}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400">{selectedState.primaryRisk}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedState(null)}
              className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-500 hover:text-white transition-colors flex-shrink-0"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          {/* State KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 border-b border-gray-800">
            {[
              { label:'Preparedness Score',  value:`${selectedState.score}%`,                  color: getColor(selectedState.score), icon: FiShield },
              { label:'Trainings Conducted', value: selectedState.trainings,                   color:'#60a5fa', icon: FiActivity },
              { label:'Districts Covered',   value: selectedState.districts,                   color:'#a78bfa', icon: FiMap },
              { label:'Coverage Status',     value: getCoverageStatus(selectedState.score),    color:'#34d399', icon: FiTrendingUp },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.label} className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    <p className="text-xs text-gray-500">{item.label}</p>
                  </div>
                  <p className="text-sm font-bold leading-snug" style={{ color: item.color }}>{item.value}</p>
                </div>
              )
            })}
          </div>

          {/* Overall score bar */}
          <div className="px-5 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-medium">Overall Preparedness Index</span>
              <span className="text-sm font-bold" style={{ color: getColor(selectedState.score) }}>
                {selectedState.score} / 100
              </span>
            </div>
            <ScoreBar score={selectedState.score} height="h-3" />
          </div>

          {/* District breakdown */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiTrendingUp className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">District Breakdown</h3>
              <span className="ml-auto text-xs text-gray-500">{districts.length} districts</span>
            </div>
            {districts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No district data available</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {districts
                  .slice()
                  .sort((a, b) => b.score - a.score)
                  .map(d => {
                    const risk = getRiskLevel(d.score)
                    return (
                      <div key={d.id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 hover:border-gray-600 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-semibold text-white truncate">{d.name}</p>
                          <span className="text-sm font-bold flex-shrink-0 ml-2" style={{ color: getColor(d.score) }}>
                            {d.score}
                          </span>
                        </div>
                        <ScoreBar score={d.score} />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{d.trainings} trainings</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${getRiskBadge(risk)}`}>
                            {risk}
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Footer ──────────────────────────────────── */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <FiMap className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-gray-300 font-medium">NDMA National GIS Monitoring Platform</span>
        </div>
        <span>|</span>
        <span>Showing {filteredStates.length} of {states.length} states &amp; UTs</span>
        <span>|</span>
        <span className={MOCK_MODE ? 'text-amber-400' : 'text-emerald-400'}>
          {MOCK_MODE ? '⚠ Demo Data Mode' : '✓ Live API Connected'}
        </span>
        <span>|</span>
        <span>Click any state on map or list to view district breakdown</span>
      </div>

    </div>
  )
}

export default GISMap
