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

      // [수정 포인트] 무조건 json()을 먼저 하지 말고, 성공/실패를 먼저 나눕니다.
      if (response.ok) {
        // 성공 시에는 백엔드가 JSON을 주므로 json() 호출
        const data = await response.json(); 
        
        console.log('로그인 성공:', data);
        login({ id: data.userId, name: data.userId });
        navigate('/mypage');
      } else {
        // 실패 시에는 백엔드가 "단순 텍스트"를 줄 수도 있고 "JSON"을 줄 수도 있음
        // 일단 텍스트로 받습니다.
        const errorText = await response.text();
        
        // 혹시 JSON인지 확인해보고 파싱 시도 (GlobalExceptionHandler 외 다른 에러 대비)
        try {
            const jsonError = JSON.parse(errorText);
            setError(jsonError.message || jsonError || '아이디 또는 비밀번호가 올바르지 않습니다.');
        } catch (e) {
            // JSON 파싱 실패 -> 그냥 텍스트 에러 메시지임
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
    // 백엔드의 카카오 로그인 페이지 컨트롤러로 이동 (redirect)
    // 이 URL은 백엔드에서 카카오 인증 URL로 리다이렉트 해줍니다.
    window.location.href = 'http://localhost:8080/login/page';
  };

  return (
    <div className="login-wrapper">
      <div className="login-container full-bleed">
        <div className="login-form-area">
          <button className="login-back-btn" onClick={() => goTo('home')}>
            ← 뒤로
          </button>
          <div className="login-header">
            <h2>논산 딸기 축제</h2>
          </div>

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