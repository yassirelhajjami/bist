import Modal from './Modal'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Supprimer', loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirmer'} size="sm">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{message || 'Cette action est irréversible. Êtes-vous sûr ?'}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn btn-outline" disabled={loading}>Annuler</button>
          <button onClick={onConfirm} className="btn btn-danger" disabled={loading}>
            {loading ? 'Suppression...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
