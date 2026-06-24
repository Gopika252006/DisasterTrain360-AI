import React from 'react'
import { FiAward, FiDownload, FiCalendar, FiCheckCircle } from 'react-icons/fi'

const mockCerts = [
  {
    id: 'cert001',
    trainingName: 'Community First Responder Training',
    issueDate: '2026-05-30',
    district: 'Thiruvananthapuram, Kerala',
    credentialId: 'NDMA-CFR-2026-001482',
    theme: 'Community Resilience',
  },
]

const Certificates = () => (
  <div className="page-container">
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
        <FiAward className="w-6 h-6 text-blue-400" />
        My Certificates
      </h1>
      <p className="text-sm text-gray-400 mt-0.5">
        Download NDMA-issued training completion certificates
      </p>
    </div>

    {mockCerts.length === 0 ? (
      <div className="glass-card p-12 text-center">
        <FiAward className="w-12 h-12 mx-auto mb-3 text-gray-700" />
        <p className="text-gray-400">No certificates yet. Complete a training to earn one.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockCerts.map(c => (
          <div key={c.id} className="glass-card p-5 border-emerald-500/20 bg-gradient-to-br from-emerald-900/10 to-transparent">
            {/* Certificate header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiAward className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wide mb-0.5">
                  Certificate of Completion
                </p>
                <h3 className="font-bold text-white text-sm leading-snug">{c.trainingName}</h3>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Theme: <span className="text-gray-300">{c.theme}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="w-3.5 h-3.5 text-gray-600" />
                <span>Issued: {new Date(c.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="bg-gray-800/60 rounded-lg px-3 py-2 mb-4">
              <p className="text-xs text-gray-500">Credential ID</p>
              <p className="text-xs font-mono text-gray-300 mt-0.5">{c.credentialId}</p>
            </div>

            <button className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm">
              <FiDownload className="w-4 h-4" />
              Download Certificate
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
)

export default Certificates
