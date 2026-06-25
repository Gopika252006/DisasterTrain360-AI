import React, { useState, useEffect } from 'react'
import { FiUploadCloud, FiCheckCircle, FiImage, FiFileText, FiX, FiAlertCircle } from 'react-icons/fi'
import { getTrainings } from '../services/api'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const EVIDENCE_TYPES = [
  'Attendance Sheet',
  'Training Photos',
  'Completion Certificates',
  'Video Documentation',
  'Other Supporting Documents',
]

const UploadEvidence = () => {
  const [trainings, setTrainings]         = useState([])
  const [loadingTrainings, setLoadingTrainings] = useState(true)
  const [files, setFiles]                 = useState([])
  const [trainingId, setTrainingId]       = useState('')
  const [evidenceType, setEvidenceType]   = useState(EVIDENCE_TYPES[0])
  const [notes, setNotes]                 = useState('')
  const [uploading, setUploading]         = useState(false)
  const [uploaded, setUploaded]           = useState(false)
  const [error, setError]                 = useState('')

  // Load real trainings for the selector
  useEffect(() => {
    getTrainings()
      .then(res => {
        const list = (res?.data || []).map(t => ({
          ...t,
          id:   t.trainingId  || t.id,
          name: t.trainingName || t.name,
        }))
        setTrainings(list)
        if (list.length > 0) setTrainingId(list[0].id)
      })
      .catch(() => setTrainings([]))
      .finally(() => setLoadingTrainings(false))
  }, [])

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
      setUploaded(true)
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    setUploaded(false)
    setFiles([])
    setNotes('')
    setError('')
  }

  if (uploaded) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="glass-card p-10 text-center animate-slide-up max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Evidence Submitted</h2>
          <p className="text-sm text-gray-400 mb-6">Your files have been uploaded and are pending review.</p>
          <button onClick={reset} className="btn-primary w-full">
            Upload More Evidence
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container max-w-3xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <FiUploadCloud className="w-6 h-6 text-blue-400" />
          Upload Training Evidence
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Submit attendance sheets, photos, and completion certificates
        </p>
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

          {/* Training selector — real data from DB */}
          <div>
            <label className="label">Select Training Program <span className="text-red-400">*</span></label>
            {loadingTrainings ? (
              <div className="flex items-center gap-2 p-3 text-sm text-gray-400">
                <LoadingSpinner size="sm" /> Loading trainings...
              </div>
            ) : trainings.length === 0 ? (
              <p className="text-sm text-gray-500 p-3 bg-gray-800/40 rounded-lg">
                No training programs found. Create a training first.
              </p>
            ) : (
              <select
                value={trainingId}
                onChange={e => setTrainingId(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Choose a training…</option>
                {trainings.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.district}, {t.state} ({t.date})
                  </option>
                ))}
              </select>
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
                  <button type="button" onClick={() => removeFile(i)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
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
            disabled={uploading || files.length === 0}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
            ) : (
              <><FiUploadCloud className="w-4 h-4" /> Submit Evidence</>
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
