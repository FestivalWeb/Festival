import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from "../../../api/api";
import './AdminAuth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [error, setError] = useState('');

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