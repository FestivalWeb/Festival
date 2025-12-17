import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindId.css';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(0); 
  // form 상태 관리
  const [form, setForm] = useState({ name: '', username: '', email: '', code: '', password: '', password2: '' });
  const [error, setError] = useState('');
  
  // ▼▼▼ [수정] 아까 이 부분이 빠져서 에러가 난 겁니다. (전송 중 상태 관리) ▼▼▼
  const [sending, setSending] = useState(false); 

  const navigate = useNavigate();

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // 1. 인증번호 발송 버튼 클릭 시 실행
  const onSendCode = async () => {
    if (!form.name || !form.username || !form.email) {
      alert('이름, 아이디, 이메일을 모두 입력하세요.');
      return;
    }
    
    setSending(true); // 로딩 시작
    
    try {
      const response = await fetch('/users/recovery/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          userId: form.username,
          type: "PW" // 비밀번호 찾기 모드
        })
      });
      
      if (response.ok) {
        alert("인증번호가 메일로 발송되었습니다.");
      } else {
        const msg = await response.text();
        alert(msg); // 예: "정보가 일치하지 않습니다."
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    } finally {
      setSending(false); // 로딩 끝
    }
  };

  // 2. '다음' 버튼 (인증번호 검증)
  const onSubmitFind = async () => {
    setError('');
    if (!form.code) {
      setError('인증번호를 입력하세요.');
      return;
    }

    try {
      // 인증번호 확인 API 호출
      const response = await fetch('/users/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: form.code })
      });

      if (response.ok) {
        setStep(1); // 다음 단계(비번 변경)로 이동
      } else {
        const msg = await response.text();
        setError(msg);
      }
    } catch (err) {
      setError("서버 통신 오류");
    }
  };

  // 3. 비밀번호 변경 요청 (강제 초기화)
  const onReset = async () => {
    setError('');
    
    // 유효성 검사
    if (!form.password || form.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (form.password !== form.password2) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 비밀번호 강제 변경 API 호출
      const response = await fetch('/users/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: form.username,    // 아이디
          newPassword: form.password // 새 비밀번호
        })
      });

      if (response.ok) {
        // 성공 시 완료 화면(Step 2)으로 이동
        setStep(2); 
      } else {
        // 실패 시 에러 메시지
        const msg = await response.text();
        setError(msg || "비밀번호 변경 실패");
      }

    } catch (err) {
      console.error(err);
      setError("서버 통신 오류");
    }
  };

  return (
    <div className="findid-wrapper no-bottom">
      <div className="findid-container full-bleed">
        <div className="findid-card">
          <div className="findid-header"><h2>비밀번호 찾기</h2></div>

          {step === 0 && (
            <div className="findid-form-area">
              <div className="findid-form-card">
                <label>이름</label>
                <input className="findid-input" value={form.name} onChange={onChange('name')} placeholder="이름" />
                
                <label>아이디</label>
                <input className="findid-input" value={form.username} onChange={onChange('username')} placeholder="아이디" />
                
                <label>이메일 주소</label>
                <div style={{display:'flex', gap:8}}>
                  <input className="findid-input" value={form.email} onChange={onChange('email')} placeholder="이메일" />
                  
                  {/* 여기가 에러가 났던 부분입니다. 이제 sending 변수가 있으니 정상 작동합니다. */}
                  <button className="findid-small-btn" type="button" onClick={onSendCode} disabled={sending}>
                    {sending ? "전송중" : "인증번호 발송"}
                  </button>
                </div>
                
                {/* 인증번호 입력칸 */}
                <label style={{marginTop: 10}}>인증번호</label>
                <input className="findid-input" value={form.code} onChange={onChange('code')} placeholder="메일로 온 숫자 6자리" />
                
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
                <div className="error" style={{visibility: error ? 'visible' : 'hidden'}}>{error || '\u00A0'}</div>
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
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;