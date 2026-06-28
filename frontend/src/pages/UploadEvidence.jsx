import React, { useState, useEffect } from 'react'
import {
  FiUploadCloud, FiCheckCircle, FiImage, FiFileText,
  FiX, FiAlertCircle, FiClock, FiInfo
} from 'react-icons/fi'
import { getMyTrainings } from '../services/api'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const EVIDENCE_TYPES = [
  'Attendance Sheet',
  'Training Photos',
  'Completion Certificates',
  'Video Documentation',
  'Other Supporting Documents',
]

// Status badge for training status
const statusColors = {
  SCHEDULED:        'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  ONGOING:          'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  PENDING_APPROVAL: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  COMPLETED:        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  CANCELLED:        'bg-red-500/20 text-red-400 border border-red-500/30',
}

const UploadEvidence = () => {
  const [trainings, setTrainings]               = useState([])
  const [loadingTrainings, setLoadingTrainings] = useState(true)
  const [files, setFiles]                       = useState([])
  const [trainingId, setTrainingId]             = useState('')
  const [evidenceType, setEvidenceType]         = useState(EVIDENCE_TYPES[0])
  const [notes, setNotes]                       = useState('')
  const [uploading, setUploading]               = useState(false)
  const [uploaded, setUploaded]                 = useState(false)
  const [uploadedTraining, setUploadedTraining] = useState(null)
  const [error, setError]                       = useState('')

  // Load only the trainings created by this trainer
  useEffect(() => {
    getMyTrainings()
      .then(res => {
        const list = (res?.data || []).map(t => ({
          ...t,
          id:   t.trainingId  || t.id,
          name: t.trainingName || t.name,
        }))
        setTrainings(list)
        // Pre-select first non-completed training
        const eligible = list.find(t => t.status !== 'COMPLETED')
        if (eligible) setTrainingId(eligible.id)
        else if (list.length > 0) setTrainingId(list[0].id)
      })
      .catch(() => setTrainings([]))
      .finally(() => setLoadingTrainings(false))
  }, [])

  const selectedTraining = trainings.find(t => t.id === trainingId)

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).map(f => ({
      file: f,
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
      type: f.type.startsWith('image/') ? 'image' : 'document',
    }))
    setFiles(prev => [...prev, ...selected])
    setError('')
  }

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (files.length === 0) { setError('Please select at least one file.'); return }
    if (!trainingId)        { setError('Please select a training program.'); return }
    if (selectedTraining?.status === 'COMPLETED') {
      setError('This training is already completed.')
      return
    }

    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('trainingId',   trainingId)
      formData.append('evidenceType', evidenceType)
      formData.append('notes',        notes)
      files.forEach(f => formData.append('files', f.file))

      await api.post('/evidence', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setUploadedTraining(selectedTraining)
      setUploaded(true)
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    setUploaded(false)
    setUploadedTraining(null)
    setFiles([])
    setNotes('')
    setError('')
    // Refresh trainings to show updated status
    setLoadingTrainings(true)
    getMyTrainings()
      .then(res => {
        const list = (res?.data || []).map(t => ({
          ...t,
          id:   t.trainingId || t.id,
          name: t.trainingName || t.name,
        }))
        setTrainings(list)
        const eligible = list.find(t => t.status !== 'COMPLETED' && t.status !== 'PENDING_APPROVAL')
        if (eligible) setTrainingId(eligible.id)
        else if (list.length > 0) setTrainingId(list[0].id)
      })
      .catch(() => {})
      .finally(() => setLoadingTrainings(false))
  }

  // ── Success screen ──────────────────────────────────────────────────────
  if (uploaded) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="glass-card p-10 text-center animate-slide-up max-w-md w-full space-y-4">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
            <FiCheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Evidence Submitted!</h2>
            <p className="text-sm text-gray-400">
              Your files for <span className="text-white font-medium">{uploadedTraining?.name}</span> have been uploaded.
            </p>
          </div>

          {/* What happens next */}
          <div className="text-left bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 space-y-2.5">
            <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5" /> What happens next
            </p>
            <div className="space-y-1.5 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>Training status is now <span className="text-orange-400 font-medium">Pending Approval</span></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>The NDMA Admin will review your submitted evidence</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>Once approved, training will be marked <span className="text-emerald-400 font-medium">Completed</span></span>
              </div>
            </div>
          </div>

          <button onClick={reset} className="btn-primary w-full">
            Upload Evidence for Another Training
          </button>
        </div>
      </div>
    )
  }

  // ── Main form ───────────────────────────────────────────────────────────
  return (
    <div className="page-container max-w-3xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <FiUploadCloud className="w-6 h-6 text-blue-400" />
          Upload Training Evidence
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Submit attendance sheets, photos, and completion certificates for admin approval
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2.5 p-3.5 bg-blue-900/20 border border-blue-500/20 rounded-xl text-sm text-blue-300">
        <FiInfo className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          After uploading, your training will be set to <strong>Pending Approval</strong>.
          The NDMA Admin will review and mark it as <strong>Completed</strong>.
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 p-3.5 bg-red-900/20 border border-red-500/30 rounded-xl text-sm text-red-400">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 space-y-5">

          {/* Training selector — only my trainings */}
          <div>
            <label className="label">
              Select Your Training Program <span className="text-red-400">*</span>
            </label>
            {loadingTrainings ? (
              <div className="flex items-center gap-2 p-3 text-sm text-gray-400">
                <LoadingSpinner size="sm" /> Loading your trainings...
              </div>
            ) : trainings.length === 0 ? (
              <p className="text-sm text-gray-500 p-3 bg-gray-800/40 rounded-lg">
                No training programs found. Create a training first.
              </p>
            ) : (
              <>
                <select
                  value={trainingId}
                  onChange={e => setTrainingId(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Choose a training…</option>
                  {trainings.map(t => (
                    <option key={t.id} value={t.id} disabled={t.status === 'COMPLETED'}>
                      {t.name} — {t.district}, {t.state} ({t.date})
                      {t.status === 'COMPLETED' ? ' ✓ Done' : ''}
                      {t.status === 'PENDING_APPROVAL' ? ' ⏳ Awaiting Approval' : ''}
                    </option>
                  ))}
                </select>

                {/* Status chip for selected training */}
                {selectedTraining && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Status:</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[selectedTraining.status] || statusColors.SCHEDULED}`}>
                      {selectedTraining.status?.replace('_', ' ')}
                    </span>
                    {selectedTraining.status === 'PENDING_APPROVAL' && (
                      <span className="text-xs text-orange-400">
                        Evidence already submitted — awaiting admin approval
                      </span>
                    )}
                    {selectedTraining.status === 'COMPLETED' && (
                      <span className="text-xs text-emerald-400">
                        This training is already completed
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Evidence type */}
          <div>
            <label className="label">Evidence Type</label>
            <select
              value={evidenceType}
              onChange={e => setEvidenceType(e.target.value)}
              className="input-field"
            >
              {EVIDENCE_TYPES.map(et => <option key={et}>{et}</option>)}
            </select>
          </div>

          {/* Drop zone */}
          <div>
            <label className="label">Upload Files <span className="text-red-400">*</span></label>
            <label
              htmlFor="evidence-files"
              className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group"
            >
              <FiUploadCloud className="w-10 h-10 text-gray-600 group-hover:text-blue-400 transition-colors" />
              <div className="text-center">
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">
                  Click to browse or drag files here
                </p>
                <p className="text-xs text-gray-600 mt-1">PDF, JPG, PNG, MP4 — max 20 MB each</p>
              </div>
              <input
                id="evidence-files"
                type="file"
                multiple
                accept="image/*,.pdf,.mp4"
                onChange={handleFiles}
                className="sr-only"
              />
            </label>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {files.length} file{files.length !== 1 ? 's' : ''} selected
              </p>
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-gray-800/60 rounded-lg border border-gray-700/50">
                  {f.type === 'image'
                    ? <FiImage    className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    : <FiFileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  }
                  <span className="text-sm text-gray-300 flex-1 truncate">{f.name}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">{f.size}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="label">Additional Notes (optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any remarks about the uploaded evidence…"
              className="input-field resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={
              uploading ||
              files.length === 0 ||
              selectedTraining?.status === 'COMPLETED'
            }
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FiUploadCloud className="w-4 h-4" />
                Submit Evidence for Approval
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => { setFiles([]); setNotes(''); setError('') }}
            className="btn-secondary"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

export default UploadEvidence
