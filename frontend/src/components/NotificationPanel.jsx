import React, { useState } from 'react'
import { FiBell, FiAlertTriangle, FiAlertCircle, FiCheckCircle, FiInfo, FiX, FiCheck } from 'react-icons/fi'
import { mockNotifications } from '../data/mockData'

const notifConfig = {
  alert: { icon: FiAlertTriangle, iconColor: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  warning: { icon: FiAlertCircle, iconColor: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  success: { icon: FiCheckCircle, iconColor: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  info: { icon: FiInfo, iconColor: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
}

const NotificationPanel = ({ standalone = false }) => {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unread = notifications.filter(n => !n.read).length

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className={`${standalone ? 'glass-card p-5' : ''}`}>
      {standalone && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <FiBell className="w-5 h-5 text-blue-400" />
              Notifications
              {unread > 0 && (
                <span className="badge-red text-xs">{unread} new</span>
              )}
            </h2>
            <p className="section-subtitle">System alerts and updates</p>
          </div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <FiCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>
      )}

      <div className="space-y-2.5">
        {notifications.map((n) => {
          const cfg = notifConfig[n.type] || notifConfig.info
          const Icon = cfg.icon
          return (
            <div
              key={n.id}
              className={`relative rounded-lg border ${cfg.border} ${cfg.bg} p-3.5 transition-all duration-200
                ${!n.read ? 'opacity-100' : 'opacity-60'} hover:opacity-100`}
            >
              {!n.read && (
                <span className="absolute top-3.5 right-10 w-1.5 h-1.5 bg-blue-400 rounded-full" />
              )}
              <div className="flex items-start gap-2.5">
                <Icon className={`w-4 h-4 ${cfg.iconColor} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${!n.read ? 'text-white' : 'text-gray-300'} leading-snug`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-600">{n.time}</span>
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => dismiss(n.id)}
                  className="p-0.5 hover:bg-white/10 rounded text-gray-600 hover:text-gray-300 transition-colors flex-shrink-0"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}

        {notifications.length === 0 && (
          <div className="text-center py-8">
            <FiBell className="w-10 h-10 mx-auto mb-2 text-gray-700" />
            <p className="text-sm text-gray-500">No notifications</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationPanel
