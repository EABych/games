import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmColor?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  confirmColor = '#FF3B30'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-actions">
          <button 
            className="modal-button cancel-button" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className="modal-button confirm-button" 
            onClick={onConfirm}
            style={{ backgroundColor: confirmColor }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};