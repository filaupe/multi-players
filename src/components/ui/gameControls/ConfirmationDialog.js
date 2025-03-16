import React from 'react';

const ConfirmationDialog = ({ visible, title, message, onConfirm, onCancel }) => {
  return (
    <div className={`confirmation-overlay ${visible ? 'visible' : ''}`}>
      <div className="confirmation-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirmation-buttons">
          <button 
            className="confirmation-button no" 
            onClick={onCancel}
          >
            Não
          </button>
          <button 
            className="confirmation-button yes" 
            onClick={onConfirm}
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;