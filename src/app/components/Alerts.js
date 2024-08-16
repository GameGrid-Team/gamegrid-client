import React from 'react'

const CloseIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const AlertDialog = ({ text, type }) => {
  const alertColor = type === 'success' ? 'bg-green-400' : 'bg-red-400'

  const handleClose = () => {
    const dialog = document.getElementById(`alert-${type}`)
    dialog.close()
  }
  return (
    <dialog id={`alert-${type}`} className="modal">
      <div role="alert" className={`relative ${alertColor} rounded-lg shadow-lg p-6 w-80 max-w-xs`}>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 text-white"
        >
          <CloseIcon className=" w-6 h-6 shrink-0 stroke-current" />
        </button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        ></svg>
        <span className="text-lg">{text}</span>
      </div>
    </dialog>
  )
}

export default AlertDialog
