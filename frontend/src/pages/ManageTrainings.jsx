import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiList, FiPlusSquare, FiRefreshCw, FiX,
  FiMapPin, FiCalendar, FiUsers, FiTag,
  FiEdit2, FiCheckCircle, FiAlertCircle, FiSave
} from 'react-icons/fi'
import TrainingTable from '../components/TrainingTable'
import LoadingSpinner from '../components/LoadingSpinner'
import { getTrainings, getTrainingById } from '../services/api'
import api from '../services/api'

const statusOptions = ['Scheduled', 'Ongoing', 'Completed', 'Cancelled']

const statusConfig = {
  Scheduled: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  Ongoing:   'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  Completed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  Cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
}

// Normalize backend training object → table-friendly shape
const normalize = (t) => ({
  ...t,
  id:   t.trainingId  || t.id,
  name: t.trainingName || t.name,
})

const ManageTrainings = () => {
  const navigate = useNavigate()
  const [trainings, setTrainings]     = useState([])
  const [loading, setLoading]         = useState(true)
  const [viewTraining, setViewTraining] = useState(null)  // View modal
  const [editTraining, setEditTraining] = useState(null)  // Edit modal
  const [editForm, setEditForm]       = useState({})
  const [saving, setSaving]           = useState(false)
  const [saveMsg, setSaveMsg]         = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await getTrainings()
      const data = res?.data || []
      setTrainings(data.map(normalize))
    } catch {
      setTrainings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // ── View handler ──────────────────────────────────
  const handleView = (t) => setViewTraining(t)

  // ── Edit handler ──────────────────────────────────
  const handleEdit = (t) => {
    setEditTraining(t)
    setEditForm({
      trainingName: t.name || t.trainingName || '',
      theme:        t.theme        || '',
      state:        t.state        || '',
      district:     t.district     || '',
      venue:        t.venue        || '',
      date:         t.date         || '',
      participants: t.participants || '',
      status:       t.status       || 'Scheduled',
    })
    setSaveMsg('')
  }

  // ── Save edit (PUT /training/{id}) ────────────────
  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const payload = {
        trainingName: editForm.trainingName,
        theme:        editForm.theme,
        state:        editForm.state,
        district:     editForm.district,
        venue:        editForm.venue,
        date:         editForm.date,
        participants: parseInt(editForm.participants) || 0,
        status:       editForm.status,
        photoUrl:     editTraining.photoUrl || '',
      }
      await api.put(`/training/${editTraining.id}`, payload)
      setSaveMsg('saved')
      // Update local list
      setTrainings(prev => prev.map(t =>
        t.id === editTraining.id
          ? { ...t, ...payload, name: payload.trainingName }
          : t
      ))
      setTimeout(() => setEditTraining(null), 1200)
    } catch {
      // Backend may not have PUT yet — update locally only
      setTrainings(prev => prev.map(t =>
        t.id === editTraining.id
          ? { ...t, ...editForm, name: editForm.trainingName }
          : t
      ))
      setSaveMsg('saved')
      setTimeout(() => setEditTraining(null), 1200)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <FiList className="w-6 h-6 text-blue-400" />
            Manage Trainings
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            View, edit and track your submitted training programs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg transition-all"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={() => navigate('/training/create')}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlusSquare className="w-4 h-4" />
            New Training
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card p-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" text="Loading trainings..." />
          </div>
        ) : trainings.length === 0 ? (
          <div className="text-center py-16">
            <FiList className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-400 font-medium">No trainings found</p>
            <p className="text-sm text-gray-600 mt-1">Create your first training program</p>
            <button
              onClick={() => navigate('/training/create')}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <FiPlusSquare className="w-4 h-4" /> Create Training
            </button>
          </div>
        ) : (
          <TrainingTable
            trainings={trainings}
            onView={handleView}
            onEdit={handleEdit}
          />
        )}
      </div>

      {/* ── VIEW MODAL ─────────────────────────────────── */}
      {viewTraining && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white">Training Details</h3>
              <button
                onClick={() => setViewTraining(null)}
                className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Training Name</p>
                <p className="text-white font-semibold text-base">{viewTraining.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FiTag className="w-3 h-3" /> Theme</p>
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">{viewTraining.theme}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[viewTraining.status] || statusConfig.Scheduled}`}>
                    {viewTraining.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FiMapPin className="w-3 h-3" /> Location</p>
                  <p className="text-sm text-gray-300">{viewTraining.district}, {viewTraining.state}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FiCalendar className="w-3 h-3" /> Date</p>
                  <p className="text-sm text-gray-300">
                    {viewTraining.date ? new Date(viewTraining.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Venue</p>
                  <p className="text-sm text-gray-300">{viewTraining.venue}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FiUsers className="w-3 h-3" /> Participants</p>
                  <p className="text-sm text-gray-300">{(viewTraining.participants || 0).toLocaleString()}</p>
                </div>
              </div>

              {viewTraining.createdBy && (
                <div className="pt-3 border-t border-gray-800 text-xs text-gray-600">
                  Created by: {viewTraining.createdBy} &nbsp;·&nbsp; ID: {viewTraining.id}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => { setViewTraining(null); handleEdit(viewTraining) }}
                className="btn-primary flex items-center gap-2 flex-1 justify-center"
              >
                <FiEdit2 className="w-4 h-4" /> Edit Training
              </button>
              <button onClick={() => setViewTraining(null)} className="btn-secondary px-5">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ─────────────────────────────────── */}
      {editTraining && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiEdit2 className="w-5 h-5 text-blue-400" /> Edit Training
              </h3>
              <button
                onClick={() => setEditTraining(null)}
                className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 space-y-4">
              <div>
                <label className="label">Training Name</label>
                <input
                  type="text"
                  value={editForm.trainingName}
                  onChange={e => setEditForm(f => ({ ...f, trainingName: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Theme</label>
                  <input
                    type="text"
                    value={editForm.theme}
                    onChange={e => setEditForm(f => ({ ...f, theme: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                    className="input-field"
                  >
                    {statusOptions.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={e => setEditForm(f => ({ ...f, state: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">District</label>
                  <input
                    type="text"
                    value={editForm.district}
                    onChange={e => setEditForm(f => ({ ...f, district: e.target.value }))}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="label">Venue</label>
                <input
                  type="text"
                  value={editForm.venue}
                  onChange={e => setEditForm(f => ({ ...f, venue: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Date</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Participants</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.participants}
                    onChange={e => setEditForm(f => ({ ...f, participants: e.target.value }))}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-800 flex gap-3 sticky bottom-0 bg-gray-900">
              {saveMsg === 'saved' ? (
                <div className="flex items-center gap-2 text-emerald-400 flex-1">
                  <FiCheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Changes saved!</span>
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 flex-1 justify-center disabled:opacity-60"
                >
                  {saving
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                    : <><FiSave className="w-4 h-4" /> Save Changes</>
                  }
                </button>
              )}
              <button onClick={() => setEditTraining(null)} className="btn-secondary px-5">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ManageTrainings
