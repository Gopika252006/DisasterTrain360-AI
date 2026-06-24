import React, { useState } from 'react'
import { FiUploadCloud, FiCheckCircle, FiImage, FiFileText, FiX } from 'react-icons/fi'

const UploadEvidence = () => {
  const [files, setFiles] = useState([])
  const [uploaded, setUploaded] = useState(false)

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).map(f => ({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
      type: f.type.startsWith('image/') ? 'image' : 'document',
    }))
    setFiles(prev => [...prev, ...selected])
  }

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (files.length === 0) return
    setUploaded(true)
    setTimeout(() => { setUploaded(false); setFiles([]) }, 3000)
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

      {uploaded ? (
        <div className="glass-card p-10 text-center animate-slide-up">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Evidence Submitted</h2>
          <p className="text-sm text-gray-400">Your files have been uploaded for review.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6 space-y-5">
            {/* Training selector */}
            <div>
              <label className="label">Select Training Program</label>
              <select className="input-field">
                <option value="">Choose a training to attach evidence to…</option>
                <option>Flood Response & Rescue Operations – Patna</option>
                <option>Cyclone Early Warning Drill – Bhubaneswar</option>
                <option>Community First Responder Training – Thiruvananthapuram</option>
              </select>
            </div>

            {/* Evidence type */}
            <div>
              <label className="label">Evidence Type</label>
              <select className="input-field">
                <option>Attendance Sheet</option>
                <option>Training Photos</option>
                <option>Completion Certificates</option>
                <option>Video Documentation</option>
                <option>Other Supporting Documents</option>
              </select>
            </div>

            {/* Drop zone */}
            <div>
              <label className="label">Upload Files</label>
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
                      ? <FiImage className="w-4 h-4 text-blue-400 flex-shrink-0" />
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
                placeholder="Any remarks about the uploaded evidence…"
                className="input-field resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={files.length === 0}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiUploadCloud className="w-4 h-4" />
              Submit Evidence
            </button>
            <button type="button" onClick={() => setFiles([])} className="btn-secondary">
              Clear Files
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default UploadEvidence
