import React from 'react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-blue-500 border-t-transparent animate-spin`}
      />
      {text && <p className="text-sm text-gray-400 animate-pulse">{text}</p>}
    </div>
  )
}

export const PageLoader = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">D</span>
        </div>
        <span className="text-xl font-bold text-white">DisasterTrain360 AI</span>
      </div>
      <LoadingSpinner size="lg" text="Initializing platform..." />
    </div>
  </div>
)

export default LoadingSpinner
