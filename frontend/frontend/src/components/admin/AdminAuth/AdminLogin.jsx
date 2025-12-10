import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from "../../../api/api";
import './AdminAuth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [error, setError] = useState('');

  // [추가] 로딩 상태 (체크하는 동안 깜빡임 방지용)
  const [isLoading, setIsLoading] = useState(true);

  // [추가] 1. 컴포넌트가 열리자마자 로그인 상태인지 체크
  useEffect(() => {
    const checkAlreadyLoggedIn = async () => {
      try {
        // 내 정보 조회 API 호출 (쿠키가 있다면 백엔드가 200 OK와 정보를 줌)
        await adminApi.get('/api/admin/auth/me');
        
        // 에러 없이 성공했다면 이미 로그인된 상태임 -> 대시보드로 이동
        navigate('/admin/dashboard'); 
      } catch (error) {
        // 401 에러 등이 나면 로그인이 안 된 상태 -> 그냥 로그인 폼 보여주면 됨
        setIsLoading(false);
      }
    };

    checkAlreadyLoggedIn();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // 에러 초기화

    const requestData = {
      username: formData.id,
      password: formData.password
    };

    try {
      // POST /api/admin/auth/login
      // credentials: true 덕분에 응답 헤더의 Set-Cookie가 브라우저에 저장됨
      const response = await adminApi.post('/api/admin/auth/login', requestData);

      console.log('로그인 성공:', response.data);
      // response.data 안에는 username, adminName, approveStatus 등이 들어있음.
      // 필요하다면 전역 상태(Context)나 localStorage에 '이름' 정도만 저장 (보안상 토큰은 저장 X)
      
      // 예: localStorage.setItem('adminName', response.data.adminName);

      navigate('/admin/dashboard'); 

    } catch (err) {
      console.error('로그인 에러:', err);
      
      // 백엔드 에러 메시지 처리
      // AdminAuthService에서 던지는 메시지들:
      // - "아이디 또는 비밀번호가 올바르지 않습니다."
      // - "승인 대기 중인 관리자 계정입니다..."
      // - "비활성화된 관리자 계정입니다."
      const msg = err.response?.data?.message || '로그인에 실패했습니다. (서버 연결 오류)';
      setError(msg);
    }
  };

  // [추가] 로딩 중이면 화면을 비워둠 (로그인 폼이 잠깐 번쩍이는 것 방지)
  if (isLoading) {
    return <div className="auth-container" style={{ color: 'white' }}></div>; 
  }
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>관리자 로그인</h2>
          <p>Admin Dashboard에 접속하기 위해 로그인해주세요.</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="id">아이디</label>
            <input
              type="text"
              id="id"
              name="id"
              className="auth-input"
              placeholder="admin"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              className="auth-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-auth">로그인</button>
        </form>

        <div className="auth-footer">
          계정이 없으신가요? 
          <span className="auth-link" onClick={() => navigate('/admin/signup')}>
            관리자 가입 신청
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;