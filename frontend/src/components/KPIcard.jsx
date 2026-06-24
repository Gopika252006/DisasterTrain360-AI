import React from 'react'

const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
  className = '',
}) => {
  const colorMap = {
    blue: {
      bg: 'from-blue-600/20 to-blue-700/10',
      border: 'border-blue-500/20',
      icon: 'bg-blue-500/20 text-blue-400',
      trend: 'text-blue-400',
      glow: 'shadow-blue-500/10',
    },
    emerald: {
      bg: 'from-emerald-600/20 to-emerald-700/10',
      border: 'border-emerald-500/20',
      icon: 'bg-emerald-500/20 text-emerald-400',
      trend: 'text-emerald-400',
      glow: 'shadow-emerald-500/10',
    },
    amber: {
      bg: 'from-amber-600/20 to-amber-700/10',
      border: 'border-amber-500/20',
      icon: 'bg-amber-500/20 text-amber-400',
      trend: 'text-amber-400',
      glow: 'shadow-amber-500/10',
    },
    red: {
      bg: 'from-red-600/20 to-red-700/10',
      border: 'border-red-500/20',
      icon: 'bg-red-500/20 text-red-400',
      trend: 'text-red-400',
      glow: 'shadow-red-500/10',
    },
    purple: {
      bg: 'from-purple-600/20 to-purple-700/10',
      border: 'border-purple-500/20',
      icon: 'bg-purple-500/20 text-purple-400',
      trend: 'text-purple-400',
      glow: 'shadow-purple-500/10',
    },
  }

  const c = colorMap[color] || colorMap.blue

  const isPositive = trend === 'up'
  const isNegative = trend === 'down'

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border ${c.border}
        bg-gradient-to-br ${c.bg} backdrop-blur-sm
        shadow-lg ${c.glow} hover:shadow-xl transition-all duration-300
        hover:-translate-y-0.5 group ${className}
      `}
    >
      {/* Background decorative circle */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/3 group-hover:bg-white/5 transition-colors duration-300" />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg ${c.icon} flex items-center justify-center flex-shrink-0`}>
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          {trendValue !== undefined && (
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              isPositive ? 'bg-emerald-500/15 text-emerald-400' :
              isNegative ? 'bg-red-500/15 text-red-400' :
              'bg-gray-700/50 text-gray-400'
            }`}>
              {isPositive ? '↑' : isNegative ? '↓' : '→'} {trendValue}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-2xl font-bold text-white tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          <p className="text-sm font-medium text-gray-300">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default KPICard
