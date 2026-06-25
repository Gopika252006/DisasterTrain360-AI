import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiSave, FiRefreshCw, FiCalendar, FiMapPin, FiUsers,
  FiTag, FiImage, FiCheckCircle, FiAlertCircle,
  FiBookOpen, FiArrowLeft, FiInfo
} from 'react-icons/fi'
import { createTraining } from '../services/api'
import { statesAndDistricts, trainingThemes } from '../data/mockData'

const initialForm = {
  name: '',
  theme: '',
  state: '',
  district: '',
  venue: '',
  date: '',
  participants: '',
  status: 'Scheduled',
  photo: null,
}

const statusOptions = ['Scheduled', 'Ongoing', 'Completed', 'Cancelled']

const TrainingForm = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)

  const districts = form.state ? statesAndDistricts[form.state] || [] : []

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Training name is required'
    if (!form.theme) e.theme = 'Please select a theme'
    if (!form.state) e.state = 'Please select a state'
    if (!form.district) e.district = 'Please select a district'
    if (!form.venue.trim()) e.venue = 'Venue is required'
    if (!form.date) e.date = 'Training date is required'
    if (!form.participants || isNaN(form.participants) || parseInt(form.participants) < 1)
      e.participants = 'Enter a valid participant count'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (name === 'state') setForm(f => ({ ...f, state: value, district: '' }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(er => ({ ...er, photo: 'File size must be under 5MB' }))
        return
      }
      setForm(f => ({ ...f, photo: file }))
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result)
      reader.readAsDataURL(file)
      setErrors(er => ({ ...er, photo: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setLoading(true)
    try {
      const payload = {
        trainingName: form.name,          // backend expects trainingName
        theme: form.theme,
        state: form.state,
        district: form.district,
        venue: form.venue,
        date: form.date,
        participants: parseInt(form.participants),
        photoUrl: form.photo ? form.photo.name : '',
        status: form.status,
      }
      await createTraining(payload) // POST /training
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        navigate('/training/manage')
      }, 2500)
    } catch {
      setErrors({ submit: 'Failed to create training. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm(initialForm)
    setErrors({})
    setPhotoPreview(null)
    setSuccess(false)
  }

  if (success) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-6 animate-slide-up">
            <FiCheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 animate-slide-up">Training Created!</h2>
          <p className="text-gray-400 mb-6 animate-slide-up">
            <span className="text-blue-300 font-medium">{form.name}</span> has been successfully scheduled.
            Redirecting to dashboard...
          </p>
          <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full animate-[expand_2.5s_ease-in-out]" style={{ width: '100%', transition: 'width 2.5s linear' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          aria-label="Go back"
        >
          <FiArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <FiBookOpen className="w-6 h-6 text-blue-400" />
            Schedule Training Program
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Create a new disaster preparedness training event</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Global error */}
        {errors.submit && (
          <div className="flex items-center gap-2.5 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-sm text-red-400">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            {errors.submit}
          </div>
        )}

        <div className="glass-card p-6 space-y-6">
          {/* Section 1 – Basic Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 pb-2 border-b border-gray-800 flex items-center gap-2">
              <FiInfo className="w-4 h-4 text-blue-400" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Training Name */}
              <div className="md:col-span-2">
                <label className="label" htmlFor="name">
                  Training Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., Flood Response & Community Evacuation Training"
                  className={`input-field ${errors.name ? 'border-red-500/50 focus:ring-red-500' : ''}`}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{errors.name}</p>}
              </div>

              {/* Theme */}
              <div>
                <label className="label" htmlFor="theme">
                  <FiTag className="inline w-3.5 h-3.5 mr-1.5" />
                  Training Theme <span className="text-red-400">*</span>
                </label>
                <select
                  id="theme"
                  name="theme"
                  value={form.theme}
                  onChange={handleChange}
                  className={`input-field ${errors.theme ? 'border-red-500/50' : ''}`}
                >
                  <option value="">Select a theme</option>
                  {trainingThemes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.theme && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{errors.theme}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="label" htmlFor="status">
                  Training Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2 – Location */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 pb-2 border-b border-gray-800 flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-blue-400" /> Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* State */}
              <div>
                <label className="label" htmlFor="state">
                  State <span className="text-red-400">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={`input-field ${errors.state ? 'border-red-500/50' : ''}`}
                >
                  <option value="">Select state</option>
                  {Object.keys(statesAndDistricts).sort().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{errors.state}</p>}
              </div>

              {/* District */}
              <div>
                <label className="label" htmlFor="district">
                  District <span className="text-red-400">*</span>
                </label>
                <select
                  id="district"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  disabled={!form.state}
                  className={`input-field disabled:opacity-50 disabled:cursor-not-allowed ${errors.district ? 'border-red-500/50' : ''}`}
                >
                  <option value="">Select district</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.district && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{errors.district}</p>}
              </div>

              {/* Venue */}
              <div className="md:col-span-2">
                <label className="label" htmlFor="venue">
                  Venue / Training Centre <span className="text-red-400">*</span>
                </label>
                <input
                  id="venue"
                  name="venue"
                  type="text"
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="e.g., SDRF Training Centre, State Disaster Management Complex"
                  className={`input-field ${errors.venue ? 'border-red-500/50' : ''}`}
                />
                {errors.venue && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{errors.venue}</p>}
              </div>
            </div>
          </div>

          {/* Section 3 – Schedule & Participants */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 pb-2 border-b border-gray-800 flex items-center gap-2">
              <FiCalendar className="w-4 h-4 text-blue-400" /> Schedule & Participants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date */}
              <div>
                <label className="label" htmlFor="date">
                  <FiCalendar className="inline w-3.5 h-3.5 mr-1.5" />
                  Training Date <span className="text-red-400">*</span>
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`input-field ${errors.date ? 'border-red-500/50' : ''}`}
                />
                {errors.date && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{errors.date}</p>}
              </div>

              {/* Participants */}
              <div>
                <label className="label" htmlFor="participants">
                  <FiUsers className="inline w-3.5 h-3.5 mr-1.5" />
                  Expected Participants <span className="text-red-400">*</span>
                </label>
                <input
                  id="participants"
                  name="participants"
                  type="number"
                  min="1"
                  value={form.participants}
                  onChange={handleChange}
                  placeholder="e.g., 150"
                  className={`input-field ${errors.participants ? 'border-red-500/50' : ''}`}
                />
                {errors.participants && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{errors.participants}</p>}
              </div>
            </div>
          </div>

          {/* Section 4 – Photo Upload */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 pb-2 border-b border-gray-800 flex items-center gap-2">
              <FiImage className="w-4 h-4 text-blue-400" /> Training Photo (Optional)
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <label
                htmlFor="photo"
                className={`
                  flex-1 flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed
                  transition-all duration-200 cursor-pointer group
                  ${errors.photo ? 'border-red-500/50' : 'border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5'}
                `}
              >
                <FiImage className="w-8 h-8 text-gray-600 group-hover:text-blue-400 transition-colors" />
                <div className="text-center">
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    Click to upload training photo
                  </p>
                  <p className="text-xs text-gray-600 mt-1">PNG, JPG, JPEG up to 5MB</p>
                </div>
                <input id="photo" name="photo" type="file" accept="image/*" onChange={handleFile} className="sr-only" />
              </label>
              {photoPreview && (
                <div className="relative w-36 h-36 rounded-xl overflow-hidden border border-gray-700 flex-shrink-0">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPhotoPreview(null); setForm(f => ({ ...f, photo: null })) }}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-600 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            {errors.photo && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{errors.photo}</p>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 flex-1 sm:flex-none sm:px-8 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving Training...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                Save Training
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary flex items-center justify-center gap-2 flex-1 sm:flex-none sm:px-8 py-3"
          >
            <FiRefreshCw className="w-4 h-4" />
            Reset Form
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white text-sm px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default TrainingForm
