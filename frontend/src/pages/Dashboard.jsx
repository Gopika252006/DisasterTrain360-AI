import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiBookOpen, FiCheckSquare, FiMapPin, FiAlertTriangle,
  FiTrendingUp, FiUsers, FiActivity, FiCpu, FiArrowRight,
  FiRefreshCw, FiBarChart2, FiShield
} from 'react-icons/fi'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

import KPICard from '../components/KPIcard'
import TrainingTable from '../components/TrainingTable'
import NotificationPanel from '../components/NotificationPanel'
import LoadingSpinner from '../components/LoadingSpinner'
import { getDashboard, getTrainings, getInsights } from '../services/api'

// ── Tooltip ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl text-xs">
        <p className="text-gray-400 mb-2 font-medium">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-300">{entry.name}:</span>
            <span className="text-white font-semibold">
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// ── Derive chart data from real backend data ──────────
const buildStatusDistribution = (trainings) => {
  const counts = { Scheduled: 0, Ongoing: 0, Completed: 0, Cancelled: 0 }
  trainings.forEach(t => { if (counts[t.status] !== undefined) counts[t.status]++ })
  return [
    { name: 'Scheduled',  value: counts.Scheduled,  color: '#3b82f6' },
    { name: 'Ongoing',    value: counts.Ongoing,    color: '#f59e0b' },
    { name: 'Completed',  value: counts.Completed,  color: '#10b981' },
    { name: 'Cancelled',  value: counts.Cancelled,  color: '#ef4444' },
  ].filter(d => d.value > 0)
}

