import React, { useState } from 'react'
import { FiEye, FiEdit2, FiCalendar, FiMapPin, FiUsers, FiChevronUp, FiChevronDown } from 'react-icons/fi'

const statusConfig = {
  Scheduled: { cls: 'badge-blue', dot: 'bg-blue-400' },
  Ongoing: { cls: 'badge-yellow', dot: 'bg-amber-400' },
  Completed: { cls: 'badge-green', dot: 'bg-emerald-400' },
  Cancelled: { cls: 'badge-red', dot: 'bg-red-400' },
}

const TrainingTable = ({ trainings = [], compact = false }) => {
  const [sortField, setSortField] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sorted = [...trainings].sort((a, b) => {
    let aVal = a[sortField]
    let bVal = b[sortField]
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FiChevronUp className="opacity-30 w-3 h-3" />
    return sortDir === 'asc'
      ? <FiChevronUp className="w-3 h-3 text-blue-400" />
      : <FiChevronDown className="w-3 h-3 text-blue-400" />
  }

  const display = compact ? sorted.slice(0, 5) : sorted

  if (display.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No trainings found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            {[
              { label: 'Training Name', field: 'name' },
              { label: 'Theme', field: 'theme' },
              { label: 'Location', field: 'district' },
              { label: 'Date', field: 'date' },
              { label: 'Participants', field: 'participants' },
              { label: 'Status', field: 'status' },
            ].map(({ label, field }) => (
              <th
                key={field}
                className="pb-3 px-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200 transition-colors select-none"
                onClick={() => handleSort(field)}
              >
                <span className="flex items-center gap-1">
                  {label}
                  <SortIcon field={field} />
                </span>
              </th>
            ))}
            {!compact && <th className="pb-3 px-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {display.map((t) => {
            const sc = statusConfig[t.status] || statusConfig.Scheduled
            return (
              <tr key={t.id} className="hover:bg-white/2 transition-colors group">
                <td className="py-3.5 px-3">
                  <p className="font-medium text-gray-100 group-hover:text-white transition-colors line-clamp-1">
                    {t.name}
                  </p>
                </td>
                <td className="py-3.5 px-3">
                  <span className="text-gray-400 text-xs bg-gray-800 px-2 py-0.5 rounded">
                    {t.theme}
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1 text-gray-400">
                    <FiMapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="text-xs">{t.district}, {t.state}</span>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1 text-gray-400">
                    <FiCalendar className="w-3 h-3 flex-shrink-0" />
                    <span className="text-xs">{new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1 text-gray-300">
                    <FiUsers className="w-3 h-3 text-gray-500" />
                    <span className="text-xs font-medium">{t.participants.toLocaleString()}</span>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className={`${sc.cls} flex items-center gap-1.5 w-fit`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse`} />
                    {t.status}
                  </span>
                </td>
                {!compact && (
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all" title="View">
                        <FiEye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all" title="Edit">
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TrainingTable
