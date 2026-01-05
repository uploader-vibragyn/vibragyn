import "./confirmModal.css";

export default function ConfirmModal({
  open,
  title = "Confirmar ação",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  danger = false,
}) {
  if (!open) return null;

  return (
    <div
      className="confirm-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="confirm-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="confirm-title">{title}</h3>

        {message && (
          <p className="confirm-message">{message}</p>
        )}

        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-btn cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`confirm-btn ${
              danger ? "danger" : "primary"
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
