import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import kakaoIcon from '../assets/카카오톡 아이콘.png';
import AuthCard from './AuthCard';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const goTo = (path) => {
    if (path === 'home') return navigate('/');
    if (path === 'mypage') return navigate('/mypage');
    if (path === 'findId') return navigate('/findId');
    if (path === 'forgotPassword') return navigate('/forgotPassword');
    if (path === 'signup') return navigate('/signup');
    return navigate(path.startsWith('/') ? path : `/${path}`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: id,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json(); 
        
        console.log('로그인 성공:', data);

        // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
        // [수정 완료] 일반 로그인 시에도 아이디를 저장해야 예약이 됩니다!
        if (data.userId) {
            localStorage.setItem('userId', data.userId);
        } else {
            // 혹시 userId가 없으면 id라도 저장 (백엔드 응답 구조에 따라 다름)
            localStorage.setItem('userId', id); 
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        login({ id: data.userId, name: data.userId });
        navigate('/mypage');
      } else {
        const errorText = await response.text();
        
        try {
            const jsonError = JSON.parse(errorText);
            setError(jsonError.message || jsonError || '아이디 또는 비밀번호가 올바르지 않습니다.');
        } catch (e) {
            setError(errorText || '아이디 또는 비밀번호가 올바르지 않습니다.');
        }
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('서버 연결 실패: 백엔드가 켜져있는지 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = 'http://localhost:8080/login/page';
  };

  return (
    <AuthCard title="논산딸기축제" backPath="/">
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

        <button type="submit" className="login-btn-green" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <button 
          type="button" 
          className="login-btn-yellow" 
          onClick={handleKakaoLogin}
        >
          <img src={kakaoIcon} alt="카카오톡" className="kakao-icon" /> 카카오톡으로 로그인
        </button>
      </form>

      <div className="login-footer">
        <button className="login-link" type="button" onClick={() => goTo('findId')}>아이디 찾기</button>
        <span> | </span>
        <button className="login-link" type="button" onClick={() => goTo('forgotPassword')}>비밀번호 찾기</button>
        <span> | </span>
        <button className="login-link" type="button" onClick={() => goTo('signup')}>회원가입</button>
      </div>
    </AuthCard>
  );
};

export default Login;