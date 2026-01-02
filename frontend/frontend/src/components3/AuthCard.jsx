import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import './AuthCommon.css';

const AuthCard = ({ title, backPath, children, className = '' }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (!backPath) return;
    navigate(backPath);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container full-bleed">
        <div className={`login-form-area ${className}`}>
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