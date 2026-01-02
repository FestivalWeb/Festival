import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const KakaoCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    const processKakaoLogin = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (!code) {
        alert('잘못된 접근입니다.');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`/auth/kakao/callback?code=${code}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log('카카오 로그인 성공:', data);
          
          // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
          // [필수 추가] 이 코드가 없어서 예약이 안 된 겁니다!
          // 백엔드에서 받은 ID를 브라우저 저장소에 강제로 저장합니다.
          if (data.userId) {
              localStorage.setItem("userId", data.userId);
          } else {
              // 혹시 data.userId가 없다면 data.id일 수도 있으니 대비
              console.warn("userId 필드가 없습니다. data 구조 확인 필요:", data);
              if (data.id) localStorage.setItem("userId", data.id);
          }
          // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

          const finalUserData = { ...data, provider: 'KAKAO' };
          
          login(finalUserData); 
          
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