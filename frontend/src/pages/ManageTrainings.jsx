import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiList, FiPlusSquare, FiArrowLeft } from 'react-icons/fi'
import TrainingTable from '../components/TrainingTable'
import { mockTrainings } from '../data/mockData'

const ManageTrainings = () => {
  const navigate = useNavigate()
  // In production this would fetch only the provider's own trainings
  const [trainings] = useState(mockTrainings)

  return (
    <div className="page-container">
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
        <button
          onClick={() => navigate('/training/create')}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlusSquare className="w-4 h-4" />
          New Training
        </button>
      </div>

      <div className="glass-card p-5">
        <TrainingTable trainings={trainings} />
      </div>
    </div>
  )
}

export default ManageTrainings
