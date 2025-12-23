import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const AuthCard = ({ title, backPath, backText = '← 뒤로', children, className = '' }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (!backPath) return;
    navigate(backPath);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container full-bleed">
        <div className={`login-form-area ${className}`}>
          {backPath && (
            <button type="button" className="login-back-btn" onClick={handleBack}>
              {backText}
            </button>
          )}

          {title && (
            <div className="login-header">
              <h2>{title}</h2>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
