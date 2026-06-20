import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function AppModal({ title, children, onClose, maxWidth = 'max-w-4xl' }) {
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        className={`max-h-[90vh] w-full ${maxWidth} overflow-hidden rounded-2xl border-2 border-yellow-400/30 bg-gray-950 shadow-[0_0_35px_rgba(250,204,21,0.15)]`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-yellow-400/20 px-5 py-4">
          <h3 className="text-xl font-bold uppercase text-yellow-300">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-yellow-400/40 px-3 py-1.5 text-sm font-semibold text-yellow-300 hover:bg-yellow-400/10"
          >
            Cerrar
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </section>
    </div>,
    document.body,
  )
}