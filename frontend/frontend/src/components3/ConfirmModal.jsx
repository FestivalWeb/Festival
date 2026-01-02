import React from 'react';
import './MyPage.css';

const ConfirmModal = ({ open, message = '정말로 변경 하시겠습니까?', onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <div>{message}</div>
        <div className="confirm-buttons">
          <button className="confirm-yes" onClick={onConfirm}>예</button>
          <button className="confirm-no" onClick={onCancel}>아니오</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;