import React, { useState } from 'react';
import './Login.css';
import kakaoIcon from '../assets/카카오톡 아이콘.png';

const Login = ({ onNavigate, onLoginSuccess }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // 임시 인증: id=admin, password=admin
    setTimeout(() => {
      if (id === 'admin' && password === 'admin') {
        // 로그인 성공: 세션에 사용자 저장
        sessionStorage.setItem('user', JSON.stringify({ id: 'admin', name: '관리자' }));
        onLoginSuccess && onLoginSuccess();
        onNavigate && onNavigate('mypage');
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container full-bleed">

        {/* 중앙 로그인 폼 */}
        <div className="login-form-area">
          {/* 뒤로가기 버튼 (카드 우측 상단) */}
          {onNavigate && (
            <button className="login-back-btn" onClick={() => onNavigate('home')}>
              ← 뒤로
            </button>
          )}
          {/* 제목 */}
          <div className="login-header">
            <h2>논산 딸기 축제</h2>
          </div>

          {/* 폼 */}
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="아이디"
              className="login-input"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="error" style={{ minHeight: '20px', visibility: error ? 'visible' : 'hidden' }}>
              {error}
            </div>

            {/* 버튼 */}
            <button type="submit" className="login-btn-green" disabled={loading}>{loading ? '로그인...' : '로그인'}</button>
            <button type="button" className="login-btn-yellow">
              <img src={kakaoIcon} alt="카카오톡" className="kakao-icon" /> 카카오톡으로 로그인
            </button>
          </form>

          {/* 하단 링크 */}
          <div className="login-footer">
            <a href="#/">비밀번호 찾기</a>
            <span> | </span>
            <a href="#/">아이디 찾기</a>
            <span> | </span>
            <button
              className="login-signup-link"
              onClick={() => onNavigate && onNavigate('signup')}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
