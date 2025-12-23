import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindId.css';
import AuthCard from './AuthCard';

const FindId = () => {
  const [step, setStep] = useState(0); // 0: 입력폼, 1: 성공, 2: 실패
  const [form, setForm] = useState({ name: '', email: '', code: '' });
  const [error, setError] = useState('');
  
  // 인증번호 관련 상태
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [foundId, setFoundId] = useState('');

  const navigate = useNavigate();

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // 1. 인증번호 발송
  const handleSendCode = async () => {
    if (!form.name || !form.email) {
      alert('이름과 이메일을 입력해주세요.');
      return;
    }
    setError('');

    try {
      // ▼▼▼ [수정] 주소 앞에 /api 추가 ▼▼▼
      const res = await fetch('/api/users/recovery/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, type: 'ID' })
      });

      if (res.ok) {
        alert('인증번호가 발송되었습니다.');
        setIsCodeSent(true);
        setTimeLeft(180); // 3분
        
        // 타이머 시작
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) clearInterval(timer);
                return prev - 1;
            });
        }, 1000);
      } else {
        const msg = await res.text();
        // ▼▼▼ [수정] 에러(카카오 계정 등)를 팝업으로 띄워서 확실히 알려줌 ▼▼▼
        alert(msg); 
        // setError(msg); // (기존 방식 대신 alert 사용 추천)
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류가 발생했습니다.');
    }
  };

  // 2. 아이디 찾기 요청 (다음 버튼 클릭 시)
  const onSubmit = async () => {
    setError('');
    
    if (!isCodeSent) {
      alert('인증번호를 먼저 발송해주세요.');
      return;
    }
    if (!form.code) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    try {
      // ▼▼▼ [수정] 주소 앞에 /api 추가 ▼▼▼
      const res = await fetch('/api/users/recovery/find-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            name: form.name, 
            email: form.email, 
            code: form.code 
        })
      });

      if (res.ok) {
        const userId = await res.text();
        setFoundId(userId);
        setStep(1); // 성공 화면으로 이동
      } else {
        const msg = await res.text();
        setError(msg);
      }
    } catch (err) {
      setStep(2); // 실패 화면으로 이동
    }
  };

  return (
    <AuthCard title="아이디 찾기" backPath="/login">
      {/* 단계 0: 정보 입력 */}
      {step === 0 && (
        <div className="findid-form-area">
          <div className="findid-form-card">
            <label>이름</label>
            <input 
                className="findid-input" 
                value={form.name} 
                onChange={onChange('name')} 
                placeholder="이름을 입력하세요" 
                disabled={isCodeSent}
            />
            
            <label>이메일 주소</label>
            <div style={{display:'flex', gap:8}}>
              <input 
                className="findid-input" 
                value={form.email} 
                onChange={onChange('email')} 
                placeholder="이메일을 입력하세요" 
                disabled={isCodeSent}
              />
              <button 
                className="findid-small-btn" 
                type="button" 
                onClick={handleSendCode}
                disabled={isCodeSent}
              >
                인증번호 발송
              </button>
            </div>

            {/* 인증번호 입력 필드 (발송 후 표시) */}
            {isCodeSent && (
                <>
                    <label>인증번호</label>
                    <div style={{position: 'relative'}}>
                        <input 
                            className="findid-input" 
                            value={form.code} 
                            onChange={onChange('code')} 
                            placeholder="인증번호 6자리" 
                        />
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
                    </div>
                </>
            )}

            <div className="error" style={{visibility: error ? 'visible' : 'hidden'}}>
                {error || '\u00A0'}
            </div>
          </div>
          <div className="actions-row">
            <button className="findid-btn" onClick={onSubmit}>다음</button>
          </div>
        </div>
      )}

      {/* 단계 1: 성공 결과 */}
      {step === 1 && (
        <div className="findid-result">
          <p>아이디 찾기가 완료 되었습니다.</p>
          {/* 찾은 아이디 표시 */}
          <input className="findid-id" value={foundId} readOnly />
          <div className="actions-row">
            <button className="findid-btn" onClick={() => navigate('/login')}>로그인</button>
            <button className="findid-btn-pink" onClick={() => navigate('/forgotPassword')}>비밀번호 찾기</button>
          </div>
        </div>
      )}

      {/* 단계 2: 실패 결과 */}
      {step === 2 && (
        <div className="findid-notfound">
          <p>회원님의 아이디를 찾을 수 없습니다.<br/>정보를 다시 확인해주세요.</p>
          <div className="actions-row">
            <button className="findid-btn" onClick={() => { 
                setStep(0); 
                setError(''); 
                setIsCodeSent(false); 
                setForm({name:'', email:'', code:''}); 
            }}>다시 찾기</button>
            <button className="findid-btn-pink" onClick={() => navigate('/')}>홈으로 이동</button>
          </div>
        </div>
      )}
    </AuthCard>
  );
};

export default FindId;