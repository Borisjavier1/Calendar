import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function AlertToast({ message, type = 'success', duration = 4000, onClose, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!message) return

    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) {
        setTimeout(onClose, 300)
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (typeof document === 'undefined' || !message || !isVisible) return null

  const bgColor = type === 'error' ? 'bg-red-900/90' : type === 'warning' ? 'bg-yellow-900/90' : 'bg-green-900/90'
  const borderColor = type === 'error' ? 'border-red-500' : type === 'warning' ? 'border-yellow-500' : 'border-green-500'
  const textColor = type === 'error' ? 'text-red-100' : type === 'warning' ? 'text-yellow-100' : 'text-green-100'
  const icon = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅'
  const positionClass = position === 'bottom' ? 'bottom-4' : 'top-4'

  return createPortal(
    <div
      className={`pointer-events-none fixed ${positionClass} left-1/2 z-[9999] w-11/12 max-w-md -translate-x-1/2 ${bgColor} ${borderColor} rounded-xl border-2 px-6 py-4 shadow-2xl`}
      role="alert"
      aria-live="assertive"
    >
      <div className={`flex items-start gap-3 ${textColor}`}>
        <span className="text-xl mt-0.5 flex-shrink-0">{icon}</span>
        <p className="font-semibold text-sm leading-snug break-words">{message}</p>
      </div>
    </div>,
    document.body,
  )
}
