import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/api'; // 위에서 만든 axios 인스턴스 import
import './AdminAuth.css';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',       // 백엔드 DTO의 username에 매핑
    name: '',     // name
    email: '',    // email
    password: '', // password
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const requestData = {
      username: formData.id, // 프론트의 'id' -> 백엔드의 'username'
      name: formData.name,
      password: formData.password,
      email: formData.email
    };

    try {
      // POST /api/admin/auth/signup 요청
      const response = await adminApi.post('/api/admin/auth/signup', requestData);

      // 성공 시 (백엔드 로직상 바로 로그인되지 않고 PENDING 상태임)
      console.log('가입 성공:', response.data);
      alert('가입 신청이 완료되었습니다.\nSUPER 관리자 승인 후 로그인할 수 있습니다.');
      navigate('/admin/login');

    } catch (error) {
      console.error('가입 실패:', error);
      // 백엔드에서 보낸 에러 메시지 표시 (예: "이미 사용 중인 아이디입니다.")
      const errorMsg = error.response?.data?.message || '가입 신청 중 오류가 발생했습니다.';
      alert(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '480px' }}> {/* 가입폼은 조금 더 넓게 */}
        <div className="auth-header">
          <h2>관리자 가입 신청</h2>
          <p>새로운 관리자 계정을 생성합니다.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="id">아이디</label>
            <input
              type="text"
              id="id"
              name="id"
              className="auth-input"
              placeholder="사용할 아이디 입력"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              className="auth-input"
              placeholder="실명 입력"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              className="auth-input"
              placeholder="example@admin.com"
              value={formData.email}
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
              placeholder="6자 이상 입력"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="auth-input"
              placeholder="비밀번호 재입력"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-auth">가입 신청하기</button>
        </form>

        <div className="auth-footer">
          이미 계정이 있으신가요? 
          <span className="auth-link" onClick={() => navigate('/admin/login')}>
            로그인하기
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;