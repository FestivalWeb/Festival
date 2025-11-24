import React from 'react';
import './Signup.css';

const Signup = ({ onNavigate }) => {
  return (
    <div className="signup-wrapper">
      <div className="signup-container full-bleed">

        {/* 중앙 회원가입 폼 */}
        <div className="signup-form-area">
          {/* 뒤로가기 버튼 (카드 우측 상단) */}
          {onNavigate && (
            <button className="signup-back-btn" onClick={() => onNavigate('login')}>
              ← 뒤로
            </button>
          )}
          {/* 제목 */}
          <div className="signup-header">
            <h2>논산 딸기 축제</h2>
          </div>

          {/* 폼 */}
          <form className="signup-form">
            <input type="text" placeholder="이름" className="signup-input" />
            <input type="email" placeholder="이메일" className="signup-input" />
            <input type="password" placeholder="비밀번호" className="signup-input" />
            <input type="password" placeholder="비밀번호 확인" className="signup-input" />

            <div className="error" style={{ minHeight: '20px', visibility: 'hidden' }}>
              &nbsp;
            </div>

            {/* 버튼 */}
            <button type="button" className="signup-btn-green">회원가입</button>
          </form>

          {/* 하단 링크 */}
          <div className="signup-footer">
            이미 계정이 있으신가요? 
            <button className="signup-login-link" onClick={() => onNavigate && onNavigate('login')}>
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
