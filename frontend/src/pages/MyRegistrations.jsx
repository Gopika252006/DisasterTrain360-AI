import React from 'react'
import { FiBookmark, FiCalendar, FiMapPin, FiCheckCircle, FiClock } from 'react-icons/fi'
import { mockTrainings } from '../data/mockData'

// Simulate 2 registrations for the public user
const myRegistrations = mockTrainings.slice(0, 2).map(t => ({
  ...t,
  registeredOn: '2026-06-20',
  confirmationId: `DT360-${t.id.toUpperCase()}`,
}))

const MyRegistrations = () => (
  <div className="page-container">
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
        <FiBookmark className="w-6 h-6 text-blue-400" />
        My Registrations
      </h1>
      <p className="text-sm text-gray-400 mt-0.5">
        Training programs you have enrolled in
      </p>
    </div>

    {myRegistrations.length === 0 ? (
      <div className="glass-card p-12 text-center">
        <FiBookmark className="w-12 h-12 mx-auto mb-3 text-gray-700" />
        <p className="text-gray-400">No registrations yet. Browse Training Discovery to sign up.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {myRegistrations.map(r => (
          <div key={r.id} className="glass-card p-5 hover:border-blue-500/30 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-semibold text-white text-sm leading-snug">{r.name}</h3>
              <span className="badge-green flex items-center gap-1.5 flex-shrink-0">
                <FiCheckCircle className="w-3 h-3" /> Confirmed
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <FiMapPin className="w-3.5 h-3.5 text-gray-600" />
                <span>{r.district}, {r.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="w-3.5 h-3.5 text-gray-600" />
                <span>Training date: {new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="w-3.5 h-3.5 text-gray-600" />
                <span>Registered on: {new Date(r.registeredOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-500">ID: <span className="text-gray-300 font-mono">{r.confirmationId}</span></span>
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View Details →</button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)

export default MyRegistrations