const buildStateChart = (trainings) => {
  const map = {}
  trainings.forEach(t => {
    if (!t.state) return
    map[t.state] = (map[t.state] || 0) + 1
  })
  return Object.entries(map)
    .map(([state, count]) => ({ state: state.length > 10 ? state.slice(0, 10) + '…' : state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
}

const buildInsightChart = (insights) => {
  return [
    { name: 'Critical', value: insights.filter(i => i.riskLevel?.toLowerCase() === 'critical').length, color: '#ef4444' },
    { name: 'High',     value: insights.filter(i => i.riskLevel?.toLowerCase() === 'high').length,     color: '#f97316' },
    { name: 'Moderate', value: insights.filter(i => i.riskLevel?.toLowerCase() === 'moderate').length, color: '#f59e0b' },
    { name: 'Low',      value: insights.filter(i => i.riskLevel?.toLowerCase() === 'low').length,      color: '#10b981' },
  ].filter(d => d.value > 0)
}

// ── Dashboard ─────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading]               = useState(true)
  const [kpis, setKpis]                     = useState(null)
  const [recentTrainings, setRecentTrainings] = useState([])
  const [allTrainings, setAllTrainings]     = useState([])
  const [insights, setInsights]             = useState([])
  const [lastRefresh, setLastRefresh]       = useState(new Date())

  const loadData = async () => {
    setLoading(true)
    try {
      const [dashRes, trainRes, insightRes] = await Promise.all([
        getDashboard(),
        getTrainings(),
        getInsights(),
      ])

      if (dashRes?.data) setKpis(dashRes.data)

      const trainings = (trainRes?.data || []).map(t => ({
        ...t,
        id:   t.trainingId  || t.id,
        name: t.trainingName || t.name,
      }))
      setAllTrainings(trainings)
      // show only 5 most recent on dashboard
      setRecentTrainings(trainings.slice(0, 5))

      setInsights(insightRes?.data || [])
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleRefresh = () => {
    setLastRefresh(new Date())
    loadData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading national intelligence data..." />
      </div>
    )
  }

  // ── Derived values ──────────────────────────
  const data            = kpis || {}
  const statusDist      = buildStatusDistribution(allTrainings)
  const stateChart      = buildStateChart(allTrainings)
  const insightChart    = buildInsightChart(insights)
  const totalPax        = allTrainings.reduce((s, t) => s + (t.participants || 0), 0)
  const completedCount  = allTrainings.filter(t => t.status === 'Completed').length
  const completionRate  = allTrainings.length ? Math.round((completedCount / allTrainings.length) * 100) : 0

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">National Intelligence Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Real-time disaster training coverage and preparedness analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            Updated: {lastRefresh.toLocaleTimeString('en-IN')}
          </span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-all"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Trainings"
          value={data.totalTrainings ?? allTrainings.length}
          subtitle="Across all states"
          icon={FiBookOpen}
          color="blue"
        />
        <KPICard
          title="Completed"
          value={data.completedTrainings ?? completedCount}
          subtitle={`${completionRate}% completion rate`}
          icon={FiCheckSquare}
          color="emerald"
        />
        <KPICard
          title="Prepared Districts"
          value={data.preparedDistricts ?? insights.filter(i => (i.preparednessScore || 0) >= 60).length}
          subtitle="Score ≥ 60 threshold"
          icon={FiMapPin}
          color="purple"
        />
        <KPICard
          title="Under-Prepared"
          value={data.underPreparedDistricts ?? insights.filter(i => (i.preparednessScore || 0) < 60).length}
          subtitle="Require urgent action"
          icon={FiAlertTriangle}
          color="red"
        />
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Participants"
          value={data.totalParticipants ?? totalPax}
          subtitle="Expected across all programs"
          icon={FiUsers}
          color="blue"
        />
        <KPICard
          title="Active Programs"
          value={data.activePrograms ?? allTrainings.filter(t => t.status === 'Ongoing').length}
          subtitle="Currently running"
          icon={FiActivity}
          color="emerald"
        />
        <KPICard
          title="Coverage Rate"
          value={`${Math.round(data.coveragePercentage ?? completionRate)}%`}
          subtitle="National average"
          icon={FiTrendingUp}
          color="purple"
        />
        <KPICard
          title="Avg Preparedness"
          value={`${data.averagePreparednessScore ?? (insights.length ? Math.round(insights.reduce((s, i) => s + (i.preparednessScore || 0), 0) / insights.length) : 0)}%`}
          subtitle="District average score"
          icon={FiShield}
          color="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Training Status Distribution */}
        <div className="glass-card p-5">
          <div className="mb-4">
            <h2 className="section-title flex items-center gap-2">
              <FiBarChart2 className="w-4 h-4 text-blue-400" /> Training Status
            </h2>
            <p className="section-subtitle">Breakdown by current status</p>
          </div>
          {statusDist.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-600 text-sm">No training data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {statusDist.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {statusDist.map(item => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-gray-400">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-200">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Trainings by State */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="mb-4">
            <h2 className="section-title">Trainings by State</h2>
            <p className="section-subtitle">Top states by number of training programs</p>
          </div>
          {stateChart.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-600 text-sm">No training data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stateChart} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="state" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Trainings" radius={[0, 4, 4, 0]} fill="#3b82f6">
                  {stateChart.map((_, i) => (
                    <Cell key={i} fill={`hsl(${210 + i * 12}, 70%, ${55 - i * 3}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Insight Risk Chart + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* District Risk Distribution */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="mb-4">
            <h2 className="section-title flex items-center gap-2">
              <FiCpu className="w-4 h-4 text-blue-400" /> District Risk Distribution
            </h2>
            <p className="section-subtitle">AI-assessed risk levels across analyzed districts</p>
          </div>
          {insightChart.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-600 text-sm">No insights data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={insightChart} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Districts" radius={[4, 4, 0, 0]}>
                    {insightChart.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-4 gap-3 mt-4">
                {insightChart.map(item => (
                  <div key={item.name} className="text-center p-3 rounded-xl bg-gray-800/60 border border-gray-700/50">
                    <p className="text-xl font-bold" style={{ color: item.color }}>{item.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="glass-card p-5">
          <NotificationPanel />
        </div>
      </div>

      {/* Recent Trainings — latest 5 only */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="section-title">Recent Trainings</h2>
            <p className="section-subtitle">
              Latest 5 of {allTrainings.length} total programs
            </p>
          </div>
          <button
            onClick={() => navigate('/training/manage')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            View All <FiArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {recentTrainings.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-sm">
            No trainings yet. <button onClick={() => navigate('/training/create')} className="text-blue-400 hover:text-blue-300">Create one →</button>
          </div>
        ) : (
          <TrainingTable
            trainings={recentTrainings}
            onView={() => navigate('/training/manage')}
            onEdit={() => navigate('/training/manage')}
          />
        )}
      </div>

      {/* Summary Stats Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'States with Training', value: new Set(allTrainings.map(t => t.state).filter(Boolean)).size, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
          { label: 'Themes Covered',       value: new Set(allTrainings.map(t => t.theme).filter(Boolean)).size, color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/5' },
          { label: 'Districts Analyzed',   value: insights.length, color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
          { label: 'High Risk Districts',  value: data.highRiskStatesCount ?? insights.filter(i => (i.preparednessScore || 100) < 50).length, color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5' },
        ].map(s => (
          <div key={s.label} className={`glass-card p-4 border ${s.border} ${s.bg} text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
