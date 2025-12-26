import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindId.css';
import './ForgotPassword.css';
import AuthCard from './AuthCard';

const ForgotPassword = () => {
  const [step, setStep] = useState(0); 
  const [form, setForm] = useState({ name: '', username: '', email: '', code: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false); 
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const navigate = useNavigate();

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSendCode = async () => {
    if (!form.name || !form.username || !form.email) {
      alert('이름, 아이디, 이메일을 모두 입력하세요.');
      return;
    }
    
    setSending(true);
    
    try {
      // [수정] /users -> /api/users
      const response = await fetch('/api/users/recovery/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          userId: form.username,
          type: "PW" 
        })
      });
      
      if (response.ok) {
        alert("인증번호가 메일로 발송되었습니다.");
        setIsCodeSent(true);
        setTimeLeft(180);

        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) clearInterval(timer);
            return prev - 1;
          });
        }, 1000);
      } else {
        const msg = await response.text();
        alert(msg);
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    } finally {
      setSending(false);
    }
  };

  const onSubmitFind = async () => {
    setError('');
    if (!form.code) {
      setError('인증번호를 입력하세요.');
      return;
    }

    try {
      // [수정] /users -> /api/users
      const response = await fetch('/api/users/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: form.code })
      });

      if (response.ok) {
        setStep(1); 
      } else {
        const msg = await response.text();
        setError(msg);
      }
    } catch (err) {
      setError("서버 통신 오류");
    }
  };

  const onReset = async () => {
    setError('');
    
    if (!form.password || form.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (form.password !== form.password2) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;
    if (!passwordRegex.test(form.password)) {
        setError('새 비밀번호는 8~16자이며, 영문/숫자/특수문자(!@#$%^&*?_)를 포함해야 합니다.');
        return; 
    }

    try {
      // [수정] /users -> /api/users
      const response = await fetch('/api/users/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: form.username,   
          newPassword: form.password 
        })
      });

      if (response.ok) {
        setStep(2); 
      } else {
        const msg = await response.text();
        setError(msg || "비밀번호 변경 실패");
      }

    } catch (err) {
      console.error(err);
      setError("서버 통신 오류");
    }
  };

  return (
    <AuthCard title="비밀번호 찾기" backPath="/login" className="no-bottom">
      {step === 0 && (
        <div className="findid-form-area">
          <div className="findid-form-card">
            <label>이름</label>
            <input className="findid-input" value={form.name} onChange={onChange('name')} placeholder="이름" disabled={isCodeSent} />
            <label>아이디</label>
            <input className="findid-input" value={form.username} onChange={onChange('username')} placeholder="아이디" disabled={isCodeSent} />
            <label>이메일 주소</label>
            <div style={{display:'flex', gap:8}}>
              <input className="findid-input" value={form.email} onChange={onChange('email')} placeholder="이메일" disabled={isCodeSent} />
                  <button className="auth-small-btn" type="button" onClick={onSendCode} disabled={sending || isCodeSent}>
                    {sending ? "전송중" : "인증번호 발송"}
                  </button>
            </div>
            <label style={{marginTop: 10}}>인증번호</label>
            <div style={{position: 'relative'}}>
              <input className="findid-input" value={form.code} onChange={onChange('code')} placeholder={isCodeSent ? "메일로 온 숫자 6자리" : "먼저 '인증번호 발송'을 눌러주세요"} disabled={!isCodeSent} />
              {isCodeSent && (
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#d32f2f',
                  fontSize: '13px'
                }}>
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </span>
              )}
            </div>
            <div className="error" style={{visibility: error ? 'visible' : 'hidden'}}>{error || '\u00A0'}</div>
          </div>
          <div className="actions-row">
            <button className="findid-btn" onClick={onSubmitFind}>다음</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="findid-form-area">
          <div className="verify-card">
            <p>새 비밀번호를 입력하세요.</p>
            <input className="findid-input" value={form.password} onChange={onChange('password')} type="password" placeholder="새 비밀번호(8자 이상)" />
            <input className="findid-input" value={form.password2} onChange={onChange('password2')} type="password" placeholder="새 비밀번호 확인" />
            <div className="error" style={{visibility: error ? 'visible' : 'hidden', color: 'red', fontSize: '13px'}}>{error || '\u00A0'}</div>
            <div className="actions-row">
              <button className="findid-btn" onClick={() => setStep(0)}>이전</button>
              <button className="findid-btn" onClick={onReset}>비밀번호 변경</button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="findid-result">
          <p>비밀번호가 성공적으로 변경 되었습니다.</p>
          <div className="actions-row">
            <button className="findid-btn" onClick={() => navigate('/login')}>로그인 하기</button>
            <button className="findid-btn-pink" onClick={() => navigate('/')}>홈으로 이동</button>
          </div>
        </div>
      )}
    </AuthCard>
  );
};

export default ForgotPassword;