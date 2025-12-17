import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const KakaoCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // 중복 실행 방지용 Ref
  const isProcessed = useRef(false);

  useEffect(() => {
    // 이미 처리되었다면 함수 종료 (두 번째 실행 방지)
    if (isProcessed.current) return;
    isProcessed.current = true;

    const processKakaoLogin = async () => {
      // 1. URL에서 인가코드(code) 추출
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (!code) {
        alert('잘못된 접근입니다.');
        navigate('/login');
        return;
      }

      try {
        // 2. 백엔드로 인가코드 전송
        const response = await fetch(`/auth/kakao/callback?code=${code}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log('카카오 로그인 성공:', data);
          
          // ▼▼▼ [핵심 수정: 강제 주입] ▼▼▼
          // 백엔드에서 provider가 오든 안 오든, 여기는 카카오 로그인 성공 화면입니다.
          // 따라서 무조건 'provider: KAKAO'를 붙여서 저장해버립니다.
          const finalUserData = { ...data, provider: 'KAKAO' };
          
          login(finalUserData); 
          // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
          
          navigate('/mypage'); 
        } else {
          console.error("카카오 로그인 실패 응답:", data);
          alert(data.message || '카카오 로그인 실패');
          navigate('/login');
        }
      } catch (error) {
        console.error('Kakao Login Error:', error);
        alert('로그인 처리 중 오류가 발생했습니다.');
        navigate('/login');
      }
    };

    processKakaoLogin();
  }, [location, navigate, login]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 'bold'
    }}>
      <p>카카오 로그인 중입니다...</p>
      <p style={{ fontSize: '14px', fontWeight: 'normal', marginTop: '10px' }}>잠시만 기다려주세요.</p>
    </div>
  );
};

export default KakaoCallback;