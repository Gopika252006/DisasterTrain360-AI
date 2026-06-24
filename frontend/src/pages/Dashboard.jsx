import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiBookOpen, FiCheckSquare, FiMapPin, FiAlertTriangle,
  FiTrendingUp, FiUsers, FiActivity, FiCpu, FiArrowRight,
  FiRefreshCw
} from 'react-icons/fi'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

import KPICard from '../components/KPIcard'
import TrainingTable from '../components/TrainingTable'
import NotificationPanel from '../components/NotificationPanel'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  mockDashboardKPIs, mockCoverageTrend, mockPreparednessDistribution,
  mockDistrictPerformance, mockTrainings, mockAIRecommendations, mockRiskSummary
} from '../data/mockData'
import { getDashboard, getTrainings } from '../services/api'

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl text-xs">
        <p className="text-gray-400 mb-2 font-medium">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-300">{entry.name}:</span>
            <span className="text-white font-semibold">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const priorityConfig = {
  Critical: 'badge-red',
  High: 'badge-yellow',
  Medium: 'badge-blue',
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState(null)
  const [recentTrainings, setRecentTrainings] = useState(mockTrainings)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [dashRes, trainRes] = await Promise.all([getDashboard(), getTrainings()])
        setKpis(dashRes?.data || mockDashboardKPIs)
        if (trainRes?.data?.length) {
          setRecentTrainings(trainRes.data.map(t => ({
            ...t,
            id: t.trainingId || t.id,
            name: t.trainingName || t.name,
          })))
        }
      } catch {
        setKpis(mockDashboardKPIs)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleRefresh = () => {
    setLastRefresh(new Date())
    setLoading(true)
    Promise.all([getDashboard(), getTrainings()])
      .then(([dashRes, trainRes]) => {
        setKpis(dashRes?.data || mockDashboardKPIs)
        if (trainRes?.data?.length) {
          setRecentTrainings(trainRes.data.map(t => ({
            ...t,
            id: t.trainingId || t.id,
            name: t.trainingName || t.name,
          })))
        }
      })
      .catch(() => setKpis({ ...mockDashboardKPIs }))
      .finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading national intelligence data..." />
      </div>
    )
  }

  const data = kpis || mockDashboardKPIs

  return (
    <div className="page-container">
      {/* Page Header */}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Trainings"
          value={data.totalTrainings}
          subtitle="Across all states"
          icon={FiBookOpen}
          color="blue"
          trendValue="+12%"
          trend="up"
        />
        <KPICard
          title="Completed Trainings"
          value={data.completedTrainings}
          subtitle={`${Math.round((data.completedTrainings / data.totalTrainings) * 100)}% completion rate`}
          icon={FiCheckSquare}
          color="emerald"
          trendValue="+8%"
          trend="up"
        />
        <KPICard
          title="Prepared Districts"
          value={data.preparedDistricts}
          subtitle="Score ≥ 60 threshold"
          icon={FiMapPin}
          color="purple"
          trendValue="+5%"
          trend="up"
        />
        <KPICard
          title="Under-Prepared"
          value={data.underPreparedDistricts}
          subtitle="Require urgent action"
          icon={FiAlertTriangle}
          color="red"
          trendValue="-3%"
          trend="down"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Participants"
          value={data.totalParticipants}
          subtitle="Trained this year"
          icon={FiUsers}
          color="blue"
          trendValue="+18%"
          trend="up"
        />
        <KPICard
          title="Active Programs"
          value={data.activePrograms}
          subtitle="Currently running"
          icon={FiActivity}
          color="emerald"
        />
        <KPICard
          title="Coverage Rate"
          value={`${Math.round(data.coveragePercentage)}%`}
          subtitle="National average"
          icon={FiTrendingUp}
          color="purple"
          trendValue="+2.3%"
          trend="up"
        />
        <KPICard
          title="Risk Index"
          value={data.riskScore}
          subtitle="Lower is better"
          icon={FiAlertTriangle}
          color="amber"
          trendValue="-5pts"
          trend="down"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Coverage Trend */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Training Coverage Trend</h2>
              <p className="section-subtitle">Monthly trainings vs targets – 2026</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mockCoverageTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="trainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
              <Area type="monotone" dataKey="trainings" name="Actual" stroke="#3b82f6" strokeWidth={2} fill="url(#trainGrad)" dot={{ fill: '#3b82f6', r: 3 }} />
              <Area type="monotone" dataKey="target" name="Target" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" fill="url(#targetGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Preparedness Distribution */}
        <div className="glass-card p-5">
          <div className="mb-5">
            <h2 className="section-title">Preparedness Distribution</h2>
            <p className="section-subtitle">Districts by score category</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={mockPreparednessDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {mockPreparednessDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {mockPreparednessDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* District Performance + AI Recs + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Performance Bar Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">District Performance Ranking</h2>
              <p className="section-subtitle">Top 10 districts by preparedness score</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={mockDistrictPerformance}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="district" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" name="Score" radius={[0, 4, 4, 0]}>
                {mockDistrictPerformance.map((entry, index) => (
                  <Cell key={index} fill={entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#3b82f6' : entry.score >= 40 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Notifications */}
        <div className="glass-card p-5">
          <NotificationPanel />
        </div>
      </div>

      {/* Recent Trainings + AI Recommendations */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Trainings */}
        <div className="xl:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Recent Trainings</h2>
              <p className="section-subtitle">Latest scheduled and ongoing programs</p>
            </div>
            <button
              onClick={() => navigate('/training/create')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              View all <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <TrainingTable trainings={recentTrainings} compact />
        </div>

        {/* AI Recommendations */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <FiCpu className="w-4 h-4 text-blue-400" />
                AI Recommendations
              </h2>
              <p className="section-subtitle">Priority actions by AI engine</p>
            </div>
          </div>
          <div className="space-y-3">
            {mockAIRecommendations.map((rec) => (
              <div key={rec.id} className="bg-gray-800/60 rounded-xl p-3.5 border border-gray-700/50 hover:border-gray-600 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityConfig[rec.priority] || 'badge-blue'}`}>
                    {rec.priority}
                  </span>
                  <span className="text-xs text-gray-500">{rec.timeframe}</span>
                </div>
                <p className="text-xs font-medium text-blue-300 mb-1">{rec.district}</p>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{rec.action}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/insights')}
            className="w-full mt-4 text-sm text-blue-400 hover:text-blue-300 py-2 border border-blue-500/20 hover:border-blue-400/40 rounded-lg transition-all bg-blue-500/5 hover:bg-blue-500/10 flex items-center justify-center gap-2"
          >
            View All Insights <FiArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="section-title">National Risk Summary</h2>
            <p className="section-subtitle">Current threat assessment and preparedness status</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge-yellow text-sm px-3 py-1.5">
              ⚠ Risk Level: {mockRiskSummary.overall}
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Risk Index', value: mockRiskSummary.score, unit: '/100', color: 'text-amber-400' },
            { label: 'Critical Districts', value: mockRiskSummary.criticalDistricts, unit: '', color: 'text-red-400' },
            { label: 'High Risk Districts', value: mockRiskSummary.highRiskDistricts, unit: '', color: 'text-orange-400' },
            { label: 'Monsoon Readiness', value: mockRiskSummary.monsoonReadiness, unit: '%', color: 'text-blue-400' },
          ].map((item) => (
            <div key={item.label} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <p className={`text-2xl font-bold ${item.color}`}>
                {item.value}{item.unit}
              </p>
              <p className="text-xs text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
