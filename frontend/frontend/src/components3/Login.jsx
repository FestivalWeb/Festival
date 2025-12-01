import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import kakaoIcon from '../assets/카카오톡 아이콘.png';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const goTo = (path) => {
    // map simple page keys used in old onNavigate to router paths
    if (path === 'home') return navigate('/');
    if (path === 'mypage') return navigate('/mypage');
    if (path === 'findId') return navigate('/findId');
    if (path === 'forgotPassword') return navigate('/forgotPassword');
    if (path === 'signup') return navigate('/signup');
    // fallback: treat as path
    return navigate(path.startsWith('/') ? path : `/${path}`);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // 임시 인증: id=admin, password=admin

    setTimeout(() => {
      if (id === 'admin' && password === 'admin') {
        // 로그인 성공: auth context에 사용자 저장
        const userObj = { id: 'admin', name: '관리자' };
        login(userObj);
        navigate('/mypage');
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
          <button className="login-back-btn" onClick={() => goTo('home')}>
            ← 뒤로
          </button>
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
            <button className="login-link" type="button" onClick={() => goTo('forgotPassword')}>비밀번호 찾기</button>
            <span> | </span>
            <button className="login-link" type="button" onClick={() => goTo('findId')}>아이디 찾기</button>
            <span> | </span>
            <button
              className="login-signup-link"
              onClick={() => goTo('signup')}
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
